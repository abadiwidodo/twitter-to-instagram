export interface TwitterPost {
  id: string;
  text: string;
  author: {
    name: string;
    username: string;
    profile_image_url?: string;
  };
  created_at: string;
  public_metrics?: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
  };
}

export interface InstagramStyle {
  fontFamily: string;
  fontSize: string;
  textColor: string;
  backgroundColor: string;
  backgroundImage?: string;
  textAlign: 'left' | 'center' | 'right';
  padding: string;
}

export interface BackgroundTheme {
  name: string;
  gradient: string;
  textColor: string;
  description: string;
}