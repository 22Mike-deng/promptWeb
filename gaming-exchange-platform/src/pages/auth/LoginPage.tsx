import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '20px',
      }}
    >
      {/* Animated background orbs */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 7s ease-in-out infinite 1s',
        }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '440px',
        }}
      >
        {/* Card */}
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(18,18,26,0.98) 0%, rgba(10,10,15,0.95) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(168,85,247,0.2)',
            padding: '40px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(168,85,247,0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top gradient line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #a855f7, #3b82f6, #ec4899, transparent)',
            }}
          />

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 40px rgba(168,85,247,0.4)',
              }}
            >
              <Zap size={40} color="white" />
            </div>

            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '28px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #a855f7, #3b82f6, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px',
              }}
            >
              登录
            </h1>

            <p
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: '#9ca3af',
                fontSize: '16px',
              }}
            >
              登录以继续你的冒险
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email field */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#d1d5db',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                邮箱
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#a855f7',
                    zIndex: 2,
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adventure@example.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: 'rgba(18,18,26,0.8)',
                    border: '2px solid rgba(168,85,247,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontFamily: "'Rajdhani', sans-serif",
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a855f7';
                    e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.1), 0 0 20px rgba(168,85,247,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(168,85,247,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#d1d5db',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                密码
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#3b82f6',
                    zIndex: 2,
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: 'rgba(18,18,26,0.8)',
                    border: '2px solid rgba(168,85,247,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontFamily: "'Rajdhani', sans-serif",
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a855f7';
                    e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.1), 0 0 20px rgba(168,85,247,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(168,85,247,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '12px',
                }}
              >
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '14px',
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '16px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 30px rgba(168,85,247,0.4)',
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
              ) : (
                <>
                  <span>登录</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: '#9ca3af',
                fontSize: '15px',
              }}
            >
              还没有账号？{' '}
              <Link
                to="/register"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                注册
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
