import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Gift, Flame, CheckCircle, Sparkles } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { getTranslation } from '../../i18n';

export default function DailySignIn() {
  const { profile, language, signIn } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!profile) return null;

  const today = new Date().toISOString().split('T')[0];
  const hasSignedInToday = profile.last_sign_in?.split('T')[0] === today;

  const handleSignIn = async () => {
    setIsSubmitting(true);
    setMessage(null);
    
    const result = await signIn();
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    
    setIsSubmitting(false);
    
    setTimeout(() => setMessage(null), 3000);
  };

  const basePoints = 10;
  const streakBonus = Math.min(profile.streak_days * 2, 20);
  const totalPoints = basePoints + (hasSignedInToday ? 0 : streakBonus);

  return (
    <div className="glass-effect rounded-2xl p-6 neon-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-game text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-neon-blue" />
          {getTranslation(language, 'home.daily_sign_in')}
        </h3>
        
        {profile.streak_days > 0 && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-game text-sm font-bold">
            <Flame className="w-4 h-4" />
            {profile.streak_days} {getTranslation(language, 'home.streak_days')}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: hasSignedInToday ? 1 : 1.1 }}
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              hasSignedInToday 
                ? 'bg-neon-green/20 border-2 border-neon-green' 
                : 'bg-gradient-to-br from-neon-purple to-neon-blue'
            }`}
          >
            {hasSignedInToday ? (
              <CheckCircle className="w-7 h-7 text-neon-green" />
            ) : (
              <Gift className="w-7 h-7 text-white" />
            )}
          </motion.div>
          
          <div>
            <p className="text-white font-body font-semibold">
              {hasSignedInToday 
                ? getTranslation(language, 'home.signed_in')
                : getTranslation(language, 'home.sign_in_button')
              }
            </p>
            <p className="text-sm text-gray-400 font-body">
              {language === 'zh-CN' ? '今日奖励' : "Today's Reward"}:
              <span className="text-neon-yellow ml-1 font-game font-bold">
                +{totalPoints} <Sparkles className="w-3 h-3 inline" />
              </span>
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleSignIn}
          disabled={hasSignedInToday || isSubmitting}
          whileHover={{ scale: hasSignedInToday ? 1 : 1.05 }}
          whileTap={{ scale: hasSignedInToday ? 1 : 0.95 }}
          className={`
            px-6 py-3 rounded-xl font-game font-bold text-white transition-all
            ${hasSignedInToday 
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-neon-purple to-neon-blue hover:shadow-lg hover:shadow-neon-purple/50'
            }
          `}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : hasSignedInToday ? (
            getTranslation(language, 'home.signed_in')
          ) : (
            getTranslation(language, 'home.sign_in_button')
          )}
        </motion.button>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-3 rounded-xl text-sm font-body ${
            message.type === 'success' 
              ? 'bg-neon-green/20 border border-neon-green/50 text-neon-green' 
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {!hasSignedInToday && profile.streak_days > 0 && (
        <div className="mt-4 p-3 bg-dark-bg/50 rounded-xl border border-dark-border">
          <p className="text-sm text-gray-400 font-body">
            {language === 'zh-CN' ? '连续签到加成' : 'Streak Bonus'}:
            <span className="text-neon-yellow ml-1 font-game font-bold">
              +{streakBonus} <Sparkles className="w-3 h-3 inline" />
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1 font-body">
            {language === 'zh-CN' 
              ? `保持连续签到，下一次签到将获得 +${Math.min((profile.streak_days + 1) * 2, 20)} 点加成` 
              : `Keep your streak! Next sign-in will earn +${Math.min((profile.streak_days + 1) * 2, 20)} bonus`
            }
          </p>
        </div>
      )}
    </div>
  );
}
