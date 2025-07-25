# Twitter to Instagram Post Converter

A React application that converts Twitter posts into beautifully styled Instagram content with user authentication powered by Supabase.

## Features

- Convert Twitter posts to Instagram-friendly format
- Fetch tweets directly from Twitter URLs
- AI-powered theme suggestions based on content
- Custom styling options (fonts, colors, backgrounds)
- Generate stunning 1080x1080 images for Instagram
- User authentication with Supabase
- Save styled posts (Premium feature)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at [Supabase](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Fill in your Supabase credentials in `.env.local`:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Supabase Configuration

The application uses Supabase for user authentication and data storage. Follow these steps:

1. **Enable Authentication**
   - Enable email authentication in your Supabase dashboard
   - Configure email templates (optional)
   - Set up any additional authentication providers if needed

2. **Create Database Tables**
   - Go to the SQL Editor in your Supabase dashboard
   - Run the following SQL to create the required tables:

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

## Authentication Features

- **Sign Up**: Create a new account with email and password
- **Sign In**: Log in with existing credentials
- **Sign Out**: Secure logout functionality
- **Password Requirements**: Minimum 6 characters
- **Email Verification**: Users receive verification emails upon signup
- **Save Posts**: Authenticated users can save their styled posts
- **View Saved Posts**: Access and manage previously saved posts
- **User Preferences**: Store and retrieve custom styling preferences

## Usage

1. **Without Authentication**: Use the basic conversion features
2. **With Authentication**: Sign up or log in to access premium features
3. **Converting Posts**: 
   - Paste Twitter content or URL
   - Customize styling options
   - Generate and download styled images

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Image Generation**: html2canvas

## Project Structure

```
src/
├── components/
│   ├── AuthModal.tsx          # Login/Signup modal
│   ├── UserProfile.tsx        # User profile dropdown
│   ├── InstagramPreview.tsx   # Preview component
│   ├── StyleCustomizer.tsx    # Styling options
│   └── TwitterUrlInput.tsx    # URL input component
├── contexts/
│   └── AuthContext.tsx        # Authentication context
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── types/
│   └── index.ts              # TypeScript type definitions
├── utils/
│   ├── backgroundGenerator.ts # Theme suggestion logic
│   ├── converter.ts          # Text conversion utilities
│   └── twitterApi.ts         # Twitter integration
└── vite-env.d.ts             # Environment variable types
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
