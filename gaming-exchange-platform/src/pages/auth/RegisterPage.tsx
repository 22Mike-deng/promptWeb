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
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
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
    <div className="min-h-screen flex items-center justify-center particle-bg px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-neon-pink/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-neon-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute inset-0 gradient-animated opacity-30 blur-xl rounded-3xl" />
        
        <div className="relative glass-effect rounded-2xl p-8 neon-border">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-neon-pink to-neon-green mb-4"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="font-game text-3xl font-bold neon-text text-white mb-2">
              {getTranslation(language, 'auth.register_title')}
            </h1>
            <p className="text-gray-400 font-body">
              {getTranslation(language, 'auth.register_subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-body">
                {getTranslation(language, 'common.username')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  {...register('username')}
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-all font-body"
                  placeholder="YourHeroName"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-body">
                {getTranslation(language, 'common.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-all font-body"
                  placeholder="adventure@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-body">
                {getTranslation(language, 'common.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  {...register('password')}
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-all font-body"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-body">
                {getTranslation(language, 'common.confirm_password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-all font-body"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm font-body"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-neon-pink to-neon-green text-white font-game font-semibold rounded-xl shadow-lg shadow-neon-pink/30 hover:shadow-neon-pink/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {getTranslation(language, 'common.register')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 font-body">
              {getTranslation(language, 'auth.has_account')}{' '}
              <Link
                to="/login"
                className="text-neon-pink hover:text-neon-green transition-colors font-semibold"
              >
                {getTranslation(language, 'common.login')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
