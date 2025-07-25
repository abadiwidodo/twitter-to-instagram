export function convertTwitterToInstagram(twitterPost: string): string {
  if (!twitterPost.trim()) {
    return '';
  }

  let converted = twitterPost;

  // Handle mentions - convert @username to more Instagram-friendly format
  converted = converted.replace(/@(\w+)/g, '@$1');

  // Extract hashtags and group them at the end
  const hashtags: string[] = [];
  converted = converted.replace(/#(\w+)/g, (match, tag) => {
    hashtags.push(`#${tag}`);
    return ''; // Remove hashtags from main text
  });

  // Clean up extra spaces
  converted = converted.replace(/\s+/g, ' ').trim();

  // Add line breaks for better readability
  // Split long sentences and add breaks
  if (converted.length > 100) {
    converted = converted.replace(/\. /g, '.\n\n');
  }

  // Add hashtags at the end if any were found
  if (hashtags.length > 0) {
    // Group hashtags nicely
    const hashtagString = hashtags.join(' ');
    
    if (converted.length > 0) {
      converted += '\n\n━━━━━━━━━━━━━━━━━━━\n\n' + hashtagString;
    } else {
      converted = hashtagString;
    }
  }

  // Handle URLs - Instagram doesn't make them clickable, so add context
  converted = converted.replace(/(https?:\/\/[^\s]+)/g, (url) => {
    return `🔗 ${url}\n(Link in bio for easy access)`;
  });

  // Add Instagram-friendly formatting
  if (converted.length > 0) {
    // Add some visual appeal with emojis for structure
    if (!converted.includes('━━━') && hashtags.length === 0) {
      // If it's a simple post without hashtags, just clean it up
      converted = converted.trim();
    }
  }

  return converted;
}

// Helper function to count characters accurately
export function getCharacterCount(text: string): number {
  return text.length;
}

// Helper function to check if post exceeds platform limits
export function exceedsLimit(text: string, platform: 'twitter' | 'instagram'): boolean {
  const limits = {
    twitter: 280,
    instagram: 2200
  };
  
  return text.length > limits[platform];
}