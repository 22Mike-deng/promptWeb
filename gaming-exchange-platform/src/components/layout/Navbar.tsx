import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Gamepad2, Gift, User, Shield, Menu, X, LogOut, Sparkles, Globe } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { getTranslation } from '../../i18n';
import { getLevelInfo } from '../../types';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, language, setLanguage, logout } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const levelInfo = profile ? getLevelInfo(profile.experience) : null;

  const navItems = [
    { path: '/', label: getTranslation(language, 'nav.home'), icon: Home },
    { path: '/guess', label: getTranslation(language, 'nav.guess'), icon: Gamepad2 },
    { path: '/redeem', label: getTranslation(language, 'nav.redeem'), icon: Gift },
    { path: '/profile', label: getTranslation(language, 'nav.profile'), icon: User },
  ];

  if (profile?.is_admin) {
    navItems.push({ path: '/admin', label: getTranslation(language, 'nav.admin'), icon: Shield });
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN');
    setIsLangMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-game text-xl font-bold text-white hidden sm:block">
              Gaming Exchange
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-4 py-2 rounded-lg font-body font-medium transition-all
                    ${isActive 
                      ? 'text-neon-purple bg-neon-purple/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 border border-neon-purple/50 rounded-lg"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-gray-300 hover:text-white hover:border-neon-purple/50 transition-all font-body"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">{language === 'zh-CN' ? '中文' : 'EN'}</span>
              </button>
              
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-32 bg-dark-card border border-dark-border rounded-lg overflow-hidden shadow-xl"
                  >
                    <button
                      onClick={toggleLanguage}
                      className={`w-full px-4 py-2 text-left text-sm font-body hover:bg-neon-purple/10 transition-colors ${
                        language === 'zh-CN' ? 'text-neon-purple' : 'text-gray-300'
                      }`}
                    >
                      中文
                    </button>
                    <button
                      onClick={toggleLanguage}
                      className={`w-full px-4 py-2 text-left text-sm font-body hover:bg-neon-purple/10 transition-colors ${
                        language === 'en-US' ? 'text-neon-purple' : 'text-gray-300'
                      }`}
                    >
                      English
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user && profile ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-purple/10 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 transition-all"
                >
                  <span className="font-game text-sm font-semibold">
                    Lv.{levelInfo?.level}
                  </span>
                  <span className="text-sm font-body">
                    {profile.username}
                  </span>
                </Link>
                
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neon-yellow/10 border border-neon-yellow/30 text-neon-yellow">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-game text-sm font-semibold">
                    {profile.points}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  title={getTranslation(language, 'common.logout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue text-white font-game font-semibold text-sm hover:shadow-lg hover:shadow-neon-purple/30 transition-all"
              >
                {getTranslation(language, 'common.login')}
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-card border-t border-dark-border"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-body transition-all
                      ${isActive 
                        ? 'bg-neon-purple/10 text-neon-purple' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}

              {user && profile && (
                <div className="pt-4 border-t border-dark-border mt-4">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-game text-neon-purple font-semibold">
                        Lv.{levelInfo?.level}
                      </span>
                      <span className="text-gray-300 font-body">
                        {profile.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-neon-yellow">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-game text-sm font-semibold">
                        {profile.points}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all font-body"
                  >
                    <LogOut className="w-5 h-5" />
                    {getTranslation(language, 'common.logout')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
