# Background Image Generation Guide

This guide explains how to use the background image generation feature in your Twitter to Instagram converter.

## 🖼️ How It Works

The application can generate random background images based on the content of your Twitter post using free image APIs.

### Available Image Sources:

1. **Picsum Photos (Default)** - Free, no API key required
2. **Unsplash API** - High quality, requires free API key
3. **Pexels API** - High quality, requires free API key

## 🚀 Quick Start

1. **Enter Twitter Content**: Paste or type your Twitter post content
2. **Open Style Customizer**: Scroll down to the styling section
3. **Find "Background Images"**: Look for the section with the image icon
4. **Click "Generate Random Image"**: The app will create a relevant background
5. **Customize**: Use other styling options to perfect your post

## 🎨 How Images Are Selected

The system analyzes your text content to generate relevant images:

- **"Beautiful sunset over the ocean"** → Gets ocean/sunset themed images
- **"Excited about my new project!"** → Gets energetic/celebration images  
- **"Coffee and coding session"** → Gets workspace/coffee themed images
- **"Nature walk in the forest"** → Gets nature/forest themed images

## 🔧 Configuration Options

### Using Different Image Services

You can configure the image service in your code:

```typescript
// Basic usage (uses free Picsum service)
const imageUrl = await imageService.generateImageUrl("Your text content");

// With Unsplash API key for better quality
const unsplashService = new ImageService({
  unsplashAccessKey: 'your-unsplash-access-key',
  preferredService: 'unsplash'
});

// With Pexels API key
const pexelsService = new ImageService({
  pexelsApiKey: 'your-pexels-api-key', 
  preferredService: 'pexels'
});
```

### Getting API Keys (Optional)

#### Unsplash API Key:
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a free account
3. Create a new application
4. Copy your "Access Key"
5. Add to your `.env.local`: `VITE_UNSPLASH_ACCESS_KEY=your_key_here`

#### Pexels API Key:
1. Go to [Pexels API](https://www.pexels.com/api/)
2. Create a free account
3. Generate an API key
4. Add to your `.env.local`: `VITE_PEXELS_API_KEY=your_key_here`

## ✨ Features

### Smart Text Analysis
- Extracts meaningful keywords from your content
- Filters out common words (the, and, is, etc.)
- Prioritizes longer, more descriptive words
- Removes hashtags, mentions, and URLs for cleaner queries

### Consistent Results
- Same text content generates the same image (when using Picsum)
- Ensures consistency across multiple generations

### Text Readability
- Automatically adds dark overlay over images
- Applies text shadow for better contrast
- Ensures your text remains clearly visible

### Easy Management
- One-click generation
- Simple remove button
- Visual indicator when image is applied

## 🎯 Best Practices

1. **Write Descriptive Content**: More descriptive text = better image matches
2. **Use Keywords**: Include visual keywords like "sunset", "coffee", "nature"
3. **Test Different Options**: Try generating multiple times for variety
4. **Check Readability**: Ensure your text is still clearly visible
5. **Save Your Favorites**: Use the save feature for posts you love

## 🛠️ Technical Details

### Image Specifications
- **Size**: 1080x1080 pixels (Instagram square format)
- **Format**: JPEG/PNG depending on source
- **Quality**: High resolution suitable for Instagram

### Performance
- Images are loaded on-demand
- Cached by the browser for faster subsequent loads
- Lightweight API calls

## 🔍 Troubleshooting

### Common Issues:

**"Please enter some content first"**
- Make sure you have Twitter content in the input field
- The system needs text to generate relevant images

**"Failed to generate background image"**
- Check your internet connection
- Try again after a few seconds
- API services may occasionally be unavailable

**Image doesn't match content**
- Try adding more descriptive keywords to your text
- The system works best with visual descriptors

**Text is hard to read**
- The app automatically adds overlays and shadows
- You can adjust text color in the style customizer
- Try different text colors (white usually works best on images)

## 🚀 Future Enhancements

Planned improvements:
- Multiple image suggestions to choose from
- Custom image upload support
- More advanced text analysis
- Image filtering options (blur, brightness, contrast)
- Integration with more image APIs

---

**Need help?** Check the main README.md or create an issue in the repository!
