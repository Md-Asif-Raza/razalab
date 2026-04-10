'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import './admin.css';
import {
  getCampaigns, syncCampaign, deleteCampaign,
  getTestimonials, syncTestimonial, deleteTestimonial,
  getReviews, syncReview, deleteReview,
  getFaqs, syncFaq, deleteFaq,
  getHeroContent, syncHeroContent,
  getSiteSettings, syncSiteSettings,
  getBrands, syncBrand, deleteBrand,
  getTechStack, syncTechStack, deleteTechStack,
  uploadImage,
} from '@/lib/actions';

// =============================================
// TOAST SYSTEM
// =============================================
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`cms-toast ${type}`} style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 99999,
      padding: '16px 28px', borderRadius: '12px',
      background: type === 'success' ? 'rgba(0,230,118,0.15)' : 'rgba(224,82,82,0.15)',
      border: `1px solid ${type === 'success' ? 'rgba(0,230,118,0.3)' : 'rgba(224,82,82,0.3)'}`,
      color: type === 'success' ? '#00e676' : '#e05252',
      fontSize: '0.85rem', fontWeight: 600, backdropFilter: 'blur(12px)',
    }}>
      {type === 'success' ? '✓' : '✕'} {message}
    </div>
  );
}

// =============================================
// IMAGE UPLOAD COMPONENT
// =============================================
function ImageField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const result = await uploadImage(fd);
      onChange(result.url);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {value && <img src={value} className="cms-image-preview-mini" alt="Preview" />}
        <input
          type="text"
          className="form-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
        <label className="cms-upload-label">
          {isUploading ? '...' : 'Upload'}
          <input type="file" hidden onChange={handleFileChange} accept="image/*" />
        </label>
      </div>
    </div>
  );
}

function GraphDataInputs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parts = value.split(',').map(p => p.trim());
  const days = Array.from({ length: 7 }, (_, i) => parts[i] || '0');

  const updateDay = (idx: number, newVal: string) => {
    const next = [...days];
    next[idx] = newVal || '0';
    onChange(next.join(','));
  };

  return (
    <div className="form-group mb-16">
      <label className="form-label">Weekly Growth Data (7 Days)</label>
      <div className="graph-grid-inputs" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {days.map((d, i) => (
          <div key={i}>
            <div className="graph-day-label" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>D{i + 1}</div>
            <input
              type="number"
              className="form-input graph-day-input"
              value={d}
              onChange={(e) => updateDay(i, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================
// CONFIRM DELETE MODAL
// =============================================
function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="cms-modal-overlay" onClick={onCancel}>
      <div className="cms-modal-box" onClick={(e) => e.stopPropagation()}>
        <p className="cms-modal-text">{message}</p>
        <div className="cms-modal-actions">
          <button onClick={onCancel} className="cms-btn cms-btn-ghost">Cancel</button>
          <button onClick={onConfirm} className="cms-btn cms-btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}

// =============================================
// MAIN ADMIN PAGE
// =============================================
export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

  // Data states
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqsList] = useState<any[]>([]);
  const [brands, setBrandsList] = useState<any[]>([]);
  const [techStack, setTechStackList] = useState<any[]>([]);
  const [heroData, setHeroData] = useState<any>({
    title: 'The Raza Labs', title_accent: 'for organic marketing',
    subtitle: '', cta_text: 'Get In Touch', cta_link: '#cta-end', stats_text: '527,00,000+',
  });
  const [settingsData, setSettingsData] = useState<any>({
    instagram_url: 'https://instagram.com', youtube_url: 'https://youtube.com', twitter_url: 'https://x.com',
    video_url: '', video_poster: '', video_caption: 'Over 527 million views generated across clients',
    video_cta_text: 'Book a Call →', video_cta_link: 'https://calendly.com/razalabs',
    cta_title: 'The Raza Labs', cta_title_accent: 'for organic growth',
    cta_subtitle: '', cta_button_text: 'Get in Touch →', cta_button_link: '#calculator',
    target_cpm: 25.0, organic_cpm: 1.0, platform_multiplier: 3, days_multiplier: 7
  });

  // Edit form state
  const [editItem, setEditItem] = useState<any>(null);
  const [editType, setEditType] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    // Auth check — redirect if no session cookie
    const cookies = document.cookie;
    if (!cookies.includes('sb-session')) {
      window.location.href = '/login';
      return;
    }
    setAuthed(true);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [c, t, f, h, s, b, ts] = await Promise.all([
        getCampaigns(), getTestimonials(), getFaqs(), getHeroContent(), getSiteSettings(), getBrands(), getTechStack()
      ]);
      setCampaigns(c || []);
      setTestimonials(t || []);
      setFaqsList(f || []);
      setBrandsList(b || []);
      setTechStackList(ts || []);
      if (h) setHeroData(h);
      if (s) setSettingsData(s);
    } catch { /* silently use defaults */ }
    setLoading(false);
  }, []);

  useEffect(() => { if (mounted) loadData(); }, [mounted, loadData]);

  if (!mounted || !authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050304', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
      Authenticating...
    </div>
  );

  const validateItem = (): string | null => {
    if (!editItem) return 'No item to save';
    if (editType === 'campaign') {
      if (!editItem.name?.trim()) return 'Campaign name is required';
      if (!editItem.category?.trim()) return 'Category is required';
    } else if (editType === 'testimonial') {
      if (!editItem.name?.trim()) return 'Name is required';
      if (!editItem.quote?.trim()) return 'Quote is required';
    } else if (editType === 'review') {
      if (!editItem.name?.trim()) return 'Name is required';
      if (!editItem.content?.trim()) return 'Review content is required';
    } else if (editType === 'faq') {
      if (!editItem.question?.trim()) return 'Question is required';
      if (!editItem.answer?.trim()) return 'Answer is required';
    } else if (editType === 'brand') {
      if (!editItem.name?.trim()) return 'Brand name is required';
    } else if (editType === 'tech') {
      if (!editItem.name?.trim()) return 'Service name is required';
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateItem();
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }
    setLoading(true);
    try {
      if (editType === 'campaign') await syncCampaign(editItem);
      else if (editType === 'testimonial') await syncTestimonial(editItem);
      else if (editType === 'review') await syncReview(editItem);
      else if (editType === 'faq') await syncFaq(editItem);
      else if (editType === 'brand') await syncBrand(editItem);
      else if (editType === 'tech') await syncTechStack(editItem);

      showToast(`${editType.charAt(0).toUpperCase() + editType.slice(1)} saved!`);
      setEditItem(null);
      setEditType('');
      await loadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      if (deleteTarget.type === 'campaign') await deleteCampaign(deleteTarget.id);
      else if (deleteTarget.type === 'testimonial') await deleteTestimonial(deleteTarget.id);
      else if (deleteTarget.type === 'review') await deleteReview(deleteTarget.id);
      else if (deleteTarget.type === 'faq') await deleteFaq(deleteTarget.id);
      else if (deleteTarget.type === 'brand') await deleteBrand(deleteTarget.id);
      else if (deleteTarget.type === 'tech') await deleteTechStack(deleteTarget.id);

      showToast(`Deleted "${deleteTarget.name}"`);
      setDeleteTarget(null);
      await loadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
    setLoading(false);
  };

  const handleSaveHeroAndCTA = async () => {
    setLoading(true);
    try {
      await Promise.all([syncHeroContent(heroData), syncSiteSettings(settingsData)]);
      showToast('Hero & CTA content saved!');
    } catch (err: any) { showToast(err.message, 'error'); }
    setLoading(false);
  };

  const handleSaveMedia = async () => {
    setLoading(true);
    try {
      await syncSiteSettings(settingsData);
      showToast('Media settings saved!');
    } catch (err: any) { showToast(err.message, 'error'); }
    setLoading(false);
  };

  const handleSaveGlobal = async () => {
    setLoading(true);
    try {
      await syncSiteSettings(settingsData);
      showToast('Global settings saved!');
    } catch (err: any) { showToast(err.message, 'error'); }
    setLoading(false);
  };

  const tabs = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'campaigns', icon: '💼', label: 'Campaigns' },
    { key: 'testimonials', icon: '🧩', label: 'Testimonials' },
    { key: 'faqs', icon: '❓', label: 'FAQs' },
    { key: 'brands', icon: '🏢', label: 'Brands & Logos' },
    { key: 'tech', icon: '⚙️', label: 'What We Do' },
    { key: 'hero', icon: '🏠', label: 'Hero & CTA' },
    { key: 'media', icon: '🎬', label: 'Media' },
    { key: 'settings', icon: '🔧', label: 'Settings & Calc' },
  ];

  return (
    <div id="admin" className="active" style={{ display: 'flex', minHeight: '100vh', background: '#050304' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && <ConfirmModal message={`Delete "${deleteTarget.name}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <div className="admin-brand">
          <div className="logo-circle-admin"><img src="/logo.png" alt="Logo" /></div>
          <span>Raza<span>Labs</span></span>
        </div>
        <div style={{ padding: '0 12px' }}>
          {tabs.map(t => (
            <div key={t.key} className={`admin-nav-item ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              {t.icon} {t.label}
            </div>
          ))}
          <Link href="/" className="admin-nav-item" style={{ marginTop: '32px', opacity: 0.5 }}>← Back to Site</Link>
          <div 
            className="admin-nav-item" 
            style={{ opacity: 0.5, cursor: 'pointer', color: '#e05252', marginTop: '8px' }}
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
          >
            ⏻ Logout
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-main">
        {loading && <div className="cms-loading-shimmer" />}

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <>
            <h1 className="cms-page-title">Dashboard</h1>
            <div className="admin-stats-row">
              {[{ label: 'Campaigns', val: campaigns.length, color: '#4d96ff' }, { label: 'Testimonials', val: testimonials.length, color: '#00e676' }, { label: 'Brands', val: brands.length, color: '#ffc107' }, { label: 'FAQs', val: faqs.length, color: '#e05252' }].map(s => (
                <div key={s.label} className="admin-stat-card">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
            <div className="cms-quick-actions-grid">
              {tabs.filter(t => t.key !== 'dashboard').map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} className="cms-quick-action">{t.icon} Manage {t.label}</button>
              ))}
            </div>
          </>
        )}

        {/* CAMPAIGNS */}
        {tab === 'campaigns' && (
          <>
            <div className="cms-section-header">
              <h1 className="cms-page-title">Campaigns</h1>
              <button className="cms-btn cms-btn-primary" onClick={() => { setEditType('campaign'); setEditItem({ name: '', category: '', result: '', price: '', description: '', graph_data: '', img_url: '', sort_order: campaigns.length }); }}>+ Add Campaign</button>
            </div>
            <div className="cms-card-grid">
              {campaigns.length === 0 && <div className="cms-empty">No campaigns yet. Click "+ Add Campaign" to get started.</div>}
              {campaigns.map(c => (
                <div key={c.id} className="cms-item-card">
                  {(c.img_url || c.media_url || c.img) && <img src={c.img_url || c.media_url || c.img} alt={c.name || c.title} className="cms-item-thumb" />}
                  <div className="cms-item-body">
                    <h3 className="cms-item-name">{c.name}</h3>
                    <div className="cms-item-meta">{c.category} · {c.result} · {c.price || 'N/A'}</div>
                    {c.description && <p className="cms-item-desc">{c.description.slice(0, 100)}{c.description.length > 100 ? '...' : ''}</p>}
                    <div className="cms-item-actions">
                      <button className="td-btn" onClick={() => { setEditType('campaign'); setEditItem(c); }}>✎ Edit</button>
                      <button className="td-btn danger" onClick={() => setDeleteTarget({ type: 'campaign', id: c.id, name: c.name })}>✕ Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {editType === 'campaign' && (
              <div className="cms-edit-overlay" onClick={() => { setEditItem(null); setEditType(''); }}>
                <div className="cms-edit-modal" onClick={(e) => e.stopPropagation()}>
                  <h2>{editItem.id ? 'Edit' : 'Add'} Campaign</h2>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={editItem.name || ''} onChange={e => setEditItem({ ...editItem, name: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={editItem.category || ''} onChange={e => setEditItem({ ...editItem, category: e.target.value })} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Result (Small)</label><input className="form-input" value={editItem.result || ''} onChange={e => setEditItem({ ...editItem, result: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Price/Budget (Small)</label><input className="form-input" value={editItem.price || ''} onChange={e => setEditItem({ ...editItem, price: e.target.value })} /></div>
                  </div>

                  <h3 className="cms-settings-heading mt-16" style={{ fontSize: '0.9rem', marginBottom: '12px', opacity: 0.8 }}>Metrics Overlays (Image Ref)</h3>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Index Label (03)</label><input className="form-input" value={editItem.index_label || ''} onChange={e => setEditItem({ ...editItem, index_label: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Tag (Film)</label><input className="form-input" value={editItem.tag || ''} onChange={e => setEditItem({ ...editItem, tag: e.target.value })} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Views Total (20.5M)</label><input className="form-input" value={editItem.views_total || ''} onChange={e => setEditItem({ ...editItem, views_total: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">ROI (8-12x)</label><input className="form-input" value={editItem.roi || ''} onChange={e => setEditItem({ ...editItem, roi: e.target.value })} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Creators Count (2,400)</label><input className="form-input" value={editItem.creators_count || ''} onChange={e => setEditItem({ ...editItem, creators_count: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Budget label ($10K)</label><input className="form-input" value={editItem.budget_label || ''} onChange={e => setEditItem({ ...editItem, budget_label: e.target.value })} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">CPM label ($0.50)</label><input className="form-input" value={editItem.cpm_label || ''} onChange={e => setEditItem({ ...editItem, cpm_label: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Duration label (21 days)</label><input className="form-input" value={editItem.duration_label || ''} onChange={e => setEditItem({ ...editItem, duration_label: e.target.value })} /></div>
                  </div>

                  <h3 className="cms-settings-heading mt-16" style={{ fontSize: '0.9rem', marginBottom: '12px', opacity: 0.8 }}>Case Study Content</h3>
                  <div className="form-group mb-12"><label className="form-label">The Challenge</label><textarea className="form-input" style={{ minHeight: '60px' }} value={editItem.challenge_text || ''} onChange={e => setEditItem({ ...editItem, challenge_text: e.target.value })} /></div>
                  <div className="form-group mb-12"><label className="form-label">What We Did</label><textarea className="form-input" style={{ minHeight: '60px' }} value={editItem.what_we_did_text || ''} onChange={e => setEditItem({ ...editItem, what_we_did_text: e.target.value })} /></div>
                  <div className="form-group mb-12"><label className="form-label">Why It Worked</label><textarea className="form-input" style={{ minHeight: '60px' }} value={editItem.why_it_worked_text || ''} onChange={e => setEditItem({ ...editItem, why_it_worked_text: e.target.value })} /></div>
                  <div className="form-group mb-12"><label className="form-label">What the Studio Learned</label><textarea className="form-input" style={{ minHeight: '60px' }} value={editItem.learned_text || ''} onChange={e => setEditItem({ ...editItem, learned_text: e.target.value })} /></div>

                  <div className="form-group mb-16"><label className="form-label">General Description (Short)</label><textarea className="form-input" style={{ minHeight: '60px' }} value={editItem.description || ''} onChange={e => setEditItem({ ...editItem, description: e.target.value })} /></div>

                  <GraphDataInputs value={editItem.graph_data || ''} onChange={v => setEditItem({ ...editItem, graph_data: v })} />
                  <ImageField value={editItem.img_url || ''} onChange={v => setEditItem({ ...editItem, img_url: v })} label="Cover Image" />
                  <div className="cms-modal-footer">
                    <button className="cms-btn cms-btn-ghost" onClick={() => { setEditItem(null); setEditType(''); }}>Cancel</button>
                    <button className="cms-btn cms-btn-primary" onClick={handleSave} disabled={loading}>Save</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}


        {/* FAQS */}
        {tab === 'faqs' && (
          <>
            <div className="cms-section-header">
              <h1 className="cms-page-title">FAQs</h1>
              <button className="cms-btn cms-btn-primary" onClick={() => { setEditType('faq'); setEditItem({ question: '', answer: '', sort_order: faqs.length }); }}>+ Add FAQ</button>
            </div>
            <div className="cms-list-view">
              {faqs.map(f => (
                <div key={f.id} className="cms-item-card list-item">
                  <div className="list-item-main"><h3 className="cms-item-name">{f.question}</h3><p className="cms-item-desc">{f.answer?.slice(0, 80)}...</p></div>
                  <div className="cms-item-actions">
                    <button className="td-btn" onClick={() => { setEditType('faq'); setEditItem(f); }}>Edit</button>
                    <button className="td-btn danger" onClick={() => setDeleteTarget({ type: 'faq', id: f.id, name: f.question })}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {editType === 'faq' && (
              <div className="cms-edit-overlay" onClick={() => { setEditItem(null); setEditType(''); }}>
                <div className="cms-edit-modal" onClick={(e) => e.stopPropagation()}>
                  <h2>FAQ</h2>
                  <div className="form-group mb-16"><label className="form-label">Question</label><input className="form-input" value={editItem.question} onChange={e => setEditItem({ ...editItem, question: e.target.value })} /></div>
                  <div className="form-group mb-16"><label className="form-label">Answer</label><textarea className="form-input form-textarea" style={{ minHeight: '120px' }} value={editItem.answer} onChange={e => setEditItem({ ...editItem, answer: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Sort Order</label><input className="form-input" type="number" value={editItem.sort_order} onChange={e => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) })} /></div>
                  <div className="cms-modal-footer">
                    <button className="cms-btn cms-btn-ghost" onClick={() => { setEditItem(null); setEditType(''); }}>Cancel</button>
                    <button className="cms-btn cms-btn-primary" onClick={handleSave} disabled={loading}>Save</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* BRANDS */}
        {tab === 'brands' && (
          <>
            <div className="cms-section-header">
              <h1 className="cms-page-title">Brands & Logos</h1>
              <button className="cms-btn cms-btn-primary" onClick={() => { setEditType('brand'); setEditItem({ name: '', is_bold: false, sort_order: brands.length }); }}>+ Add Brand</button>
            </div>
            <div className="cms-tag-grid">
              {brands.map(b => (
                <div key={b.id} className="cms-tag-card">
                  <span className={b.is_bold ? 'bold' : ''}>{b.name}</span>
                  <div className="tag-actions">
                    <button className="icon-btn" onClick={() => { setEditType('brand'); setEditItem(b); }}>✎</button>
                    <button className="icon-btn danger" onClick={() => setDeleteTarget({ type: 'brand', id: b.id, name: b.name })}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            {editType === 'brand' && (
              <div className="cms-edit-overlay" onClick={() => { setEditItem(null); setEditType(''); }}>
                <div className="cms-edit-modal" onClick={(e) => e.stopPropagation()}>
                  <h2>Brand</h2>
                  <div className="form-group mb-16"><label className="form-label">Brand Name</label><input className="form-input" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} /></div>
                  <div className="form-group mb-16 checkbox-group"><input type="checkbox" checked={editItem.is_bold} onChange={e => setEditItem({ ...editItem, is_bold: e.target.checked })} /><label className="form-label">Bold Formatting</label></div>
                  <div className="form-group"><label className="form-label">Sort Order</label><input className="form-input" type="number" value={editItem.sort_order} onChange={e => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) })} /></div>
                  <div className="cms-modal-footer">
                    <button className="cms-btn cms-btn-ghost" onClick={() => { setEditItem(null); setEditType(''); }}>Cancel</button>
                    <button className="cms-btn cms-btn-primary" onClick={handleSave} disabled={loading}>Save</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* TESTIMONIALS (Why Us) */}
        {tab === 'testimonials' && (
          <>
            <div className="cms-section-header">
              <h1 className="cms-page-title">Why Us (Testimonials)</h1>
              <button className="cms-btn cms-btn-primary" onClick={() => { setEditType('testimonial'); setEditItem({ name: '', role: '', quote: '', avatar_url: '', sort_order: testimonials.length }); }}>+ Add Entry</button>
            </div>
            <div className="cms-card-grid">
              {testimonials.length === 0 && <div className="cms-empty">No testimonials yet. Click "+ Add Entry" to get started.</div>}
              {testimonials.map(t => (
                <div key={t.id} className="cms-item-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    {t.avatar_url && <img src={t.avatar_url} alt={t.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}
                    <div>
                      <h3 className="cms-item-name" style={{ marginBottom: 0 }}>{t.name}</h3>
                      <div className="cms-item-meta" style={{ marginBottom: 0 }}>{t.role}</div>
                    </div>
                  </div>
                  {t.quote && <p className="cms-item-desc">"{t.quote.slice(0, 100)}{t.quote.length > 100 ? '...' : ''}"</p>}
                  <div className="cms-item-actions">
                    <button className="td-btn" onClick={() => { setEditType('testimonial'); setEditItem(t); }}>✎ Edit</button>
                    <button className="td-btn danger" onClick={() => setDeleteTarget({ type: 'testimonial', id: t.id, name: t.name })}>✕ Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {editType === 'testimonial' && (
              <div className="cms-edit-overlay" onClick={() => { setEditItem(null); setEditType(''); }}>
                <div className="cms-edit-modal" onClick={(e) => e.stopPropagation()}>
                  <h2>Testimonial</h2>
                  <div className="form-row"><div className="form-group"><label className="form-label">Name</label><input className="form-input" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} /></div><div className="form-group"><label className="form-label">Role</label><input className="form-input" value={editItem.role} onChange={e => setEditItem({ ...editItem, role: e.target.value })} /></div></div>
                  <div className="form-group mb-16"><label className="form-label">Quote</label><textarea className="form-input form-textarea" value={editItem.quote} onChange={e => setEditItem({ ...editItem, quote: e.target.value })} /></div>
                  <ImageField value={editItem.avatar_url} onChange={v => setEditItem({ ...editItem, avatar_url: v })} label="Avatar" />
                  <div className="cms-modal-footer">
                    <button className="cms-btn cms-btn-ghost" onClick={() => { setEditItem(null); setEditType(''); }}>Cancel</button>
                    <button className="cms-btn cms-btn-primary" onClick={handleSave} disabled={loading}>Save</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* WHAT WE DO (Tech Stack) */}
        {tab === 'tech' && (
          <>
            <div className="cms-section-header">
              <h1 className="cms-page-title">What We Do (Tech Stack)</h1>
              <button className="cms-btn cms-btn-primary" onClick={() => { setEditType('tech'); setEditItem({ name: '', icon: '', description: '', sort_order: techStack.length }); }}>+ Add Service</button>
            </div>
            <div className="cms-card-grid">
              {techStack.length === 0 && <div className="cms-empty">No services yet. Click "+ Add Service" to get started.</div>}
              {techStack.map(ts => (
                <div key={ts.id} className="cms-item-card">
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{ts.icon}</div>
                  <h3 className="cms-item-name">{ts.name}</h3>
                  {ts.description && <p className="cms-item-desc">{ts.description}</p>}
                  <div className="cms-item-actions">
                    <button className="td-btn" onClick={() => { setEditType('tech'); setEditItem(ts); }}>✎ Edit</button>
                    <button className="td-btn danger" onClick={() => setDeleteTarget({ type: 'tech', id: ts.id, name: ts.name })}>✕ Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {editType === 'tech' && (
              <div className="cms-edit-overlay" onClick={() => { setEditItem(null); setEditType(''); }}>
                <div className="cms-edit-modal" onClick={(e) => e.stopPropagation()}>
                  <h2>Service Item</h2>
                  <div className="form-row"><div className="form-group"><label className="form-label">Name</label><input className="form-input" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} /></div><div className="form-group"><label className="form-label">Icon (Emoji)</label><input className="form-input" value={editItem.icon} onChange={e => setEditItem({ ...editItem, icon: e.target.value })} /></div></div>
                  <div className="form-group mb-16"><label className="form-label">Description</label><input className="form-input" value={editItem.description} onChange={e => setEditItem({ ...editItem, description: e.target.value })} /></div>
                  <div className="cms-modal-footer">
                    <button className="cms-btn cms-btn-ghost" onClick={() => { setEditItem(null); setEditType(''); }}>Cancel</button>
                    <button className="cms-btn cms-btn-primary" onClick={handleSave} disabled={loading}>Save</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* HERO & CTA */}
        {tab === 'hero' && (
          <>
            <h1 className="cms-page-title">Hero & CTA Content</h1>
            <div className="cms-settings-card">
              <h3 className="cms-settings-heading">🏠 Hero Section</h3>
              <div className="form-row"><div className="form-group"><label className="form-label">Main Title</label><input className="form-input" value={heroData.title} onChange={e => setHeroData({ ...heroData, title: e.target.value })} /></div><div className="form-group"><label className="form-label">Accent Title</label><input className="form-input" value={heroData.title_accent} onChange={e => setHeroData({ ...heroData, title_accent: e.target.value })} /></div></div>
              <div className="form-group mb-16"><label className="form-label">Hero Subtitle</label><textarea className="form-input form-textarea" value={heroData.subtitle} onChange={e => setHeroData({ ...heroData, subtitle: e.target.value })} /></div>
              <div className="form-row"><div className="form-group"><label className="form-label">CTA Text</label><input className="form-input" value={heroData.cta_text} onChange={e => setHeroData({ ...heroData, cta_text: e.target.value })} /></div><div className="form-group"><label className="form-label">CTA Link</label><input className="form-input" value={heroData.cta_link} onChange={e => setHeroData({ ...heroData, cta_link: e.target.value })} /></div></div>
              <div className="form-group mb-24"><label className="form-label">Stats Subtext</label><input className="form-input" value={heroData.stats_text} onChange={e => setHeroData({ ...heroData, stats_text: e.target.value })} /></div>

              <h3 className="cms-settings-heading mt-32">🧮 ROI Calculator Constants</h3>
              <div className="form-row mb-24">
                <div className="form-group"><label className="form-label">Paid Ads CPM (e.g. 25.00)</label><input className="form-input" type="number" step="0.5" value={settingsData.target_cpm || 25.00} onChange={e => setSettingsData({ ...settingsData, target_cpm: parseFloat(e.target.value) })} /></div>
                <div className="form-group"><label className="form-label">Organic CPM (e.g. 1.00)</label><input className="form-input" type="number" step="0.1" value={settingsData.organic_cpm || 1.00} onChange={e => setSettingsData({ ...settingsData, organic_cpm: parseFloat(e.target.value) })} /></div>
              </div>

              <h3 className="cms-settings-heading mt-32">📢 Bottom CTA Section</h3>
              <div className="form-row"><div className="form-group"><label className="form-label">CTA Title</label><input className="form-input" value={settingsData.cta_title} onChange={e => setSettingsData({ ...settingsData, cta_title: e.target.value })} /></div><div className="form-group"><label className="form-label">CTA Accent</label><input className="form-input" value={settingsData.cta_title_accent} onChange={e => setSettingsData({ ...settingsData, cta_title_accent: e.target.value })} /></div></div>
              <div className="form-group mb-16"><label className="form-label">CTA Subtitle</label><textarea className="form-input form-textarea" value={settingsData.cta_subtitle} onChange={e => setSettingsData({ ...settingsData, cta_subtitle: e.target.value })} /></div>
              <div className="form-row mb-24"><div className="form-group"><label className="form-label">Btn Text</label><input className="form-input" value={settingsData.cta_button_text} onChange={e => setSettingsData({ ...settingsData, cta_button_text: e.target.value })} /></div><div className="form-group"><label className="form-label">Btn Link</label><input className="form-input" value={settingsData.cta_button_link} onChange={e => setSettingsData({ ...settingsData, cta_button_link: e.target.value })} /></div></div>

              <button className="cms-btn cms-btn-primary" onClick={handleSaveHeroAndCTA} disabled={loading}>Save Hero & CTA</button>
            </div>
          </>
        )}

        {/* MEDIA */}
        {tab === 'media' && (
          <>
            <h1 className="cms-page-title">Media & Explainer</h1>
            <div className="cms-settings-card">
              <h3 className="cms-settings-heading">🎬 Video Settings</h3>
              <div className="form-group mb-16"><label className="form-label">Video URL (MP4 or YouTube)</label><input className="form-input" value={settingsData.video_url} onChange={e => setSettingsData({ ...settingsData, video_url: e.target.value })} /></div>
              <ImageField value={settingsData.video_poster} onChange={v => setSettingsData({ ...settingsData, video_poster: v })} label="Poster Image" />
              <div className="form-group mb-16 mt-16"><label className="form-label">Video Caption</label><input className="form-input" value={settingsData.video_caption} onChange={e => setSettingsData({ ...settingsData, video_caption: e.target.value })} /></div>
              <div className="form-row mb-24">
                <div className="form-group"><label className="form-label">Video CTA Text</label><input className="form-input" value={settingsData.video_cta_text} onChange={e => setSettingsData({ ...settingsData, video_cta_text: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Video CTA Link</label><input className="form-input" value={settingsData.video_cta_link} onChange={e => setSettingsData({ ...settingsData, video_cta_link: e.target.value })} /></div>
              </div>
              <button className="cms-btn cms-btn-primary" onClick={handleSaveMedia} disabled={loading}>Save Media</button>
            </div>
          </>
        )}

        {/* SETTINGS & CALCULATOR */}
        {tab === 'settings' && (
          <>
            <h1 className="cms-page-title">Global Settings & Calculator</h1>
            <div className="cms-settings-card">
              <h3 className="cms-settings-heading">🔗 Social Connections</h3>
              <div className="form-row"><div className="form-group"><label className="form-label">Instagram</label><input className="form-input" value={settingsData.instagram_url} onChange={e => setSettingsData({ ...settingsData, instagram_url: e.target.value })} /></div><div className="form-group"><label className="form-label">YouTube</label><input className="form-input" value={settingsData.youtube_url} onChange={e => setSettingsData({ ...settingsData, youtube_url: e.target.value })} /></div></div>
              <div className="form-group mb-24"><label className="form-label">X/Twitter</label><input className="form-input" value={settingsData.twitter_url} onChange={e => setSettingsData({ ...settingsData, twitter_url: e.target.value })} /></div>

              <h3 className="cms-settings-heading mt-32">🧮 Calculator Variables</h3>
              <div className="form-row"><div className="form-group"><label className="form-label">Target CPM ($)</label><input className="form-input" type="number" step="0.5" value={settingsData.target_cpm} onChange={e => setSettingsData({ ...settingsData, target_cpm: parseFloat(e.target.value) })} /></div><div className="form-group"><label className="form-label">Organic CPM ($)</label><input className="form-input" type="number" step="0.5" value={settingsData.organic_cpm} onChange={e => setSettingsData({ ...settingsData, organic_cpm: parseFloat(e.target.value) })} /></div></div>
              <div className="form-row mb-24"><div className="form-group"><label className="form-label">Platform Multiplier</label><input className="form-input" type="number" value={settingsData.platform_multiplier} onChange={e => setSettingsData({ ...settingsData, platform_multiplier: parseInt(e.target.value) })} /></div><div className="form-group"><label className="form-label">Days per Week</label><input className="form-input" type="number" value={settingsData.days_multiplier} onChange={e => setSettingsData({ ...settingsData, days_multiplier: parseInt(e.target.value) })} /></div></div>

              <button className="cms-btn cms-btn-primary" onClick={handleSaveGlobal} disabled={loading}>Save Global Settings</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
