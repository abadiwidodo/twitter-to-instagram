import React, { useRef } from 'react';
import { Download, Instagram } from 'lucide-react';
import { InstagramStyle } from '../types';
import html2canvas from 'html2canvas';

interface InstagramPreviewProps {
  content: string;
  style: InstagramStyle;
  author?: string;
}

export function InstagramPreview({ content, style, author }: InstagramPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        width: 1080,
        height: 1080,
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `instagram-post-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  if (!content.trim()) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Instagram className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-semibold text-gray-900">Instagram Preview</h3>
          </div>
        </div>
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-center">
            Your styled Instagram post will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Instagram className="w-5 h-5 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-900">Instagram Preview</h3>
        </div>
        <button
          onClick={downloadImage}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Download</span>
        </button>
      </div>

      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <div
          ref={previewRef}
          className="w-full h-full flex flex-col justify-center relative"
          style={{
            backgroundColor: style.backgroundColor,
            backgroundImage: style.backgroundImage ? `url(${style.backgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: style.padding
          }}
        >
          {/* Overlay for better text readability */}
          {style.backgroundImage && (
            <div className="absolute inset-0 bg-black bg-opacity-20" />
          )}
          
          <div className="relative z-10 h-full flex flex-col justify-center">
            <div
              className="whitespace-pre-wrap leading-relaxed"
              style={{
                fontFamily: style.fontFamily,
                fontSize: style.fontSize,
                color: style.textColor,
                textAlign: style.textAlign,
                textShadow: style.backgroundImage ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
              }}
            >
              {content}
            </div>
            
            {author && (
              <div 
                className="mt-6 pt-4 border-t border-white border-opacity-30"
                style={{ 
                  color: style.textColor,
                  textAlign: style.textAlign,
                  fontFamily: style.fontFamily
                }}
              >
                <p className="text-sm opacity-80">— {author}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-pink-50 rounded-lg">
        <p className="text-sm text-pink-700">
          <strong>Tip:</strong> Click "Download" to save this as a 1080x1080 image perfect for Instagram posts!
        </p>
      </div>
    </div>
  );
}