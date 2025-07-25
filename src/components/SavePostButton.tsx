import React, { useState } from 'react'
import { Save, Check, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { PreferencesService } from '../services/preferences'
import { InstagramStyle } from '../types'

interface SavePostButtonProps {
  twitterContent: string
  instagramContent: string
  style: InstagramStyle
  author?: string
  disabled?: boolean
}

export const SavePostButton: React.FC<SavePostButtonProps> = ({
  twitterContent,
  instagramContent,
  style,
  author,
  disabled = false
}) => {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showTitleInput, setShowTitleInput] = useState(false)
  const [title, setTitle] = useState('')

  const handleSave = async () => {
    if (!user || !twitterContent.trim() || !instagramContent.trim()) return

    if (!showTitleInput) {
      setShowTitleInput(true)
      setTitle(`Post from ${new Date().toLocaleDateString()}`)
      return
    }

    setSaving(true)
    try {
      const result = await PreferencesService.savePost({
        user_id: user.id,
        title: title.trim() || `Post from ${new Date().toLocaleDateString()}`,
        twitter_content: twitterContent,
        instagram_content: instagramContent,
        style,
        author
      })

      if (result) {
        setSaved(true)
        setShowTitleInput(false)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setSaving(false)
    }
  }

  const cancelSave = () => {
    setShowTitleInput(false)
    setTitle('')
  }

  if (!user) {
    return null
  }

  if (showTitleInput) {
    return (
      <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for this post..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') cancelSave()
          }}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={cancelSave}
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSave}
      disabled={disabled || saving || !twitterContent.trim() || !instagramContent.trim()}
      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
    >
      {saved ? (
        <>
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Saved!</span>
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          <span className="text-sm font-medium">
            {saving ? 'Saving...' : 'Save Post'}
          </span>
        </>
      )}
    </button>
  )
}
