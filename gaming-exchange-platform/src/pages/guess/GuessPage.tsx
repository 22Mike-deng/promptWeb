import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Sparkles, Clock, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { getTranslation } from '../../i18n';
import type { Guess } from '../../types';

export default function GuessPage() {
  const { user, profile, language, guesses, fetchGuesses, participateInGuess } = useAppStore();
  const [selectedGuess, setSelectedGuess] = useState<Guess | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchGuesses();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center particle-bg">
        <p className="text-gray-400 font-body">{getTranslation(language, 'common.loading')}</p>
      </div>
    );
  }

  const handleParticipate = async () => {
    if (!selectedGuess || selectedOption === null || !profile) return;

    if (profile.points < selectedGuess.points_cost) {
      setMessage({ type: 'error', text: getTranslation(language, 'redeem.insufficient_points') });
      return;
    }

    setIsSubmitting(true);
    const result = await participateInGuess(selectedGuess.id, selectedOption, selectedGuess.points_cost);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setIsSubmitting(false);
    
    if (result.success) {
      setTimeout(() => {
        setSelectedGuess(null);
        setSelectedOption(null);
        setMessage(null);
      }, 2000);
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const activeGuesses = guesses.filter(g => g.status === 'active');

  if (selectedGuess) {
    return (
      <div className="min-h-screen particle-bg py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => {
              setSelectedGuess(null);
              setSelectedOption(null);
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
            className="glass-effect rounded-2xl p-6 neon-border"
          >
            <div className="mb-6">
              <h2 className="font-game text-2xl font-bold text-white mb-2">
                {language === 'zh-CN' ? selectedGuess.title : selectedGuess.title_en}
              </h2>
              <p className="text-gray-400 font-body">
                {language === 'zh-CN' ? selectedGuess.description : selectedGuess.description_en}
              </p>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 bg-dark-bg rounded-xl">
              <div className="flex items-center gap-2 text-neon-yellow">
                <Sparkles className="w-5 h-5" />
                <span className="font-game font-bold">{selectedGuess.points_cost}</span>
                <span className="text-gray-400 font-body">{language === 'zh-CN' ? '积分' : 'Points'}</span>
              </div>
              <div className="flex items-center gap-2 text-neon-green">
                <span className="font-game font-bold">→</span>
                <span className="font-game font-bold">{selectedGuess.points_reward}</span>
                <span className="text-gray-400 font-body">{language === 'zh-CN' ? '积分' : 'Points'}</span>
              </div>
              <div className="flex items-center gap-2 text-neon-blue ml-auto">
                <Clock className="w-4 h-4" />
                <span className="font-body text-sm">
                  {new Date(selectedGuess.end_time).toLocaleDateString()}
                </span>
              </div>
            </div>

            <h3 className="font-game text-lg font-bold text-white mb-4">
              {getTranslation(language, 'guess.select_option')}
            </h3>

            <div className="space-y-3 mb-6">
              {selectedGuess.options.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedOption(index)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left font-body ${
                    selectedOption === index
                      ? 'border-neon-purple bg-neon-purple/20 text-white'
                      : 'border-dark-border bg-dark-bg text-gray-300 hover:border-neon-purple/50'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 text-sm font-game font-bold ${
                    selectedOption === index
                      ? 'bg-neon-purple text-white'
                      : 'bg-dark-border text-gray-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  {language === 'zh-CN' ? selectedGuess.options[index] : selectedGuess.options_en[index]}
                </motion.button>
              ))}
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
              onClick={handleParticipate}
              disabled={selectedOption === null || isSubmitting || profile!.points < selectedGuess.points_cost}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-game font-bold text-lg hover:shadow-lg hover:shadow-neon-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {getTranslation(language, 'guess.confirm_participate')}
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {profile && profile.points < selectedGuess.points_cost && (
              <p className="text-center text-red-400 mt-3 font-body text-sm">
                {getTranslation(language, 'redeem.insufficient_points')}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen particle-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-game text-4xl font-bold text-white mb-2 neon-text flex items-center gap-3">
            <Gamepad2 className="w-10 h-10 text-neon-pink" />
            {getTranslation(language, 'guess.title')}
          </h1>
          <p className="text-gray-400 font-body text-lg">
            {getTranslation(language, 'guess.current_guesses')}
          </p>
        </motion.div>

        {activeGuesses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-2xl p-12 text-center neon-border"
          >
            <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 font-body text-lg">
              {getTranslation(language, 'common.no_data')}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {activeGuesses.map((guess, index) => (
              <motion.div
                key={guess.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6 neon-border hover:border-neon-purple transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-game text-xl font-bold text-white mb-2">
                      {language === 'zh-CN' ? guess.title : guess.title_en}
                    </h3>
                    <p className="text-gray-400 font-body text-sm">
                      {language === 'zh-CN' ? guess.description : guess.description_en}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-neon-yellow/20 border border-neon-yellow/50 text-neon-yellow">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-game font-bold text-sm">{guess.points_cost}</span>
                    </div>
                    <div className="flex items-center gap-1 text-neon-green text-sm font-body">
                      <span>→</span>
                      <span className="font-game font-bold">{guess.points_reward}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-body">
                      <Clock className="w-4 h-4" />
                      {new Date(guess.end_time).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 font-body">
                      {guess.options.length} {language === 'zh-CN' ? '个选项' : 'options'}
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setSelectedGuess(guess)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-game font-bold hover:shadow-lg hover:shadow-neon-purple/30 transition-all"
                  >
                    {getTranslation(language, 'guess.participate')}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
