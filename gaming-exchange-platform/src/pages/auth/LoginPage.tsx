import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Zap, Trophy } from 'lucide-react';
import { signIn } from '../../lib/supabase';
import { useAppStore } from '../../stores/appStore';
import { getTranslation } from '../../i18n';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

const StarField = () => {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const FloatingOrb = ({ color, delay, size, top, left }) => {
  return (
    <motion.div
      className="floating-orb"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        top: top,
        left: left,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        delay: delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { language, setUser, fetchProfile, setLoading, isLoading } = useAppStore();
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setLoading(true);

    try {
      const result = await signIn(data.email, data.password);
      setUser(result.user);
      await fetchProfile();
      navigate('/');
    } catch (err: any) {
      setError(err.message || getTranslation(language, 'auth.invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center game-bg px-4 relative">
      <StarField />
      
      <FloatingOrb color="#a855f7" delay={0} size={400} top="10%" left="10%" />
      <FloatingOrb color="#3b82f6" delay={2} size={300} top="60%" left="70%" />
      <FloatingOrb color="#ec4899" delay={4} size={250} top="80%" left="20%" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
        }}
      >
        <motion.div
          className="game-card p-8"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-blue/10 opacity-50" />
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-6 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-blue rounded-2xl opacity-30 blur-xl" />
                <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-neon-purple via-neon-blue to-neon-pink flex items-center justify-center">
                  <Zap className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="font-game text-4xl font-bold text-white mb-3">
                  <span className="bg-gradient-to-r from-neon-purple via-neon-blue to-neon-pink bg-clip-text text-transparent">
                    {getTranslation(language, 'auth.login_title')}
                  </span>
                </h1>
                <p className="text-gray-400 font-body text-lg">
                  {getTranslation(language, 'auth.login_subtitle')}
                </p>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-3 font-body uppercase tracking-wider">
                  {getTranslation(language, 'common.email')}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-purple">
                    <Mail />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    className="game-input w-full pl-12 pr-4 py-4 text-white text-lg placeholder-gray-500"
                    placeholder="adventure@example.com"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400 font-body flex items-center gap-2"
                  >
                    <span className="text-red-400">!</span>
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-3 font-body uppercase tracking-wider">
                  {getTranslation(language, 'common.password')}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-blue">
                    <Lock />
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    className="game-input w-full pl-12 pr-4 py-4 text-white text-lg placeholder-gray-500"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400 font-body flex items-center gap-2"
                  >
                    <span className="text-red-400">!</span>
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                >
                  <p className="text-red-400 font-body flex items-center gap-2">
                    <span className="text-red-400">⚠</span>
                    {error}
                  </p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="game-button w-full py-4 px-6 text-white font-game font-bold text-lg rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>载入中...</span>
                  </>
                ) : (
                  <>
                    <span>{getTranslation(language, 'common.login')}</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-400 font-body text-lg">
                {getTranslation(language, 'auth.no_account')}{' '}
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent font-semibold hover:opacity-80 transition-opacity"
                >
                  {getTranslation(language, 'common.register')}
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
