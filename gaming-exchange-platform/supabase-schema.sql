-- Gaming Exchange Platform - Supabase Database Schema
-- Run this SQL in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    points INTEGER DEFAULT 100,
    experience INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    total_sign_ins INTEGER DEFAULT 0,
    last_sign_in TIMESTAMPTZ,
    is_admin BOOLEAN DEFAULT FALSE,
    admin_level INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sign-ins table
CREATE TABLE IF NOT EXISTS sign_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sign_in_date DATE NOT NULL,
    points_earned INTEGER NOT NULL,
    streak_day INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, sign_in_date)
);

-- Guesses table
CREATE TABLE IF NOT EXISTS guesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description TEXT,
    description_en TEXT,
    options TEXT[] NOT NULL,
    options_en TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    points_cost INTEGER DEFAULT 10,
    points_reward INTEGER DEFAULT 20,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'closed')),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guess participants table
CREATE TABLE IF NOT EXISTS guess_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guess_id UUID NOT NULL REFERENCES guesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    selected_option INTEGER NOT NULL,
    points_staked INTEGER NOT NULL,
    is_winner BOOLEAN DEFAULT FALSE,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guess_id, user_id)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    description_en TEXT,
    image_url TEXT,
    points_cost INTEGER NOT NULL,
    stock INTEGER DEFAULT 0,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'unavailable', 'limited')),
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Redemptions table
CREATE TABLE IF NOT EXISTS redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    points_spent INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Points history table
CREATE TABLE IF NOT EXISTS points_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('sign_in', 'guess_win', 'guess_lose', 'redeem', 'admin_bonus')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sign_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE guesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE guess_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- RLS Policies for sign_ins
CREATE POLICY "Users can view their own sign-ins"
    ON sign_ins FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sign-ins"
    ON sign_ins FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for guesses
CREATE POLICY "Everyone can view active guesses"
    ON guesses FOR SELECT
    USING (status = 'active' OR status = 'closed');

CREATE POLICY "Admins can manage guesses"
    ON guesses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- RLS Policies for guess_participants
CREATE POLICY "Users can view their own participations"
    ON guess_participants FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create participations"
    ON guess_participants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for products
CREATE POLICY "Everyone can view available products"
    ON products FOR SELECT
    USING (status = 'available');

CREATE POLICY "Admins can manage products"
    ON products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- RLS Policies for redemptions
CREATE POLICY "Users can view their own redemptions"
    ON redemptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create redemptions"
    ON redemptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for points_history
CREATE POLICY "Users can view their own points history"
    ON points_history FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sign_ins_user_id ON sign_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_sign_ins_date ON sign_ins(sign_in_date);
CREATE INDEX IF NOT EXISTS idx_guesses_status ON guesses(status);
CREATE INDEX IF NOT EXISTS idx_guess_participants_user_id ON guess_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_history_user_id ON points_history(user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO guesses (title, title_en, description, description_en, options, options_en, correct_answer, points_cost, points_reward, end_time)
VALUES
    (
        '哪个星球是太阳系中最大的？',
        'Which planet is the largest in the solar system?',
        '太阳系八大行星知识问答',
        'Solar system planets trivia',
        ARRAY['地球', '木星', '土星', '火星'],
        ARRAY['Earth', 'Jupiter', 'Saturn', 'Mars'],
        1,
        10,
        20,
        NOW() + INTERVAL '7 days'
    ),
    (
        'Python编程语言的创始人是？',
        'Who created the Python programming language?',
        '编程语言历史知识',
        'Programming languages history',
        ARRAY['Guido van Rossum', 'James Gosling', 'Bjarne Stroustrup', 'Dennis Ritchie'],
        ARRAY['Guido van Rossum', 'James Gosling', 'Bjarne Stroustrup', 'Dennis Ritchie'],
        0,
        15,
        30,
        NOW() + INTERVAL '7 days'
    );

INSERT INTO products (name, name_en, description, description_en, image_url, points_cost, stock, category)
VALUES
    (
        '虚拟游戏皮肤礼包',
        'Virtual Game Skin Pack',
        '包含多种稀有游戏皮肤的兑换码',
        'Redeemable code for multiple rare game skins',
        'https://placehold.co/400x300/a855f7/white?text=Skin+Pack',
        500,
        100,
        'game_items'
    ),
    (
        '游戏周边T恤',
        'Gaming Merchandise T-Shirt',
        '限量版游戏主题T恤',
        'Limited edition gaming-themed T-shirt',
        'https://placehold.co/400x300/3b82f6/white?text=T-Shirt',
        1000,
        50,
        'merchandise'
    ),
    (
        '高级游戏手柄',
        'Premium Game Controller',
        '专业级无线游戏手柄',
        'Professional wireless game controller',
        'https://placehold.co/400x300/ec4899/white?text=Controller',
        2000,
        20,
        'hardware'
    );
