import React, { useState, useEffect } from 'react'
import { Bookmark, Trash2, Copy, Check, Calendar } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { PreferencesService } from '../services/preferences'
import { SavedPost } from '../types'

interface SavedPostsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SavedPostsModal: React.FC<SavedPostsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const [posts, setPosts] = useState<SavedPost[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && user) {
      loadPosts()
    }
  }, [isOpen, user])

  const loadPosts = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const savedPosts = await PreferencesService.getSavedPosts(user.id)
      setPosts(savedPosts)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!user || !postId) return

    if (!confirm('Are you sure you want to delete this saved post?')) return

    try {
      const success = await PreferencesService.deletePost(postId, user.id)
      if (success) {
        setPosts(posts.filter(post => post.id !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleCopy = async (content: string, postId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(postId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bookmark className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Saved Posts</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-purple-100 mt-2">
            {posts.length} saved post{posts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading your saved posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved posts yet</h3>
              <p className="text-gray-600">Start creating and saving your styled posts to see them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Unknown date'}
                        </span>
                        {post.author && (
                          <>
                            <span className="mx-2">•</span>
                            <span>by {post.author}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(post.id!)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Twitter Content */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Original Twitter</h4>
                      <div className="bg-white rounded p-3 border text-sm text-gray-600 max-h-32 overflow-y-auto">
                        {post.twitter_content}
                      </div>
                    </div>

                    {/* Instagram Content */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Instagram Version</h4>
                        <button
                          onClick={() => handleCopy(post.instagram_content, post.id!)}
                          className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          {copiedId === post.id ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-white rounded p-3 border text-sm text-gray-600 max-h-32 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans">
                          {post.instagram_content}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
