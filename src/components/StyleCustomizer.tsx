import { useState } from 'react';
import { Palette, Type, AlignLeft, AlignCenter, AlignRight, Image, RefreshCw } from 'lucide-react';
import { InstagramStyle, BackgroundTheme } from '../types';
import { backgroundThemes } from '../utils/backgroundGenerator';
import { imageService } from '../services/imageService';

interface StyleCustomizerProps {
  style: InstagramStyle;
  onStyleChange: (style: InstagramStyle) => void;
  suggestedTheme?: BackgroundTheme;
  twitterContent?: string; // Add this for image generation
}

const fontOptions = [
  { name: 'Inter', value: 'Inter, sans-serif', preview: 'Modern & Clean' },
  { name: 'Playfair', value: 'Playfair Display, serif', preview: 'Elegant & Classic' },
  { name: 'Poppins', value: 'Poppins, sans-serif', preview: 'Friendly & Round' },
  { name: 'Roboto', value: 'Roboto, sans-serif', preview: 'Professional' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif', preview: 'Bold & Strong' },
  { name: 'Dancing Script', value: 'Dancing Script, cursive', preview: 'Handwritten Style' }
];

const fontSizes = [
  { name: 'Small', value: '16px' },
  { name: 'Medium', value: '20px' },
  { name: 'Large', value: '24px' },
  { name: 'Extra Large', value: '28px' }
];

export function StyleCustomizer({ style, onStyleChange, suggestedTheme, twitterContent = '' }: StyleCustomizerProps) {
  const [generatingImage, setGeneratingImage] = useState(false);
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState<string>('');
  
  const updateStyle = (updates: Partial<InstagramStyle>) => {
    onStyleChange({ ...style, ...updates });
  };

  const applyTheme = (theme: BackgroundTheme) => {
    updateStyle({
      backgroundColor: theme.gradient,
      textColor: theme.textColor,
      backgroundImage: undefined // Clear any background image when applying theme
    });
  };

  const generateRandomImage = async () => {
    if (!twitterContent.trim()) {
      alert('Please enter some content first to generate a relevant background image');
      return;
    }

    setGeneratingImage(true);
    try {
      const imageUrl = await imageService.generateImageUrl(twitterContent);
      console.log('Generated imageUrl:', imageUrl);
      setLastGeneratedUrl(imageUrl);
      
      // Simple direct application - let the browser handle loading
      updateStyle({
        backgroundImage: imageUrl, // Store just the URL
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for text readability
        textColor: '#ffffff' // Ensure text is visible over image
      });
      
      console.log('Applied background image:', imageUrl);
      setGeneratingImage(false);
      
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate background image. Please try again.');
      setGeneratingImage(false);
    }
  };

  const removeBackgroundImage = () => {
    updateStyle({
      backgroundImage: undefined,
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Default gradient
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Palette className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">Style Customizer</h3>
      </div>

      {/* Suggested Theme */}
      {suggestedTheme && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-purple-900">Suggested Theme</h4>
            <button
              onClick={() => applyTheme(suggestedTheme)}
              className="px-3 py-1 bg-purple-500 text-white text-sm rounded-md hover:bg-purple-600 transition-colors"
            >
              Apply
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full"
              style={{ background: suggestedTheme.gradient }}
            />
            <div>
              <p className="font-medium text-sm text-purple-900">{suggestedTheme.name}</p>
              <p className="text-xs text-purple-700">{suggestedTheme.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Background Themes */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Background Themes</h4>
        <div className="grid grid-cols-2 gap-2">
          {backgroundThemes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => applyTheme(theme)}
              className="p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors text-left"
            >
              <div className="flex items-center space-x-2 mb-1">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ background: theme.gradient }}
                />
                <span className="text-sm font-medium text-gray-900">{theme.name}</span>
              </div>
              <p className="text-xs text-gray-600">{theme.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Random Background Images */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Image className="w-4 h-4 mr-2" />
          Background Images
        </h4>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <button
              onClick={generateRandomImage}
              disabled={generatingImage || !twitterContent.trim()}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 ${generatingImage ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">
                {generatingImage ? 'Generating...' : 'Generate Random Image'}
              </span>
            </button>
            
            {style.backgroundImage && (
              <button
                onClick={removeBackgroundImage}
                className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <span className="text-sm font-medium">Remove</span>
              </button>
            )}
          </div>
          
          {style.backgroundImage && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Image className="w-4 h-4" />
                <span>Background image applied</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Text overlay with dark background for better readability
              </p>
              {lastGeneratedUrl && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400">Image URL:</p>
                  <a 
                    href={lastGeneratedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:text-blue-700 break-all"
                  >
                    {lastGeneratedUrl}
                  </a>
                </div>
              )}
            </div>
          )}
          
          {!twitterContent.trim() && (
            <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded p-2">
              💡 Enter some Twitter content first to generate a relevant background image
            </p>
          )}
          
          {/* Debug Information */}
          {import.meta.env.DEV && lastGeneratedUrl && (
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <p className="font-medium text-blue-800">Debug Info:</p>
              <p className="text-blue-600">Generated URL: {lastGeneratedUrl}</p>
              <p className="text-blue-600">Current backgroundImage: {style.backgroundImage || 'none'}</p>
              <button 
                onClick={() => window.open(lastGeneratedUrl, '_blank')}
                className="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                Test URL in New Tab
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Font Family */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Type className="w-4 h-4 mr-2" />
          Font Family
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {fontOptions.map((font) => (
            <button
              key={font.value}
              onClick={() => updateStyle({ fontFamily: font.value })}
              className={`p-3 rounded-lg border text-left transition-colors ${
                style.fontFamily === font.value
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span 
                  className="font-medium text-gray-900"
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </span>
                <span className="text-xs text-gray-500">{font.preview}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Font Size</h4>
        <div className="grid grid-cols-2 gap-2">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => updateStyle({ fontSize: size.value })}
              className={`p-2 rounded-lg border text-center transition-colors ${
                style.fontSize === size.value
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-sm font-medium text-gray-900">{size.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Text Alignment</h4>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Left', value: 'left' as const, icon: AlignLeft },
            { name: 'Center', value: 'center' as const, icon: AlignCenter },
            { name: 'Right', value: 'right' as const, icon: AlignRight }
          ].map(({ name, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => updateStyle({ textAlign: value })}
              className={`p-3 rounded-lg border transition-colors flex flex-col items-center space-y-1 ${
                style.textAlign === value
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text Color */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Text Color</h4>
        <div className="grid grid-cols-4 gap-2">
          {[
            '#000000', '#ffffff', '#374151', '#6b7280',
            '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
            '#8b5cf6', '#ec4899', '#f97316', '#84cc16'
          ].map((color) => (
            <button
              key={color}
              onClick={() => updateStyle({ textColor: color })}
              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                style.textColor === color
                  ? 'border-purple-400 scale-110'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}