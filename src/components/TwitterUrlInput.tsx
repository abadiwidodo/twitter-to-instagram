import React, { useState } from 'react';
import { Link, Loader2 } from 'lucide-react';

interface TwitterUrlInputProps {
  onTweetFetched: (text: string, author: string) => void;
  loading: boolean;
}

export function TwitterUrlInput({ onTweetFetched, loading }: TwitterUrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a Twitter URL');
      return;
    }

    // Validate Twitter URL format
    const twitterUrlPattern = /(twitter\.com|x\.com)\/\w+\/status\/\d+/;
    if (!twitterUrlPattern.test(url)) {
      setError('Please enter a valid Twitter post URL');
      return;
    }

    try {
      // Import here to avoid circular dependencies
      const { extractTweetId, fetchTweetData } = await import('../utils/twitterApi');
      
      const tweetId = extractTweetId(url);
      if (!tweetId) {
        setError('Could not extract tweet ID from URL');
        return;
      }

      const tweetData = await fetchTweetData(tweetId);
      onTweetFetched(tweetData.text, tweetData.author.name);
      setUrl('');
    } catch (err) {
      setError('Failed to fetch tweet. Please try again.');
      console.error('Error fetching tweet:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Link className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">Fetch from Twitter URL</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://twitter.com/username/status/1234567890"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fetching tweet...</span>
            </>
          ) : (
            <span>Fetch Tweet</span>
          )}
        </button>
      </form>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Demo URLs to try:</strong>
        </p>
        <div className="mt-2 space-y-1">
          <button
            type="button"
            onClick={() => setUrl('https://twitter.com/johndev/status/1234567890')}
            className="block text-sm text-blue-600 hover:text-blue-800 underline"
          >
            https://twitter.com/johndev/status/1234567890
          </button>
          <button
            type="button"
            onClick={() => setUrl('https://twitter.com/sarahphotos/status/9876543210')}
            className="block text-sm text-blue-600 hover:text-blue-800 underline"
          >
            https://twitter.com/sarahphotos/status/9876543210
          </button>
        </div>
      </div>
    </div>
  );
}