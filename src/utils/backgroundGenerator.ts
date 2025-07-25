import { BackgroundTheme } from '../types';

export const backgroundThemes: BackgroundTheme[] = [
  {
    name: 'Sunset Vibes',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    textColor: '#2d3748',
    description: 'Warm and inspiring'
  },
  {
    name: 'Ocean Breeze',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    description: 'Cool and calming'
  },
  {
    name: 'Forest Fresh',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    textColor: '#ffffff',
    description: 'Natural and refreshing'
  },
  {
    name: 'Golden Hour',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    textColor: '#ffffff',
    description: 'Vibrant and energetic'
  },
  {
    name: 'Midnight Sky',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    textColor: '#ffffff',
    description: 'Professional and sleek'
  },
  {
    name: 'Autumn Leaves',
    gradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
    textColor: '#2d3748',
    description: 'Warm and cozy'
  }
];

// Analyze text content and suggest appropriate background
export function suggestBackgroundTheme(text: string): BackgroundTheme {
  const lowerText = text.toLowerCase();
  
  // Keywords for different themes
  const themeKeywords = {
    'Sunset Vibes': ['sunset', 'evening', 'warm', 'cozy', 'love', 'heart', 'romantic'],
    'Ocean Breeze': ['ocean', 'sea', 'water', 'blue', 'calm', 'peaceful', 'relax'],
    'Forest Fresh': ['nature', 'green', 'forest', 'tree', 'fresh', 'natural', 'eco'],
    'Golden Hour': ['energy', 'excited', 'launch', 'new', 'amazing', 'awesome', 'great'],
    'Midnight Sky': ['professional', 'business', 'work', 'tech', 'code', 'development'],
    'Autumn Leaves': ['autumn', 'fall', 'orange', 'warm', 'coffee', 'cozy', 'home']
  };
  
  // Score each theme based on keyword matches
  let bestTheme = backgroundThemes[0];
  let bestScore = 0;
  
  for (const theme of backgroundThemes) {
    const keywords = themeKeywords[theme.name as keyof typeof themeKeywords] || [];
    const score = keywords.reduce((acc, keyword) => {
      return acc + (lowerText.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (score > bestScore) {
      bestScore = score;
      bestTheme = theme;
    }
  }
  
  return bestTheme;
}

// Generate random background image URL based on text content
export function generateBackgroundImage(text: string): string {
  // For future use when implementing keyword-based image selection with different APIs
  // const keywords = extractKeywords(text);
  // const query = keywords.slice(0, 2).join(' ') || 'abstract minimal';
  
  // Use Picsum (Lorem Picsum) for random images with blur effect
  // Adding text hash to make images consistent for same content
  const seed = text.length + text.charCodeAt(0);
  const picsum = `https://picsum.photos/1080/1080?blur=1&random=${seed}`;
  
  // For now, return Picsum as it's free and doesn't require API key
  return picsum;
}

// Alternative function for Unsplash API (when you have an API key)
export function generateUnsplashImage(text: string, accessKey: string): string {
  const keywords = extractKeywords(text);
  const query = keywords.slice(0, 2).join(' ') || 'abstract minimal';
  
  return `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&w=1080&h=1080&client_id=${accessKey}`;
}

// Alternative function for Pexels API (when you have an API key)
export function generatePexelsImageUrl(text: string): string {
  const keywords = extractKeywords(text);
  const query = keywords.slice(0, 2).join(' ') || 'abstract minimal';
  
  // This returns the API endpoint - you'll need to fetch it to get the actual image URL
  return `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`;
}

function extractKeywords(text: string): string[] {
  // Remove hashtags, mentions, and URLs
  const cleanText = text
    .replace(/#\w+/g, '')
    .replace(/@\w+/g, '')
    .replace(/https?:\/\/[^\s]+/g, '')
    .toLowerCase();
  
  // Common words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this',
    'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
    'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their'
  ]);
  
  // Extract meaningful words
  const words = cleanText
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter(word => /^[a-zA-Z]+$/.test(word));
  
  // Return unique words, prioritizing longer ones
  return [...new Set(words)].sort((a, b) => b.length - a.length);
}