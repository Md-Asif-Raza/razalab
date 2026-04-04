'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('arif@gmail.com');
  const [password, setPassword] = useState('Arif@12145');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === 'arif@gmail.com' && password.trim() === 'Arif@12145') {
      window.location.href = '/admin?refresh=1';
    } else {
      setError('Invalid master credentials.');
    }
  };

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="login-page">
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050304;
          position: relative;
          overflow: hidden;
        }
        .login-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(90,104,130,0.1) 0%, transparent 70%);
          filter: blur(80px);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none; /* Prevent click capture */
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 48px;
          background: rgba(12, 16, 21, 0.4);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 40px;
          text-align: center;
          position: relative;
          z-index: 10;
        }
        .brand {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 40px;
        }
        .brand span {
          background: linear-gradient(135deg, var(--c1), #fff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .input-group {
          margin-bottom: 24px;
          text-align: left;
        }
        label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
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
        }
        input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
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
          margin-top: 16px;
          transition: transform 0.2s ease;
          position: relative;
          z-index: 999;
          pointer-events: auto;
        }
        .login-btn:hover {
          transform: scale(0.98);
        }
        .error {
          color: #ff4d4d;
          font-size: 0.8rem;
          margin-bottom: 16px;
          text-align: left;
        }
        .back-link {
          display: block;
          margin-top: 32px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.3);
          text-decoration: none;
          cursor: pointer;
        }
      `}</style>

      <div className="login-glow" />

      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
          <div className="logo-circle" style={{ 
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
        
        <form onSubmit={handleLogin}>
          {error && <div className="error">{error}</div>}
          
          <div className="input-group">
            <label>Master Email</label>
            <input 
              type="email" 
              placeholder="arif@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ cursor: 'text', position: 'relative', zIndex: 999, pointerEvents: 'auto' }}
            />
          </div>

          <div className="input-group">
            <label>Master Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ cursor: 'text', position: 'relative', zIndex: 999, pointerEvents: 'auto' }}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            style={{ 
              position: 'relative', 
              zIndex: 9999, 
              pointerEvents: 'auto', 
              cursor: 'pointer',
              opacity: 1
            }}
          >
            Initialise Dashboard
          </button>
        </form>

        <a href="/" onClick={handleReturn} className="back-link">← Return to Organic Network</a>
      </motion.div>
    </div>
  );
}
