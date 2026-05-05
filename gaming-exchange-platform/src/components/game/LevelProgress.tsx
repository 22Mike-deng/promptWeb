import { motion } from 'framer-motion';
import { Zap, Trophy, Shield, Star } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { getLevelInfo, LEVEL_CONFIG } from '../../types';
import { getTranslation } from '../../i18n';

export default function LevelProgress() {
  const { profile, language } = useAppStore();
  
  if (!profile) return null;
  
  const levelInfo = getLevelInfo(profile.experience);
  const nextLevel = LEVEL_CONFIG[levelInfo.level];

  const levelColors = [
    'from-gray-400 to-gray-500',
    'from-green-400 to-green-500',
    'from-blue-400 to-blue-500',
    'from-purple-400 to-purple-500',
    'from-pink-400 to-pink-500',
    'from-red-400 to-red-500',
    'from-yellow-400 to-orange-500',
    'from-neon-purple to-neon-pink',
    'from-neon-blue to-neon-purple',
    'from-neon-yellow to-neon-green',
  ];

  const currentColor = levelColors[Math.min(levelInfo.level - 1, levelColors.length - 1)];

  return (
    <div className="glass-effect rounded-2xl p-6 neon-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-game text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-purple" />
          {getTranslation(language, 'profile.level_progress')}
        </h3>
        <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${currentColor} text-white font-game text-sm font-bold`}>
          Lv.{levelInfo.level}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${currentColor} flex items-center justify-center shadow-lg`}
        >
          {levelInfo.level >= 7 ? (
            <Star className="w-8 h-8 text-white" />
          ) : levelInfo.level >= 4 ? (
            <Trophy className="w-8 h-8 text-white" />
          ) : (
            <Zap className="w-8 h-8 text-white" />
          )}
        </motion.div>
        
        <div className="flex-1">
          <h4 className="font-game text-xl font-bold text-white mb-1">
            {language === 'zh-CN' ? levelInfo.title : levelInfo.title_en}
          </h4>
          <p className="text-gray-400 text-sm font-body">
            {levelInfo.currentExp} / {levelInfo.expForNextLevel} {getTranslation(language, 'common.experience')}
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="h-3 bg-dark-bg rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelInfo.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className={`h-full bg-gradient-to-r ${currentColor} rounded-full relative`}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500 font-body">
          <span>{levelInfo.currentExp} EXP</span>
          <span>{Math.round(levelInfo.progress)}%</span>
          <span>{levelInfo.expForNextLevel} EXP</span>
        </div>
      </div>

      {nextLevel && (
        <div className="mt-4 p-3 bg-dark-bg/50 rounded-xl border border-dark-border">
          <p className="text-sm text-gray-400 font-body">
            {getTranslation(language, 'common.level')} {levelInfo.level + 1}:
            <span className="text-gray-300 ml-1">
              {language === 'zh-CN' ? nextLevel.title : nextLevel.title_en}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1 font-body">
            {levelInfo.expForNextLevel - levelInfo.currentExp} {getTranslation(language, 'common.experience')} {language === 'zh-CN' ? '后升级' : 'to next level'}
          </p>
        </div>
      )}
    </div>
  );
}
