import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { signUp } from '../../lib/supabase';
import { useAppStore } from '../../stores/appStore';
import { getTranslation } from '../../i18n';

const registerSchema = z.object({
  username: z.string().min(3, '用户名至少需要3个字符'),
  email: z.string().email(),
  password: z.string().min(6, '密码至少需要6个字符'),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码输入不一致',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { language, setUser, fetchProfile, setLoading, isLoading } = useAppStore();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    setLoading(true);

    try {
      const result = await signUp(data.email, data.password, data.username);
      setUser(result.user);
      await fetchProfile();
      navigate('/');
    } catch (err: any) {
      setError(err.message || getTranslation(language, 'auth.email_exists'));
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
          top: '5%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '60%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
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
            linear-gradient(rgba(236,72,153,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(236,72,153,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
            border: '1px solid rgba(236,72,153,0.2)',
            padding: '40px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(236,72,153,0.1)',
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
              background: 'linear-gradient(90deg, transparent, #ec4899, #a855f7, #22c55e, transparent)',
            }}
          />

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #22c55e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 40px rgba(236,72,153,0.4)',
              }}
            >
              <Sparkles size={40} color="white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '28px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ec4899, #a855f7, #22c55e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px',
              }}
            >
              {getTranslation(language, 'auth.register_title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: '#9ca3af',
                fontSize: '16px',
              }}
            >
              {getTranslation(language, 'auth.register_subtitle')}
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Username field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
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
                {getTranslation(language, 'common.username')}
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#ec4899',
                    zIndex: 2,
                  }}
                />
                <input
                  {...register('username')}
                  type="text"
                  placeholder="YourHeroName"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: 'rgba(18,18,26,0.8)',
                    border: '2px solid rgba(236,72,153,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontFamily: "'Rajdhani', sans-serif",
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ec4899';
                    e.target.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.1), 0 0 20px rgba(236,72,153,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(236,72,153,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    color: '#ef4444',
                    fontSize: '13px',
                    marginTop: '6px',
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {errors.username.message}
                </motion.p>
              )}
            </motion.div>

            {/* Email field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
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
                {getTranslation(language, 'common.email')}
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
                  {...register('email')}
                  type="email"
                  placeholder="adventure@example.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: 'rgba(18,18,26,0.8)',
                    border: '2px solid rgba(236,72,153,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontFamily: "'Rajdhani', sans-serif",
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ec4899';
                    e.target.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.1), 0 0 20px rgba(236,72,153,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(236,72,153,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    color: '#ef4444',
                    fontSize: '13px',
                    marginTop: '6px',
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
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
                {getTranslation(language, 'common.password')}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#22c55e',
                    zIndex: 2,
                  }}
                />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: 'rgba(18,18,26,0.8)',
                    border: '2px solid rgba(236,72,153,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontFamily: "'Rajdhani', sans-serif",
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ec4899';
                    e.target.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.1), 0 0 20px rgba(236,72,153,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(236,72,153,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    color: '#ef4444',
                    fontSize: '13px',
                    marginTop: '6px',
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            {/* Confirm Password field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
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
                {getTranslation(language, 'common.confirm_password')}
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
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: 'rgba(18,18,26,0.8)',
                    border: '2px solid rgba(236,72,153,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontFamily: "'Rajdhani', sans-serif",
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ec4899';
                    e.target.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.1), 0 0 20px rgba(236,72,153,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(236,72,153,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    color: '#ef4444',
                    fontSize: '13px',
                    marginTop: '6px',
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
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
              </motion.div>
            )}

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #22c55e 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '16px',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 30px rgba(236,72,153,0.4)',
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? (
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
                  <span>{getTranslation(language, 'common.register')}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Login link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
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
              {getTranslation(language, 'auth.has_account')}{' '}
              <Link
                to="/login"
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {getTranslation(language, 'common.login')}
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

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
