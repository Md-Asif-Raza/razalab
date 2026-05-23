'use client';

import { useEffect } from 'react';

/**
 * Registers the image-cache service worker.
 * Renders nothing — pure side-effect component.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw-image-cache.js', { scope: '/' })
      .then((reg) => {
        // Auto-update on new SW versions
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                // New SW active — cached images will use new cache version
              }
            });
          }
        });
      })
      .catch((err) => {
        console.warn('[SW] Registration failed:', err);
      });
  }, []);

  return null;
}
