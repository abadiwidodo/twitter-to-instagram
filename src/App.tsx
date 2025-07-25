import React, { useState, useCallback } from 'react';
import { Twitter, Instagram, Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
import { convertTwitterToInstagram } from './utils/converter';
import { TwitterUrlInput } from './components/TwitterUrlInput';
import { StyleCustomizer } from './components/StyleCustomizer';
import { InstagramPreview } from './components/InstagramPreview';
import { InstagramStyle, BackgroundTheme } from './types';
import { suggestBackgroundTheme } from './utils/backgroundGenerator';

function App() {
  const [twitterPost, setTwitterPost] = useState('');
  const [instagramPost, setInstagramPost] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState('');
  const [suggestedTheme, setSuggestedTheme] = useState<BackgroundTheme | undefined>();
  const [instagramStyle, setInstagramStyle] = useState<InstagramStyle>({
    fontFamily: 'Inter, sans-serif',
    fontSize: '20px',
    textColor: '#ffffff',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textAlign: 'center',
    padding: '60px'
  });

  const handleTwitterInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTwitterPost(value);
    const converted = convertTwitterToInstagram(value);
    setInstagramPost(converted);
    
    // Suggest background theme based on content
    if (value.trim()) {
      const theme = suggestBackgroundTheme(value);
      setSuggestedTheme(theme);
    } else {
      setSuggestedTheme(undefined);
    }
  }, []);

  const handleTweetFetched = useCallback((text: string, authorName: string) => {
    setTwitterPost(text);
    setAuthor(authorName);
    const converted = convertTwitterToInstagram(text);
    setInstagramPost(converted);
    
    // Suggest background theme based on fetched content
    const theme = suggestBackgroundTheme(text);
    setSuggestedTheme(theme);
    setLoading(false);
  }, []);
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(instagramPost);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [instagramPost]);

  const twitterCharCount = twitterPost.length;
  const instagramCharCount = instagramPost.length;
  const twitterLimit = 280;
  const instagramLimit = 2200;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center space-x-2">
              <Twitter className="w-6 h-6 text-blue-500" />
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <Instagram className="w-6 h-6 text-pink-500" />
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Styled Post Converter
            </h1>
          </div>
          <p className="text-center text-gray-600 mt-2 text-sm">
            Transform Twitter posts into beautifully styled Instagram content
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Twitter URL Input */}
        <TwitterUrlInput 
          onTweetFetched={handleTweetFetched}
          loading={loading}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Twitter Input Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Twitter className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Twitter Post</h2>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <textarea
                  value={twitterPost}
                  onChange={handleTwitterInputChange}
                  placeholder="Paste your Twitter post here..."
                  className="w-full h-40 resize-none border-0 focus:ring-0 text-gray-900 placeholder-gray-500 text-base leading-relaxed"
                  style={{ outline: 'none' }}
                />
              </div>
              
              <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Character count</span>
                  <span className={`text-sm font-medium ${
                    twitterCharCount > twitterLimit ? 'text-red-500' : 'text-gray-700'
                  }`}>
                    {twitterCharCount}/{twitterLimit}
                  </span>
                </div>
                {twitterCharCount > twitterLimit && (
                  <p className="text-xs text-red-500 mt-1">
                    This post exceeds Twitter's character limit
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Instagram Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                <h2 className="text-xl font-semibold text-gray-900">Instagram Post</h2>
              </div>
              
              {instagramPost && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm font-medium">Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                {instagramPost ? (
                  <div className="h-40 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-gray-900 text-base leading-relaxed font-sans">
                      {instagramPost}
                    </pre>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-400">
                    <p className="text-center">
                      Your converted Instagram post will appear here
                    </p>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Character count</span>
                  <span className={`text-sm font-medium ${
                    instagramCharCount > instagramLimit ? 'text-red-500' : 'text-gray-700'
                  }`}>
                    {instagramCharCount}/{instagramLimit}
                  </span>
                </div>
                {instagramCharCount > instagramLimit && (
                  <p className="text-xs text-red-500 mt-1">
                    This post exceeds Instagram's character limit
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Style Customizer and Preview */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <StyleCustomizer 
            style={instagramStyle}
            onStyleChange={setInstagramStyle}
            suggestedTheme={suggestedTheme}
          />
          <InstagramPreview 
            content={instagramPost}
            style={instagramStyle}
            author={author}
          />
        </div>
        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Advanced Features
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                URL Fetching
              </h4>
              <p className="text-gray-600">
                Fetch tweets directly from Twitter URLs and convert them automatically with smart content analysis.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Twitter className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Styling
              </h4>
              <p className="text-gray-600">
                AI-powered theme suggestions based on your content with beautiful gradients and typography options.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Instagram className="w-6 h-6 text-pink-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Visual Posts
              </h4>
              <p className="text-gray-600">
                Generate stunning 1080x1080 images with custom fonts, colors, and backgrounds perfect for Instagram.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Copy className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Export Options
              </h4>
              <p className="text-gray-600">
                Copy formatted text or download high-quality images ready for posting on Instagram.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Made with ❤️ for social media creators • Enhanced with AI-powered styling
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;