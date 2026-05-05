import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Zap, UserPlus, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(10, 10, 15, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(168,85,247,0.2)',
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Zap size={24} color="white" />
          </div>
          <span style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'white',
          }}>
            个人博客
          </span>
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          {user ? (
            <>
              <Link
                to="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: '#a855f7',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                <Shield size={18} />
                管理后台
              </Link>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#d1d5db',
                  fontFamily: "'Rajdhani', sans-serif",
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <User size={18} color="white" />
                  </div>
                  <span>{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(239,68,68,0.3)',
                    background: 'transparent',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  <LogOut size={16} />
                  退出
                </button>
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <Link
                to="/login"
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: '#a855f7',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                登录
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                <UserPlus size={18} style={{ display: 'inline', marginRight: '6px' }} />
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
