'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type ResetMode = 'request' | 'update' | 'success';

export default function ResetPasswordPage() {
  const [mode, setMode] = useState<ResetMode>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState('');
  const router = useRouter();

  // Check for recovery tokens in URL hash (from Supabase email link redirect)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const accessToken = params.get('access_token');
      const type = params.get('type');
      if (accessToken && type === 'recovery') {
        setRecoveryToken(accessToken);
        setMode('update');
        // Clean URL
        window.history.replaceState(null, '', '/reset-password');
      }
    }
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess('Password reset link sent to your email! Check your inbox and click the link.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword, access_token: recoveryToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMode('success');
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <style jsx>{`
        .reset-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050304;
          position: relative;
          overflow: hidden;
        }
        .reset-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(90,104,130,0.1) 0%, transparent 70%);
          filter: blur(80px);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .reset-card {
          width: 100%;
          max-width: 420px;
          padding: 48px;
          background: rgba(12, 16, 21, 0.4);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 40px;
          text-align: center;
          position: relative;
          z-index: 10;
        }
        .page-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .page-subtitle {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 32px;
          line-height: 1.5;
        }
        .input-group {
          margin-bottom: 20px;
          text-align: left;
        }
        label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        input {
          width: 100%;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          color: #fff;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.3s ease;
          cursor: text;
        }
        input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .reset-btn {
          width: 100%;
          padding: 18px;
          background: #fff;
          color: #000;
          font-weight: 800;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.2s ease;
          font-size: 0.95rem;
          font-family: inherit;
        }
        .reset-btn:hover:not(:disabled) {
          transform: scale(0.98);
          opacity: 0.95;
        }
        .reset-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .error-msg {
          color: #ff4d4d;
          font-size: 0.8rem;
          margin-bottom: 16px;
          text-align: left;
          padding: 12px 16px;
          background: rgba(255, 77, 77, 0.08);
          border: 1px solid rgba(255, 77, 77, 0.15);
          border-radius: 12px;
        }
        .success-msg {
          color: #00e676;
          font-size: 0.8rem;
          margin-bottom: 16px;
          text-align: left;
          padding: 12px 16px;
          background: rgba(0, 230, 118, 0.08);
          border: 1px solid rgba(0, 230, 118, 0.15);
          border-radius: 12px;
        }
        .back-link {
          display: inline-block;
          margin-top: 32px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.3);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .back-link:hover {
          color: rgba(255, 255, 255, 0.5);
        }
        .success-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }
        .password-strength {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.25);
          margin-top: 6px;
          text-align: left;
        }
        @media (max-width: 768px) {
          .reset-card { padding: 32px 24px; border-radius: 30px; margin: 20px; }
          .reset-btn { padding: 14px; font-size: 0.9rem; }
        }
      `}</style>

      <div className="reset-glow" />

      <motion.div 
        className="reset-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: 56, height: 56, borderRadius: '50%', background: '#000', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 0 30px rgba(0,0,0,0.6)'
          }}>
            <img src="/logo.png" alt="Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* REQUEST RESET MODE                          */}
        {/* ═══════════════════════════════════════════ */}
        {mode === 'request' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="page-title">Reset Password</div>
            <div className="page-subtitle">
              Enter your admin email to receive a password reset link.
            </div>

            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}

            <form onSubmit={handleRequestReset}>
              <div className="input-group">
                <label>Admin Email</label>
                <input 
                  type="email" 
                  placeholder="arifm9991@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="reset-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <a href="/login" onClick={(e) => { e.preventDefault(); router.push('/login'); }} className="back-link">
              ← Back to Login
            </a>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* UPDATE PASSWORD MODE                        */}
        {/* ═══════════════════════════════════════════ */}
        {mode === 'update' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="page-title">Set New Password</div>
            <div className="page-subtitle">
              Choose a strong password for your admin account.
            </div>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleUpdatePassword}>
              <div className="input-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  autoFocus
                />
                <div className="password-strength">
                  {newPassword.length > 0 && newPassword.length < 8 && '⚠ Minimum 8 characters'}
                  {newPassword.length >= 8 && newPassword.length < 12 && '● Acceptable'}
                  {newPassword.length >= 12 && '● Strong password'}
                </div>
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <button type="submit" className="reset-btn" disabled={loading || newPassword.length < 8}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <a href="/login" onClick={(e) => { e.preventDefault(); router.push('/login'); }} className="back-link">
              ← Back to Login
            </a>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* SUCCESS MODE                                */}
        {/* ═══════════════════════════════════════════ */}
        {mode === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="success-icon">✓</div>
            <div className="page-title">Password Updated</div>
            <div className="page-subtitle">
              Your password has been changed successfully. You can now login with your new password.
            </div>

            <button 
              className="reset-btn" 
              onClick={() => router.push('/login')}
            >
              Go to Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
