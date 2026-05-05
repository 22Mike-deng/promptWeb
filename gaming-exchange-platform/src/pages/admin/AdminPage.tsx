import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Gamepad2, Gift, TrendingUp, Plus, Edit, Trash2, BarChart3 } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { getTranslation } from '../../i18n';
import { supabase } from '../../lib/supabase';
import { type Profile } from '../../types';

export default function AdminPage() {
  const { user, profile, language, fetchGuesses, guesses, fetchProducts, products } = useAppStore();
  const [users, setUsers] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'guesses' | 'products'>('stats');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'guess' | 'product'>('guess');
  void isModalOpen;
  void modalType;

  useEffect(() => {
    if (user && profile?.is_admin) {
      fetchUsers();
      fetchGuesses();
      fetchProducts();
    }
  }, [user, profile]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  if (!user || !profile?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center particle-bg">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400 font-body">
            {language === 'zh-CN' ? '您没有管理员权限' : 'You do not have admin privileges'}
          </p>
        </div>
      </div>
    );
  }

  const totalPoints = users.reduce((sum, u) => sum + u.points, 0);


  return (
    <div className="min-h-screen particle-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-game text-4xl font-bold text-white mb-2 neon-text flex items-center gap-3">
            <Shield className="w-10 h-10 text-neon-purple" />
            {getTranslation(language, 'admin.title')}
          </h1>
          <p className="text-gray-400 font-body text-lg">
            {language === 'zh-CN' ? '管理员面板' : 'Admin Dashboard'} · {profile.username}
          </p>
        </motion.div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'stats', label: getTranslation(language, 'admin.statistics'), icon: BarChart3 },
            { key: 'users', label: getTranslation(language, 'admin.users'), icon: Users },
            { key: 'guesses', label: getTranslation(language, 'admin.guesses'), icon: Gamepad2 },
            { key: 'products', label: getTranslation(language, 'admin.products'), icon: Gift },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-body font-medium transition-all whitespace-nowrap ${
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

        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="glass-effect rounded-2xl p-6 neon-border">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-neon-blue" />
                <span className="text-gray-400 font-body">{getTranslation(language, 'admin.total_users')}</span>
              </div>
              <p className="font-game text-4xl font-bold text-white">{users.length}</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 neon-border">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-neon-yellow" />
                <span className="text-gray-400 font-body">{getTranslation(language, 'admin.total_points')}</span>
              </div>
              <p className="font-game text-4xl font-bold text-neon-yellow">{totalPoints.toLocaleString()}</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 neon-border">
              <div className="flex items-center gap-3 mb-4">
                <Gamepad2 className="w-8 h-8 text-neon-pink" />
                <span className="text-gray-400 font-body">{language === 'zh-CN' ? '竞猜总数' : 'Total Guesses'}</span>
              </div>
              <p className="font-game text-4xl font-bold text-white">{guesses.length}</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 neon-border">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-8 h-8 text-neon-green" />
                <span className="text-gray-400 font-body">{language === 'zh-CN' ? '商品总数' : 'Total Products'}</span>
              </div>
              <p className="font-game text-4xl font-bold text-neon-green">{products.length}</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect rounded-2xl p-6 neon-border"
          >
            <h3 className="font-game text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-neon-blue" />
              {getTranslation(language, 'admin.users')}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-4 text-gray-400 font-body text-sm">{getTranslation(language, 'common.username')}</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-body text-sm">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-body text-sm">{getTranslation(language, 'common.level')}</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-body text-sm">{getTranslation(language, 'common.points')}</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-body text-sm">{language === 'zh-CN' ? '签到次数' : 'Sign-ins'}</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-body text-sm">Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-dark-border/50 hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-body">{user.username}</td>
                      <td className="py-3 px-4 text-gray-400 font-body text-sm">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded bg-neon-purple/20 text-neon-purple font-game text-sm">
                          Lv.{user.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neon-yellow font-game">{user.points}</td>
                      <td className="py-3 px-4 text-gray-400 font-body">{user.total_sign_ins}</td>
                      <td className="py-3 px-4">
                        {user.is_admin ? (
                          <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 font-body text-sm">
                            {language === 'zh-CN' ? '是' : 'Yes'}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-gray-500/20 text-gray-400 font-body text-sm">
                            {language === 'zh-CN' ? '否' : 'No'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'guesses' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect rounded-2xl p-6 neon-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-game text-lg font-bold text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-neon-pink" />
                {getTranslation(language, 'admin.guesses')}
              </h3>
              <button
                onClick={() => {
                  setModalType('guess');
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-purple text-white font-body hover:bg-neon-purple/80 transition-all"
              >
                <Plus className="w-4 h-4" />
                {getTranslation(language, 'admin.add_guess')}
              </button>
            </div>

            <div className="space-y-4">
              {guesses.map((guess) => (
                <div key={guess.id} className="p-4 bg-dark-bg rounded-xl border border-dark-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-body font-semibold">
                        {language === 'zh-CN' ? guess.title : guess.title_en}
                      </h4>
                      <p className="text-gray-400 text-sm font-body mt-1">
                        {guess.options.length} {language === 'zh-CN' ? '个选项' : 'options'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-game font-bold ${
                        guess.status === 'active' ? 'bg-neon-green/20 text-neon-green' :
                        guess.status === 'closed' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-neon-yellow/20 text-neon-yellow'
                      }`}>
                        {guess.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect rounded-2xl p-6 neon-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-game text-lg font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-neon-green" />
                {getTranslation(language, 'admin.products')}
              </h3>
              <button
                onClick={() => {
                  setModalType('product');
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-green text-white font-body hover:bg-neon-green/80 transition-all"
              >
                <Plus className="w-4 h-4" />
                {getTranslation(language, 'admin.add_product')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="p-4 bg-dark-bg rounded-xl border border-dark-border">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="text-white font-body font-semibold">
                    {language === 'zh-CN' ? product.name : product.name_en}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-neon-yellow font-game font-bold">{product.points_cost} pts</span>
                    <span className="text-gray-400 text-sm font-body">{product.stock} {language === 'zh-CN' ? '库存' : 'in stock'}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button className="flex-1 p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                      <Edit className="w-4 h-4 mx-auto" />
                    </button>
                    <button className="flex-1 p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all">
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
