import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { signIn } from '../../lib/supabase';
import { useAppStore } from '../../stores/appStore';
import { getTranslation } from '../../i18n';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { language, setUser, fetchProfile, setLoading, isLoading } = useAppStore();
  const [error, setError] = useState('');

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
    <div className="min-h-screen flex items-center justify-center particle-bg px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-neon-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
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
              className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue mb-4"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="font-game text-3xl font-bold neon-text text-white mb-2">
              {getTranslation(language, 'auth.login_title')}
            </h1>
            <p className="text-gray-400 font-body">
              {getTranslation(language, 'auth.login_subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-body">
                {getTranslation(language, 'common.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all font-body"
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
                  className="w-full pl-11 pr-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all font-body"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
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
              className="w-full py-3 px-4 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-game font-semibold rounded-xl shadow-lg shadow-neon-purple/30 hover:shadow-neon-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {getTranslation(language, 'common.login')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 font-body">
              {getTranslation(language, 'auth.no_account')}{' '}
              <Link
                to="/register"
                className="text-neon-purple hover:text-neon-blue transition-colors font-semibold"
              >
                {getTranslation(language, 'common.register')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
