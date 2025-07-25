import React from 'react';
import { Palette, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { InstagramStyle, BackgroundTheme } from '../types';
import { backgroundThemes } from '../utils/backgroundGenerator';

interface StyleCustomizerProps {
  style: InstagramStyle;
  onStyleChange: (style: InstagramStyle) => void;
  suggestedTheme?: BackgroundTheme;
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

export function StyleCustomizer({ style, onStyleChange, suggestedTheme }: StyleCustomizerProps) {
  const updateStyle = (updates: Partial<InstagramStyle>) => {
    onStyleChange({ ...style, ...updates });
  };

  const applyTheme = (theme: BackgroundTheme) => {
    updateStyle({
      backgroundColor: theme.gradient,
      textColor: theme.textColor
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