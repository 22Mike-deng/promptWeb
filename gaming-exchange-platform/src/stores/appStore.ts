import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, Guess, Product, SignIn } from '../types';
import { supabase } from '../lib/supabase';

interface AppState {
  user: any;
  profile: Profile | null;
  language: 'zh-CN' | 'en-US';
  isLoading: boolean;
  guesses: Guess[];
  products: Product[];
  signIns: SignIn[];
  
  setUser: (user: any) => void;
  setProfile: (profile: Profile | null) => void;
  setLanguage: (lang: 'zh-CN' | 'en-US') => void;
  setLoading: (loading: boolean) => void;
  
  fetchProfile: () => Promise<void>;
  fetchGuesses: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchSignIns: () => Promise<void>;
  
  signIn: () => Promise<{ success: boolean; message: string }>;
  participateInGuess: (guessId: string, selectedOption: number, points: number) => Promise<{ success: boolean; message: string }>;
  redeemProduct: (productId: string) => Promise<{ success: boolean; message: string }>;
  
  updatePoints: (amount: number, type: string, description: string) => Promise<void>;
  updateExperience: (amount: number) => Promise<void>;
  
  logout: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      language: 'zh-CN',
      isLoading: false,
      guesses: [],
      products: [],
      signIns: [],
      
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLanguage: (language) => set({ language }),
      setLoading: (isLoading) => set({ isLoading }),
      
      fetchProfile: async () => {
        const { user } = get();
        if (!user) return;
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          set({ profile: data });
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      },
      
      fetchGuesses: async () => {
        try {
          const { data, error } = await supabase
            .from('guesses')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          set({ guesses: data || [] });
        } catch (error) {
          console.error('Error fetching guesses:', error);
        }
      },
      
      fetchProducts: async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('status', 'available')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          set({ products: data || [] });
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      },
      
      fetchSignIns: async () => {
        const { user } = get();
        if (!user) return;
        
        try {
          const { data, error } = await supabase
            .from('sign_ins')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);
          
          if (error) throw error;
          set({ signIns: data || [] });
        } catch (error) {
          console.error('Error fetching sign-ins:', error);
        }
      },
      
      signIn: async () => {
        const { user, profile } = get();
        if (!user || !profile) {
          return { success: false, message: 'Please login first' };
        }
        
        const today = new Date().toISOString().split('T')[0];
        const lastSignIn = profile.last_sign_in ? new Date(profile.last_sign_in).toISOString().split('T')[0] : null;
        
        if (lastSignIn === today) {
          return { success: false, message: 'Already signed in today' };
        }
        
        try {
          const isConsecutive = lastSignIn === new Date(Date.now() - 86400000).toISOString().split('T')[0];
          const newStreak = isConsecutive ? profile.streak_days + 1 : 1;
          const basePoints = 10;
          const streakBonus = Math.min(newStreak * 2, 20);
          const totalPoints = basePoints + streakBonus;
          
          const { error: signInError } = await supabase
            .from('sign_ins')
            .insert({
              user_id: user.id,
              sign_in_date: today,
              points_earned: totalPoints,
              streak_day: newStreak,
            });
          
          if (signInError) throw signInError;
          
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              points: profile.points + totalPoints,
              experience: profile.experience + Math.floor(totalPoints * 0.5),
              streak_days: newStreak,
              total_sign_ins: profile.total_sign_ins + 1,
              last_sign_in: new Date().toISOString(),
            })
            .eq('id', user.id);
          
          if (profileError) throw profileError;
          
          await supabase
            .from('points_history')
            .insert({
              user_id: user.id,
              amount: totalPoints,
              type: 'sign_in',
              description: `Daily sign-in bonus (${newStreak} day streak)`,
            });
          
          await get().fetchProfile();
          await get().fetchSignIns();
          
          return { success: true, message: `Signed in! Earned ${totalPoints} points!` };
        } catch (error) {
          console.error('Error signing in:', error);
          return { success: false, message: 'Sign in failed' };
        }
      },
      
      participateInGuess: async (guessId: string, selectedOption: number, points: number) => {
        const { user, profile } = get();
        if (!user || !profile) {
          return { success: false, message: 'Please login first' };
        }
        
        if (profile.points < points) {
          return { success: false, message: 'Insufficient points' };
        }
        
        try {
          const { error: participantError } = await supabase
            .from('guess_participants')
            .insert({
              guess_id: guessId,
              user_id: user.id,
              selected_option: selectedOption,
              points_staked: points,
            });
          
          if (participantError) throw participantError;
          
          const { error: deductError } = await supabase
            .from('profiles')
            .update({
              points: profile.points - points,
            })
            .eq('id', user.id);
          
          if (deductError) throw deductError;
          
          await supabase
            .from('points_history')
            .insert({
              user_id: user.id,
              amount: -points,
              type: 'guess_lose',
              description: `Participated in guess`,
            });
          
          await get().fetchProfile();
          
          return { success: true, message: 'Participation successful!' };
        } catch (error) {
          console.error('Error participating in guess:', error);
          return { success: false, message: 'Participation failed' };
        }
      },
      
      redeemProduct: async (productId: string) => {
        const { user, profile } = get();
        if (!user || !profile) {
          return { success: false, message: 'Please login first' };
        }
        
        try {
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
          
          if (productError) throw productError;
          
          if (profile.points < product.points_cost) {
            return { success: false, message: 'Insufficient points' };
          }
          
          if (product.stock <= 0) {
            return { success: false, message: 'Out of stock' };
          }
          
          const { error: redeemError } = await supabase
            .from('redemptions')
            .insert({
              user_id: user.id,
              product_id: productId,
              points_spent: product.points_cost,
              status: 'pending',
            });
          
          if (redeemError) throw redeemError;
          
          const { error: deductError } = await supabase
            .from('profiles')
            .update({
              points: profile.points - product.points_cost,
            })
            .eq('id', user.id);
          
          if (deductError) throw deductError;
          
          const { error: stockError } = await supabase
            .from('products')
            .update({
              stock: product.stock - 1,
            })
            .eq('id', productId);
          
          if (stockError) throw stockError;
          
          await supabase
            .from('points_history')
            .insert({
              user_id: user.id,
              amount: -product.points_cost,
              type: 'redeem',
              description: `Redeemed ${product.name}`,
            });
          
          await get().fetchProfile();
          await get().fetchProducts();
          
          return { success: true, message: 'Redemption successful!' };
        } catch (error) {
          console.error('Error redeeming product:', error);
          return { success: false, message: 'Redemption failed' };
        }
      },
      
      updatePoints: async (amount: number, type: string, description: string) => {
        const { user, profile } = get();
        if (!user || !profile) return;
        
        try {
          await supabase
            .from('profiles')
            .update({
              points: profile.points + amount,
            })
            .eq('id', user.id);
          
          await supabase
            .from('points_history')
            .insert({
              user_id: user.id,
              amount,
              type,
              description,
            });
          
          await get().fetchProfile();
        } catch (error) {
          console.error('Error updating points:', error);
        }
      },
      
      updateExperience: async (amount: number) => {
        const { user, profile } = get();
        if (!user || !profile) return;
        
        try {
          await supabase
            .from('profiles')
            .update({
              experience: profile.experience + amount,
            })
            .eq('id', user.id);
          
          await get().fetchProfile();
        } catch (error) {
          console.error('Error updating experience:', error);
        }
      },
      
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, profile: null, guesses: [], products: [], signIns: [] });
      },
    }),
    {
      name: 'gaming-exchange-storage',
      partialize: (state) => ({
        language: state.language,
      }),
    }
  )
);
