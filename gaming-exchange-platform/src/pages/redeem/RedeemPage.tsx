import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles, ShoppingCart, Package, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { getTranslation } from '../../i18n';
import type { Product } from '../../types';

export default function RedeemPage() {
  const { user, profile, language, products, fetchProducts, redeemProduct } = useAppStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center particle-bg">
        <p className="text-gray-400 font-body">{getTranslation(language, 'common.loading')}</p>
      </div>
    );
  }

  const handleRedeem = async () => {
    if (!selectedProduct) return;

    setIsSubmitting(true);
    const result = await redeemProduct(selectedProduct.id);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setIsSubmitting(false);

    if (result.success) {
      setTimeout(() => {
        setSelectedProduct(null);
        setMessage(null);
      }, 2000);
    }

    setTimeout(() => setMessage(null), 3000);
  };

  if (selectedProduct) {
    return (
      <div className="min-h-screen particle-bg py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => {
              setSelectedProduct(null);
              setMessage(null);
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 font-body transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {getTranslation(language, 'common.back')}
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl overflow-hidden neon-border"
          >
            <div className="relative h-64 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20">
              <img
                src={selectedProduct.image_url}
                alt={language === 'zh-CN' ? selectedProduct.name : selectedProduct.name_en}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h2 className="font-game text-2xl font-bold text-white mb-2">
                  {language === 'zh-CN' ? selectedProduct.name : selectedProduct.name_en}
                </h2>
                <p className="text-gray-400 font-body">
                  {language === 'zh-CN' ? selectedProduct.description : selectedProduct.description_en}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-dark-bg rounded-xl text-center">
                  <p className="text-sm text-gray-400 font-body mb-1">{getTranslation(language, 'redeem.points_needed')}</p>
                  <p className="text-2xl font-game font-bold text-neon-yellow flex items-center justify-center gap-1">
                    <Sparkles className="w-5 h-5" />
                    {selectedProduct.points_cost}
                  </p>
                </div>
                <div className="p-4 bg-dark-bg rounded-xl text-center">
                  <p className="text-sm text-gray-400 font-body mb-1">{getTranslation(language, 'redeem.in_stock')}</p>
                  <p className={`text-2xl font-game font-bold flex items-center justify-center gap-1 ${
                    selectedProduct.stock > 10 ? 'text-neon-green' : selectedProduct.stock > 0 ? 'text-neon-yellow' : 'text-red-400'
                  }`}>
                    <Package className="w-5 h-5" />
                    {selectedProduct.stock}
                  </p>
                </div>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl text-sm font-body mb-4 ${
                    message.type === 'success'
                      ? 'bg-neon-green/20 border border-neon-green/50 text-neon-green'
                      : 'bg-red-500/20 border border-red-500/50 text-red-400'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}

              <motion.button
                onClick={handleRedeem}
                disabled={
                  isSubmitting || 
                  profile!.points < selectedProduct.points_cost || 
                  selectedProduct.stock <= 0
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-green to-emerald-500 text-white font-game font-bold text-lg hover:shadow-lg hover:shadow-neon-green/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {getTranslation(language, 'redeem.redeem_now')}
                  </>
                )}
              </motion.button>

              {profile!.points < selectedProduct.points_cost && (
                <p className="text-center text-red-400 mt-3 font-body text-sm">
                  {getTranslation(language, 'redeem.insufficient_points')}
                </p>
              )}

              {selectedProduct.stock <= 0 && (
                <p className="text-center text-red-400 mt-3 font-body text-sm">
                  {getTranslation(language, 'redeem.out_of_stock')}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen particle-bg py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-game text-4xl font-bold text-white mb-2 neon-text flex items-center gap-3">
            <Gift className="w-10 h-10 text-neon-green" />
            {getTranslation(language, 'redeem.title')}
          </h1>
          <p className="text-gray-400 font-body text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neon-yellow" />
            {getTranslation(language, 'home.points_balance')}: {profile?.points}
          </p>
        </motion.div>

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-2xl p-12 text-center neon-border"
          >
            <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 font-body text-lg">
              {getTranslation(language, 'common.no_data')}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-effect rounded-2xl overflow-hidden neon-border hover:border-neon-green transition-all cursor-pointer group"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative h-48 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20">
                  <img
                    src={product.image_url}
                    alt={language === 'zh-CN' ? product.name : product.name_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-game font-bold ${
                      product.stock > 10 
                        ? 'bg-neon-green/80 text-white' 
                        : product.stock > 0 
                        ? 'bg-neon-yellow/80 text-white'
                        : 'bg-red-500/80 text-white'
                    }`}>
                      {product.stock > 0 ? `${product.stock} ${language === 'zh-CN' ? '库存' : 'in stock'}` : getTranslation(language, 'redeem.out_of_stock')}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-game text-lg font-bold text-white mb-2">
                    {language === 'zh-CN' ? product.name : product.name_en}
                  </h3>
                  <p className="text-gray-400 font-body text-sm mb-4 line-clamp-2">
                    {language === 'zh-CN' ? product.description : product.description_en}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-neon-yellow">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-game text-xl font-bold">{product.points_cost}</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-emerald-500 text-white font-game font-bold text-sm hover:shadow-lg hover:shadow-neon-green/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={profile!.points < product.points_cost || product.stock <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                    >
                      {getTranslation(language, 'redeem.redeem_now')}
                    </motion.button>
                  </div>

                  {profile!.points < product.points_cost && (
                    <p className="text-xs text-red-400 mt-2 font-body">
                      {getTranslation(language, 'redeem.insufficient_points')}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
