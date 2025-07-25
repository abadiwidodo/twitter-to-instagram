# Supabase Setup Guide

This guide will walk you through setting up Supabase for your Twitter to Instagram converter application.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: twitter-to-instagram (or any name you prefer)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"

## 2. Get Your API Keys

1. Once your project is created, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (something like `https://xxxxxxxxxxxxx.supabase.co`)
   - **Project API Key** (anon, public)

## 3. Set Up Environment Variables

1. In your project root, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

## 4. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Make sure **Enable email confirmations** is turned on
3. Under **Email Templates**, you can customize the signup and reset password emails (optional)

## 5. Create Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query and paste the following SQL:

```sql
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
```

3. Run the query by clicking **RUN**

## 6. Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your application in the browser
3. Try to sign up with a test email
4. Check your email for the confirmation link
5. After confirming, try to sign in
6. Test saving a post and viewing saved posts

## 7. Optional: Email Configuration

If you want to use a custom email provider instead of Supabase's default:

1. Go to **Settings** > **Auth** > **SMTP Settings**
2. Configure your SMTP provider (SendGrid, Mailgun, etc.)
3. Update the email templates in **Auth** > **Email Templates**

## Troubleshooting

### Common Issues:

1. **Environment variables not loading**: Make sure your `.env.local` file is in the project root and restart your development server.

2. **Auth errors**: Check that your Supabase URL and API key are correct in the environment variables.

3. **Database errors**: Ensure you've run the SQL setup script and that Row Level Security policies are correctly configured.

4. **Email not sending**: Check your Supabase project logs and ensure email confirmation is enabled.

### Need Help?

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Community](https://github.com/supabase/supabase/discussions)
- Check your Supabase project logs in the dashboard

## Security Notes

- Never commit your `.env.local` file to version control
- Use environment variables for all sensitive data
- Row Level Security (RLS) is enabled to ensure users can only access their own data
- API keys should be kept secure and rotated regularly
