'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './admin.css';
import { syncCampaign, syncTestimonial, syncReview, syncSettings } from '@/lib/actions';

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [tab, setTab] = useState('dashboard');
  const [isSaving, setIsSaving] = useState(false);
  
  // Edit Form States
  const [formData, setFormData] = useState({
    id: '', name: '', role: '', handle: '', quote: '', content: '', stars: 5, avatar: '', 
    category: '', result: '', price: '', description: '', graphData: '', img: ''
  });

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      setTimeout(() => { setIsAuth(true); setAuthChecking(false); }, 500);
    };
    checkAuth();
  }, []);

  if (!mounted) return null;

  const handleSave = async (type: 'campaign' | 'testimonial' | 'review' | 'settings') => {
    setIsSaving(true);
    try {
      if (type === 'campaign') await syncCampaign(formData);
      if (type === 'testimonial') await syncTestimonial(formData);
      if (type === 'review') await syncReview(formData);
      if (type === 'settings') await syncSettings(formData);
      alert(`${type.toUpperCase()} Synchronized with Frontend!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (authChecking) return <div className="admin-loading" style={{ color: '#fff', textAlign: 'center', padding: '100px' }}>Initializing Master Dashboard...</div>;

  return (
    <div id="admin" className="active" style={{ display: 'flex', minHeight: '100vh', background: '#050304' }}>
      <div className="admin-sidebar" style={{ width: 260, background: '#0c1015', borderRight: '1px solid rgba(255,255,255,0.05)', color: '#fff' }}>
        <div className="admin-brand" style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="logo-circle" style={{ 
            width: 44, height: 44, borderRadius: '50%', background: '#000', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 0 15px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src="/logo.png" alt="Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>
        </div>
        <div style={{ padding: '0 20px' }}>
          <div className={`admin-nav-item ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>📊 Analytics</div>
          <div className={`admin-nav-item ${tab === 'campaigns' ? 'active' : ''}`} onClick={() => setTab('campaigns')}>💼 Portfolio</div>
          <div className={`admin-nav-item ${tab === 'testimonials' ? 'active' : ''}`} onClick={() => setTab('testimonials')}>🧩 Why Us</div>
          <div className={`admin-nav-item ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>⭐ Reviews</div>
          <div className={`admin-nav-item ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>⚙️ Settings</div>
          <Link href="/" className="admin-nav-item" style={{ marginTop: '40px', display: 'block', opacity: 0.5, textDecoration: 'none', color: '#fff' }}>← Back to Site</Link>
        </div>
      </div>
      
      <div className="admin-main" style={{ flex: 1, padding: '60px', color: '#fff' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '40px' }}>
          {tab === 'dashboard' ? 'Global Growth Metrics' : 
           tab === 'campaigns' ? 'Portfolio Manager' : 
           tab === 'testimonials' ? 'Why Us (Section 5)' :
           tab === 'reviews' ? 'Social Reviews (Section 6)' : 'Site Configuration'}
        </h1>
        
        {tab === 'dashboard' && (
          <div className="admin-stats-row" style={{ display: 'flex', gap: '24px' }}>
            <div className="admin-stat-card" style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', flex: 1 }}>
              <div style={{ opacity: 0.4, fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 600 }}>TOTAL VIEWS</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>214.3M</div>
            </div>
          </div>
        )}

        {(tab === 'testimonials' || tab === 'reviews') && (
          <div className="admin-upload-form" style={{ maxWidth: '600px' }}>
            <div className="form-row" style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
              <input className="form-input" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
              <input className="form-input" placeholder={tab === 'testimonials' ? 'Role / Feature' : 'Handle (@...)'} value={tab === 'testimonials' ? formData.role : formData.handle} onChange={e => setFormData({...formData, role: e.target.value, handle: e.target.value})} style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
            </div>
            <div className="form-row" style={{ marginBottom: '24px' }}>
              <textarea placeholder={tab === 'testimonials' ? 'Strategic Quote' : 'Review Content'} value={tab === 'testimonials' ? formData.quote : formData.content} onChange={e => setFormData({...formData, quote: e.target.value, content: e.target.value})} style={{ width: '100%', minHeight: '120px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
            </div>
            <div className="form-row" style={{ marginBottom: '40px' }}>
              <input className="form-input" placeholder="Avatar URL" value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
            </div>
            <button className="btn-primary" onClick={() => handleSave(tab === 'testimonials' ? 'testimonial' : 'review')} disabled={isSaving} style={{ width: '100%', padding: '16px', background: '#fff', color: '#000', fontWeight: 800, borderRadius: '12px' }}>
              {isSaving ? 'Syncing...' : `Update Section ${tab === 'testimonials' ? '5' : '6'}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
