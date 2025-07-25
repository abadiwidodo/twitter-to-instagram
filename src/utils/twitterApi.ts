// Mock Twitter API service - In production, you'd need Twitter API v2 credentials
// For demo purposes, we'll simulate fetching tweet data

export interface MockTweetData {
  id: string;
  text: string;
  author: {
    name: string;
    username: string;
  };
  created_at: string;
}

// Extract tweet ID from various Twitter URL formats
export function extractTweetId(url: string): string | null {
  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/,
    /x\.com\/\w+\/status\/(\d+)/,
    /mobile\.twitter\.com\/\w+\/status\/(\d+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

// Mock function to simulate fetching tweet data
export async function fetchTweetData(tweetId: string): Promise<MockTweetData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock tweet data based on ID
  const mockTweets: Record<string, MockTweetData> = {
    '1234567890': {
      id: '1234567890',
      text: 'Just launched my new project! 🚀 It\'s been months of hard work, but finally seeing it come to life. Grateful for all the support from the community. #startup #tech #launch',
      author: {
        name: 'John Developer',
        username: 'johndev'
      },
      created_at: '2024-01-15T10:30:00Z'
    },
    '9876543210': {
      id: '9876543210',
      text: 'Beautiful sunset at the beach today 🌅 Sometimes you need to step away from the screen and appreciate nature\'s artwork. #sunset #beach #nature #photography',
      author: {
        name: 'Sarah Photos',
        username: 'sarahphotos'
      },
      created_at: '2024-01-14T18:45:00Z'
    }
  };

  // Return mock data or generate random content
  return mockTweets[tweetId] || {
    id: tweetId,
    text: 'This is a sample tweet content that would be fetched from Twitter API. In a real implementation, this would contain the actual tweet text, author information, and metadata.',
    author: {
      name: 'Sample User',
      username: 'sampleuser'
    },
    created_at: new Date().toISOString()
  };
}