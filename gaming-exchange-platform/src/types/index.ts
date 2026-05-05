export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  points: number;
  experience: number;
  level: number;
  streak_days: number;
  total_sign_ins: number;
  last_sign_in?: string;
  is_admin: boolean;
  admin_level: number;
  created_at: string;
  updated_at: string;
}

export interface SignIn {
  id: string;
  user_id: string;
  sign_in_date: string;
  points_earned: number;
  streak_day: number;
  created_at: string;
}

export interface Guess {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  options: string[];
  options_en: string[];
  correct_answer: number;
  points_cost: number;
  points_reward: number;
  start_time: string;
  end_time: string;
  status: 'pending' | 'active' | 'closed';
  created_by: string;
  created_at: string;
}

export interface GuessParticipant {
  id: string;
  guess_id: string;
  user_id: string;
  selected_option: number;
  points_staked: number;
  is_winner: boolean;
  points_earned: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  image_url: string;
  points_cost: number;
  stock: number;
  status: 'available' | 'unavailable' | 'limited';
  category: string;
  created_at: string;
}

export interface Redemption {
  id: string;
  user_id: string;
  product_id: string;
  points_spent: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
}

export interface PointsHistory {
  id: string;
  user_id: string;
  amount: number;
  type: 'sign_in' | 'guess_win' | 'guess_lose' | 'redeem' | 'admin_bonus';
  description: string;
  created_at: string;
}

export interface LevelConfig {
  level: number;
  min_experience: number;
  title: string;
  title_en: string;
}

export const LEVEL_CONFIG: LevelConfig[] = [
  { level: 1, min_experience: 0, title: '新手冒险者', title_en: 'Novice Adventurer' },
  { level: 2, min_experience: 100, title: '初级探险家', title_en: 'Junior Explorer' },
  { level: 3, min_experience: 300, title: '中级冒险者', title_en: 'Intermediate Adventurer' },
  { level: 4, min_experience: 600, title: '高级冒险家', title_en: 'Senior Adventurer' },
  { level: 5, min_experience: 1000, title: '精英战士', title_en: 'Elite Warrior' },
  { level: 6, min_experience: 1500, title: '大师级玩家', title_en: 'Master Player' },
  { level: 7, min_experience: 2100, title: '传说冒险王', title_en: 'Legendary Hero' },
  { level: 8, min_experience: 2800, title: '传奇大师', title_en: 'Legendary Master' },
  { level: 9, min_experience: 3600, title: '不朽神话', title_en: 'Immortal Myth' },
  { level: 10, min_experience: 4500, title: '至尊王者', title_en: 'Supreme Champion' },
];

export const getLevelInfo = (experience: number) => {
  let level = 1;
  let title = LEVEL_CONFIG[0].title;
  let title_en = LEVEL_CONFIG[0].title_en;
  let progress = 0;
  let expForNextLevel = LEVEL_CONFIG[1]?.min_experience || 4500;

  for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
    if (experience >= LEVEL_CONFIG[i].min_experience) {
      level = LEVEL_CONFIG[i].level;
      title = LEVEL_CONFIG[i].title;
      title_en = LEVEL_CONFIG[i].title_en;
      
      if (i < LEVEL_CONFIG.length - 1) {
        const currentMinExp = LEVEL_CONFIG[i].min_experience;
        const nextMinExp = LEVEL_CONFIG[i + 1].min_experience;
        progress = ((experience - currentMinExp) / (nextMinExp - currentMinExp)) * 100;
        expForNextLevel = nextMinExp;
      } else {
        progress = 100;
      }
      break;
    }
  }

  return { level, title, title_en, progress, expForNextLevel, currentExp: experience };
};

export const calculateExperienceGain = (points: number) => {
  return Math.floor(points * 0.5);
};
