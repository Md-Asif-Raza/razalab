'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type AuthMode = 'password' | 'otp-send' | 'otp-verify';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess('OTP sent to your email! Check your inbox.');
      setMode('otp-verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), token: otpCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
  };

  const switchToOtp = () => {
    setError('');
    setSuccess('');
    setPassword('');
    setOtpCode('');
    setMode('otp-send');
  };

  const switchToPassword = () => {
    setError('');
    setSuccess('');
    setPassword('');
    setOtpCode('');
    setMode('password');
  };

  return (
    <div className="login-page">
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          position: relative;
          overflow: hidden;
        }
        .login-glow {
          display: none;
        }
        .login-card {
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
        input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .login-btn {
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
        .login-btn:hover:not(:disabled) {
          transform: scale(0.98);
          opacity: 0.95;
        }
        .login-btn:disabled {
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
        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
        }
        .divider-text {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.25);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 600;
        }
        .alt-btn {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.85rem;
          font-family: inherit;
        }
        .alt-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.8);
          border-color: rgba(255, 255, 255, 0.12);
        }
        .link-btn {
          display: inline-block;
          margin-top: 20px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          transition: color 0.2s ease;
        }
        .link-btn:hover {
          color: rgba(255, 255, 255, 0.6);
        }
        .back-link {
          display: block;
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
        .otp-input {
          text-align: center;
          letter-spacing: 8px;
          font-size: 1.5rem;
          font-weight: 700;
        }
        .mode-header {
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .login-card { padding: 32px 24px; border-radius: 30px; margin: 20px; }
          .login-btn { padding: 14px; font-size: 0.9rem; }
        }
      `}</style>

      <div className="login-glow" />

      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: 64, height: 64, borderRadius: '50%', background: '#000', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 0 30px rgba(0,0,0,0.6)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src="/logo.png" alt="Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════ */}
          {/* PASSWORD LOGIN (Default)                    */}
          {/* ═══════════════════════════════════════════ */}
          {mode === 'password' && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handlePasswordLogin}>
                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg">{success}</div>}
                
                <div className="input-group">
                  <label>Admin Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter admin email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Initialise Dashboard'}
                </button>

                <button 
                  type="button" 
                  className="link-btn" 
                  onClick={() => router.push('/reset-password')}
                  style={{ marginRight: '16px' }}
                >
                  Forgot Password?
                </button>

                <div className="divider">
                  <div className="divider-line" />
                  <span className="divider-text">or</span>
                  <div className="divider-line" />
                </div>

                <button type="button" className="alt-btn" onClick={switchToOtp}>
                  Login with OTP →
                </button>
              </form>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* OTP SEND                                     */}
          {/* ═══════════════════════════════════════════ */}
          {mode === 'otp-send' && (
            <motion.div
              key="otp-send"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mode-header">OTP Login</div>
              {error && <div className="error-msg">{error}</div>}
              
              <div className="input-group">
                <label>Admin Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button 
                type="button" 
                className="login-btn" 
                onClick={handleSendOtp} 
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP to Email'}
              </button>

              <button type="button" className="link-btn" onClick={switchToPassword}>
                ← Back to Password Login
              </button>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* OTP VERIFY                                   */}
          {/* ═══════════════════════════════════════════ */}
          {mode === 'otp-verify' && (
            <motion.div
              key="otp-verify"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mode-header">Enter OTP Code</div>
              {error && <div className="error-msg">{error}</div>}
              {success && <div className="success-msg">{success}</div>}

              <form onSubmit={handleVerifyOtp}>
                <div className="input-group">
                  <label>6-Digit OTP Code</label>
                  <input 
                    type="text" 
                    className="otp-input"
                    placeholder="000000" 
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    autoFocus
                  />
                </div>

                <button type="submit" className="login-btn" disabled={loading || otpCode.length !== 6}>
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>

              <button type="button" className="link-btn" onClick={handleSendOtp} disabled={loading}>
                Resend OTP
              </button>
              <br />
              <button type="button" className="link-btn" onClick={switchToPassword}>
                ← Back to Password Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <a href="/" onClick={handleReturn} className="back-link">← Return to Organic Network</a>
      </motion.div>
    </div>
  );
}
