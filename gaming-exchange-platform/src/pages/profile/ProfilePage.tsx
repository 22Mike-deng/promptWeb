import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Calendar, Gift, TrendingUp, Award } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { getLevelInfo } from '../../types';
import { getTranslation } from '../../i18n';
import { supabase } from '../../lib/supabase';
import type { PointsHistory } from '../../types';

export default function ProfilePage() {
  const { user, profile, language, fetchProfile, fetchSignIns, signIns } = useAppStore();
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'points' | 'signins'>('overview');

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSignIns();
      fetchPointsHistory();
    }
  }, [user]);

  const fetchPointsHistory = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('points_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPointsHistory(data || []);
    } catch (error) {
      console.error('Error fetching points history:', error);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center particle-bg">
        <p className="text-gray-400 font-body">{getTranslation(language, 'common.loading')}</p>
      </div>
    );
  }

  const levelInfo = getLevelInfo(profile.experience);

  const getPointsTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sign_in: language === 'zh-CN' ? '每日签到' : 'Daily Sign-in',
      guess_win: language === 'zh-CN' ? '竞猜获胜' : 'Guess Win',
      guess_lose: language === 'zh-CN' ? '竞猜参与' : 'Guess Participation',
      redeem: language === 'zh-CN' ? '商品兑换' : 'Redemption',
      admin_bonus: language === 'zh-CN' ? '管理员奖励' : 'Admin Bonus',
    };
    return labels[type] || type;
  };

  const getPointsTypeColor = (type: string) => {
    if (type === 'redeem' || type === 'guess_lose') return 'text-red-400';
    return 'text-neon-green';
  };

  return (
    <div className="min-h-screen particle-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6 mb-6 neon-border"
        >
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center shadow-lg"
            >
              <User className="w-10 h-10 text-white" />
            </motion.div>

            <div className="flex-1">
              <h1 className="font-game text-2xl font-bold text-white mb-1">
                {profile.username}
              </h1>
              <p className="text-gray-400 font-body mb-2">
                {profile.email}
              </p>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${
                  profile.level >= 7 ? 'from-yellow-400 to-orange-500' :
                  profile.level >= 4 ? 'from-purple-400 to-pink-500' :
                  'from-green-400 to-blue-500'
                } text-white font-game text-sm font-bold`}>
                  Lv.{levelInfo.level} {language === 'zh-CN' ? levelInfo.title : levelInfo.title_en}
                </span>
                <span className="text-gray-500 text-sm font-body">
                  {getTranslation(language, 'common.experience')}: {profile.experience}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 text-neon-yellow mb-1">
                <Sparkles className="w-6 h-6" />
                <span className="font-game text-3xl font-bold">{profile.points.toLocaleString()}</span>
              </div>
              <p className="text-gray-400 text-sm font-body">{getTranslation(language, 'common.points')}</p>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-6">
          {[
            { key: 'overview', label: language === 'zh-CN' ? '总览' : 'Overview', icon: TrendingUp },
            { key: 'points', label: getTranslation(language, 'profile.points_history'), icon: Sparkles },
            { key: 'signins', label: getTranslation(language, 'profile.sign_in_history'), icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-body font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-neon-purple text-white'
                    : 'bg-dark-card text-gray-400 hover:text-white hover:bg-dark-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="glass-effect rounded-2xl p-6 neon-border">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-neon-purple" />
                <span className="text-gray-400 font-body">{language === 'zh-CN' ? '当前等级' : 'Current Level'}</span>
              </div>
              <p className="font-game text-3xl font-bold text-white">{levelInfo.level}</p>
              <p className="text-gray-400 font-body text-sm mt-1">
                {language === 'zh-CN' ? levelInfo.title : levelInfo.title_en}
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-6 neon-border">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-8 h-8 text-neon-blue" />
                <span className="text-gray-400 font-body">{language === 'zh-CN' ? '签到统计' : 'Sign-in Stats'}</span>
              </div>
              <p className="font-game text-3xl font-bold text-white">{profile.total_sign_ins}</p>
              <p className="text-gray-400 font-body text-sm mt-1">
                {language === 'zh-CN' ? '总签到次数' : 'Total Sign-ins'}
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-6 neon-border">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-neon-yellow" />
                <span className="text-gray-400 font-body">{language === 'zh-CN' ? '连续签到' : 'Streak'}</span>
              </div>
              <p className="font-game text-3xl font-bold text-white">{profile.streak_days}</p>
              <p className="text-gray-400 font-body text-sm mt-1">
                {language === 'zh-CN' ? '天' : 'days'}
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'points' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect rounded-2xl p-6 neon-border"
          >
            <h3 className="font-game text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon-yellow" />
              {getTranslation(language, 'profile.points_history')}
            </h3>

            {pointsHistory.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 font-body">{getTranslation(language, 'common.no_data')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pointsHistory.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-dark-bg rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        record.amount > 0 ? 'bg-neon-green/20' : 'bg-red-500/20'
                      }`}>
                        {record.amount > 0 ? (
                          <TrendingUp className="w-5 h-5 text-neon-green" />
                        ) : (
                          <Gift className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-body font-semibold">
                          {getPointsTypeLabel(record.type)}
                        </p>
                        <p className="text-gray-500 text-sm font-body">
                          {record.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-game text-xl font-bold ${getPointsTypeColor(record.type)}`}>
                        {record.amount > 0 ? '+' : ''}{record.amount}
                      </p>
                      <p className="text-gray-500 text-xs font-body">
                        {new Date(record.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'signins' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect rounded-2xl p-6 neon-border"
          >
            <h3 className="font-game text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-neon-blue" />
              {getTranslation(language, 'profile.sign_in_history')}
            </h3>

            {signIns.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 font-body">{getTranslation(language, 'common.no_data')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {signIns.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-dark-bg rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-neon-green" />
                      </div>
                      <div>
                        <p className="text-white font-body font-semibold">
                          {new Date(record.sign_in_date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-500 text-sm font-body">
                          {language === 'zh-CN' ? '连续' : 'Streak'}: {record.streak_day} {language === 'zh-CN' ? '天' : 'days'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-game text-xl font-bold text-neon-yellow flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        +{record.points_earned}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
