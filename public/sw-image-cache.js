// ═══════════════════════════════════════════════════════════════
// IMAGE CACHE SERVICE WORKER
// Caches Supabase & Unsplash images in browser Cache API.
// After first load → images serve instantly (0ms) from cache.
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'razalab-img-v1';

// Domains whose images we want to cache aggressively
const CACHEABLE_ORIGINS = [
  'supabase.co',
  'supabase.in',
  'supabase.com',
  'unsplash.com',
  'images.unsplash.com',
];

// Max cache entries to prevent unbounded growth
const MAX_ENTRIES = 200;

/**
 * Check if a request URL is an image we should cache
 */
function isCacheableImage(url) {
  try {
    const parsed = new URL(url);
    // Match any Supabase or Unsplash domain
    const matchesOrigin = CACHEABLE_ORIGINS.some(
      (domain) => parsed.hostname.endsWith(domain)
    );
    if (!matchesOrigin) return false;

    // Only cache image file types or storage paths
    const path = parsed.pathname.toLowerCase();
    const isImage =
      path.includes('/storage/') ||
      path.includes('/object/') ||
      /\.(jpg|jpeg|png|gif|webp|avif|svg|bmp|ico)(\?|$)/i.test(url);
    return isImage || path.includes('/render/image');
  } catch {
    return false;
  }
}

// ── Install: pre-cache nothing, just activate quickly ──
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// ── Activate: claim all clients immediately ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: Cache-first for images, network-first for everything else ──
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only intercept GET requests for cacheable images
  if (request.method !== 'GET' || !isCacheableImage(request.url)) {
    return; // Let the browser handle it normally
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Try cache first (instant)
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }

      // 2. Not in cache → fetch from network
      try {
        const networkResponse = await fetch(request);

        // Only cache successful responses
        if (networkResponse.ok) {
          // Clone before consuming
          const responseClone = networkResponse.clone();

          // Store in cache (async, don't block response)
          cache.put(request, responseClone).then(() => trimCache(cache));
        }

        return networkResponse;
      } catch (err) {
        // Network failed and no cache — return a transparent pixel as fallback
        return new Response(
          'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          {
            headers: { 'Content-Type': 'image/gif' },
          }
        );
      }
    })
  );
});

/**
 * Trim the cache to MAX_ENTRIES (evict oldest first)
 */
async function trimCache(cache) {
  const keys = await cache.keys();
  if (keys.length > MAX_ENTRIES) {
    // Delete oldest entries (first in = oldest)
    const toDelete = keys.slice(0, keys.length - MAX_ENTRIES);
    await Promise.all(toDelete.map((key) => cache.delete(key)));
  }
}
