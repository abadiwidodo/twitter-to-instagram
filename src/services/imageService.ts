// Image service for generating background images from various free APIs

export interface ImageServiceConfig {
  unsplashAccessKey?: string;
  pexelsApiKey?: string;
  preferredService?: 'picsum' | 'unsplash' | 'pexels';
}

export class ImageService {
  private config: ImageServiceConfig;

  constructor(config: ImageServiceConfig = {}) {
    this.config = config;
  }

  // Generate image URL based on text content
  async generateImageUrl(text: string): Promise<string> {
    const keywords = this.extractKeywords(text);
    const query = keywords.slice(0, 2).join(' ') || 'abstract minimal';

    switch (this.config.preferredService) {
      case 'unsplash':
        return this.getUnsplashImage(query);
      case 'pexels':
        return await this.getPexelsImage(query);
      case 'picsum':
      default:
        return this.getPicsumImage(text);
    }
  }

  // Picsum Photos (Lorem Picsum) - Free, no API key required
  private getPicsumImage(text: string): string {
    // Create consistent seed based on text content
    const seed = Math.abs(text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 1000;
    console.log(`Generating Picsum image with seed: ${seed} for text: "${text}"`);
    
    // Try different Picsum endpoints for better reliability
    const endpoints = [
      `https://picsum.photos/1080/1080?random=${seed}`,
      `https://picsum.photos/1080/1080?blur=1&random=${seed}`,
      `https://picsum.photos/id/${seed % 100 + 1}/1080/1080`
    ];
    
    // Return the first endpoint for now, but we could implement fallback logic
    return endpoints[0];
  }

  // Unsplash API - Requires API key
  private getUnsplashImage(query: string): string {
    if (!this.config.unsplashAccessKey) {
      console.warn('Unsplash API key not provided, falling back to Picsum');
      return this.getPicsumImage(query);
    }

    return `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&w=1080&h=1080&client_id=${this.config.unsplashAccessKey}`;
  }

  // Pexels API - Requires API key and fetch call
  private async getPexelsImage(query: string): Promise<string> {
    if (!this.config.pexelsApiKey) {
      console.warn('Pexels API key not provided, falling back to Picsum');
      return this.getPicsumImage(query);
    }

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`,
        {
          headers: {
            'Authorization': this.config.pexelsApiKey
          }
        }
      );

      const data = await response.json();
      
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.large; // or .medium, .small depending on needs
      }
    } catch (error) {
      console.error('Error fetching Pexels image:', error);
    }

    // Fallback to Picsum
    return this.getPicsumImage(query);
  }

  // Extract meaningful keywords from text
  private extractKeywords(text: string): string[] {
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
}

// Default instance for easy use
export const imageService = new ImageService({
  preferredService: 'picsum' // Free option that doesn't require API key
});

// Example usage with different configurations:
/*

// Basic usage (uses Picsum)
const imageUrl = await imageService.generateImageUrl("Beautiful sunset over mountains");

// With Unsplash API key
const unsplashService = new ImageService({
  unsplashAccessKey: 'your-unsplash-access-key',
  preferredService: 'unsplash'
});
const unsplashUrl = await unsplashService.generateImageUrl("Ocean waves");

// With Pexels API key
const pexelsService = new ImageService({
  pexelsApiKey: 'your-pexels-api-key',
  preferredService: 'pexels'
});
const pexelsUrl = await pexelsService.generateImageUrl("City skyline");

*/
