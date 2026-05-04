"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { 
  Image as ImageIcon, 
  Upload,
  Eye,
  Edit3,
  Save,
  Check,
} from "lucide-react"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"
import ImageUpload from "../../../../components/ui/ImageUpload"
import TagInput from "../../../../components/ui/TagInput"

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
)

// Auto-save key for localStorage
const AUTOSAVE_KEY = "blog_draft_autosave"

export default function CreatePostPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImage: "",
    categoryId: "",
    tags: [] as string[],
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    featured: false,
  })
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editorMode, setEditorMode] = useState<"edit" | "live" | "preview">("live")

  // Load saved draft on mount
  useEffect(() => {
    fetchCategories()
    loadDraft()
  }, [])

  // Auto-save whenever formData changes
  useEffect(() => {
    // Only auto-save if there's any content
    if (formData.title || formData.content || formData.excerpt) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current)
      }
      
      autoSaveTimer.current = setTimeout(() => {
        saveDraft()
      }, 2000) // Save 2 seconds after user stops typing
    }

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current)
      }
    }
  }, [formData])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formData.title || formData.content) {
        saveDraft() // Save one last time before leaving
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [formData])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error("Failed to fetch categories")
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY)
      if (saved) {
        const draft = JSON.parse(saved)
        if (draft.title || draft.content) {
          setFormData(prev => ({
            ...prev,
            ...draft,
          }))
          setLastSaved(draft.savedAt || null)
        }
      }
    } catch (error) {
      console.error("Failed to load draft:", error)
    }
  }

  const saveDraft = useCallback(() => {
    try {
      setSaveStatus("saving")
      const draft = {
        ...formData,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draft))
      setLastSaved(new Date().toLocaleTimeString())
      setSaveStatus("saved")
      
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Failed to save draft:", error)
      setSaveStatus("idle")
    }
  }, [formData])

  const clearDraft = () => {
    localStorage.removeItem(AUTOSAVE_KEY)
    setLastSaved(null)
  }

  // Handle content image upload
  const handleContentImageUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB")
      setTimeout(() => setError(""), 3000)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = document.createElement("img")
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        let { width, height } = img
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 800

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width
          width = MAX_WIDTH
        }
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height
          height = MAX_HEIGHT
        }

        canvas.width = width
        canvas.height = height
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          const compressedUrl = canvas.toDataURL("image/jpeg", 0.7)
          const imageMarkdown = `\n![Image](${compressedUrl})\n`
          setFormData(prev => ({
            ...prev,
            content: prev.content ? prev.content + imageMarkdown : imageMarkdown
          }))
        }
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create post")
        setLoading(false)
        return
      }

      // Clear draft on successful publish
      clearDraft()
      setSuccess("Post created successfully!")
      setLoading(false)
      
      setTimeout(() => {
        router.push("/dashboard/posts")
      }, 1500)
    } catch (error) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
            <p className="text-gray-600 mt-2">Write and publish your blog post</p>
          </div>
          
          {/* Auto-save indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent" />
                Saving...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1 text-green-600">
                <Check className="w-3.5 h-3.5" />
                Saved
              </span>
            )}
            {lastSaved && saveStatus === "idle" && (
              <span className="flex items-center gap-1 text-gray-400">
                <Save className="w-3.5 h-3.5" />
                Last saved {lastSaved}
              </span>
            )}
            {formData.title && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                Draft
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Cover Image
          </h2>
          <ImageUpload
            value={formData.coverImage}
            onChange={(url) => setFormData({ ...formData, coverImage: url })}
            onRemove={() => setFormData({ ...formData, coverImage: "" })}
            endpoint="postImage"
          />
        </div>

        {/* Post Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-lg font-medium"
              placeholder="Enter post title..."
              required
            />
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none"
              placeholder="Brief description of the post..."
              rows={3}
            />
          </div>

          {/* Content Editor */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Content
              </label>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setEditorMode("edit")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      editorMode === "edit" ? "bg-white shadow text-gray-900" : "text-gray-500"
                    }`}
                  >
                    <Edit3 className="w-3 h-3 inline mr-1" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("live")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      editorMode === "live" ? "bg-white shadow text-gray-900" : "text-gray-500"
                    }`}
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    Live
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("preview")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      editorMode === "preview" ? "bg-white shadow text-gray-900" : "text-gray-500"
                    }`}
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    Preview
                  </button>
                </div>

                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm cursor-pointer transition-colors border border-blue-200">
                  <Upload className="w-4 h-4" />
                  Upload Image
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleContentImageUpload(file)
                    }}
                  />
                </label>
              </div>
            </div>

            <div data-color-mode="light" className="border border-gray-300 rounded-lg overflow-hidden">
              <MDEditor
                value={formData.content}
                onChange={(val) => setFormData({ ...formData, content: val || "" })}
                preview={editorMode}
                height={500}
                visibleDragbar={false}
                hideToolbar={false}
                enableScroll={true}
                previewOptions={{
                  style: {
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.8",
                    padding: "20px",
                  },
                }}
                textareaProps={{
                  placeholder: "Start writing your amazing content here...",
                  style: {
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.8",
                  },
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Markdown supported · Auto-save enabled</span>
              <span>{formData.content.length} characters</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Tags & Technologies</h2>
          <TagInput
            value={formData.tags}
            onChange={(tags) => setFormData({ ...formData, tags })}
            placeholder="Add technologies or tags..."
          />
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to add a tag. Examples: React, TypeScript, Python
          </p>
        </div>

        {/* Publishing Options */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Publishing Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "DRAFT" | "PUBLISHED" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Publish</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Post</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              clearDraft()
              router.push("/dashboard/posts")
            }}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Discard Draft
          </button>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/posts")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Creating...
                </>
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}