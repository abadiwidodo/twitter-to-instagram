import { supabase } from '../lib/supabase'
import { UserPreferences, SavedPost, InstagramStyle } from '../types'

export class PreferencesService {
  // User Preferences
  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching user preferences:', error)
      return null
    }
  }

  static async saveUserPreferences(preferences: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving user preferences:', error)
      return null
    }
  }

  // Saved Posts
  static async getSavedPosts(userId: string): Promise<SavedPost[]> {
    try {
      const { data, error } = await supabase
        .from('saved_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching saved posts:', error)
      return []
    }
  }

  static async savePost(post: Omit<SavedPost, 'id' | 'created_at' | 'updated_at'>): Promise<SavedPost | null> {
    try {
      const { data, error } = await supabase
        .from('saved_posts')
        .insert({
          ...post,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving post:', error)
      return null
    }
  }

  static async deletePost(postId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting post:', error)
      return false
    }
  }

  // Default style helpers
  static getDefaultStyle(): InstagramStyle {
    return {
      fontFamily: 'Inter, sans-serif',
      fontSize: '20px',
      textColor: '#ffffff',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textAlign: 'center',
      padding: '60px'
    }
  }
}

// SQL for creating the required tables (run this in your Supabase SQL editor)
export const SUPABASE_TABLES_SQL = `
-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  default_style JSONB NOT NULL,
  favorite_themes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create saved_posts table
CREATE TABLE IF NOT EXISTS saved_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  twitter_content TEXT NOT NULL,
  instagram_content TEXT NOT NULL,
  style JSONB NOT NULL,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for saved_posts
CREATE POLICY "Users can view their own posts" ON saved_posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own posts" ON saved_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON saved_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON saved_posts
  FOR DELETE USING (auth.uid() = user_id);
`;
