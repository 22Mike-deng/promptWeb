import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Gamepad2, Gift, ArrowRight, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { getLevelInfo } from '../../types';
import { getTranslation } from '../../i18n';
import LevelProgress from '../../components/game/LevelProgress';
import DailySignIn from '../../components/game/DailySignIn';

export default function HomePage() {
  const { user, profile, language, fetchProfile, fetchGuesses, guesses, fetchProducts, products } = useAppStore();
  
  const levelInfo = profile ? getLevelInfo(profile.experience) : null;

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchGuesses();
      fetchProducts();
    }
  }, [user]);

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center particle-bg">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400 font-body">{getTranslation(language, 'common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen particle-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-game text-4xl font-bold text-white mb-2 neon-text">
            {getTranslation(language, 'home.welcome_back')}
          </h1>
          <p className="text-gray-400 font-body text-lg">
            {profile.username} · {language === 'zh-CN' ? levelInfo?.title : levelInfo?.title_en}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DailySignIn />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <LevelProgress />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect rounded-2xl p-6 neon-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-game text-lg font-bold text-white flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-neon-pink" />
                  {getTranslation(language, 'home.guess_title')}
                </h3>
                <Link
                  to="/guess"
                  className="text-neon-purple hover:text-neon-blue font-body text-sm flex items-center gap-1 transition-colors"
                >
                  {language === 'zh-CN' ? '查看全部' : 'View All'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {guesses.length === 0 ? (
                <div className="text-center py-8">
                  <Gamepad2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 font-body">{getTranslation(language, 'common.no_data')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {guesses.slice(0, 3).map((guess, index) => (
                    <motion.div
                      key={guess.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 bg-dark-bg rounded-xl border border-dark-border hover:border-neon-purple/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-body font-semibold">
                            {language === 'zh-CN' ? guess.title : guess.title_en}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {guess.options.length} {language === 'zh-CN' ? '个选项' : 'options'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-neon-yellow font-game font-bold flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            {guess.points_cost}
                          </p>
                          <p className="text-xs text-gray-500">
                            → {guess.points_reward}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-2xl p-6 neon-border"
            >
              <h3 className="font-game text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-neon-yellow" />
                {getTranslation(language, 'home.points_balance')}
              </h3>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-yellow to-orange-500 mb-4"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <p className="font-game text-4xl font-bold text-white mb-1">
                  {profile.points.toLocaleString()}
                </p>
                <p className="text-gray-400 font-body text-sm">
                  {getTranslation(language, 'common.points')}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-3 bg-dark-bg rounded-xl text-center">
                  <p className="text-2xl font-game font-bold text-neon-purple">
                    {profile.total_sign_ins}
                  </p>
                  <p className="text-xs text-gray-400 font-body">
                    {language === 'zh-CN' ? '签到次数' : 'Sign-ins'}
                  </p>
                </div>
                <div className="p-3 bg-dark-bg rounded-xl text-center">
                  <p className="text-2xl font-game font-bold text-neon-green">
                    {profile.streak_days}
                  </p>
                  <p className="text-xs text-gray-400 font-body">
                    {getTranslation(language, 'home.streak_days')}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-2xl p-6 neon-border"
            >
              <h3 className="font-game text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-neon-green" />
                {getTranslation(language, 'home.redeem_title')}
              </h3>

              {products.length === 0 ? (
                <div className="text-center py-6">
                  <Gift className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 font-body text-sm">{getTranslation(language, 'common.no_data')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {products.slice(0, 3).map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-3 p-3 bg-dark-bg rounded-xl border border-dark-border hover:border-neon-green/50 transition-all"
                    >
                      <img
                        src={product.image_url}
                        alt={language === 'zh-CN' ? product.name : product.name_en}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-body font-semibold truncate">
                          {language === 'zh-CN' ? product.name : product.name_en}
                        </h4>
                        <p className="text-neon-yellow text-sm font-game flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {product.points_cost}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <Link
                to="/redeem"
                className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-neon-green to-emerald-500 text-white font-game font-bold text-center block hover:shadow-lg hover:shadow-neon-green/30 transition-all"
              >
                {getTranslation(language, 'redeem.redeem_now')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect rounded-2xl p-6 neon-border"
            >
              <h3 className="font-game text-lg font-bold text-white flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-neon-blue" />
                {getTranslation(language, 'home.quick_actions')}
              </h3>
              
              <div className="space-y-2">
                <Link
                  to="/guess"
                  className="flex items-center gap-3 p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 transition-all font-body"
                >
                  <Gamepad2 className="w-5 h-5" />
                  {getTranslation(language, 'guess.title')}
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
                <Link
                  to="/redeem"
                  className="flex items-center gap-3 p-3 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 transition-all font-body"
                >
                  <Gift className="w-5 h-5" />
                  {getTranslation(language, 'redeem.title')}
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20 transition-all font-body"
                >
                  <Sparkles className="w-5 h-5" />
                  {getTranslation(language, 'profile.my_points')}
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
