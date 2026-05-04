"use client"

import { useState, useEffect } from "react"
import { Save, Eye, CheckCircle, AlertCircle } from "lucide-react"

interface SEOSettingsProps {
  postId?: string
  initialData?: {
    title?: string | null
    description?: string | null
    keywords?: string | null
    ogImage?: string | null
  }
  onSave?: (data: any) => void
}

export default function SEOSettings({ postId, initialData, onSave }: SEOSettingsProps) {
  const [seo, setSeo] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    keywords: initialData?.keywords || "",
    ogImage: initialData?.ogImage || "",
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [preview, setPreview] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      // This would connect to an SEO API endpoint
      // For now, we'll just simulate
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setMessage({ type: "success", text: "SEO settings saved!" })
      if (onSave) onSave(seo)
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save SEO settings" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">SEO Settings</h3>
        {message.text && (
          <div className={`flex items-center gap-2 text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}>
            {message.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {message.text}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Title
          </label>
          <input
            type="text"
            value={seo.title}
            onChange={(e) => setSeo({ ...seo, title: e.target.value })}
            placeholder="Custom SEO title (leave empty to use post title)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended: 50-60 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={seo.description}
            onChange={(e) => setSeo({ ...seo, description: e.target.value })}
            placeholder="Meta description for search engines"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended: 150-160 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keywords
          </label>
          <input
            type="text"
            value={seo.keywords}
            onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
            placeholder="keyword1, keyword2, keyword3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Open Graph Image URL
          </label>
          <input
            type="url"
            value={seo.ogImage}
            onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended size: 1200x630px
          </p>
        </div>

        {/* SEO Preview */}
        <div>
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <Eye className="w-4 h-4" />
            {preview ? "Hide" : "Show"} Search Preview
          </button>
          
          {preview && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-500 mb-2">Google Search Preview</p>
              <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                {seo.title || "Your Page Title"}
              </p>
              <p className="text-green-700 text-sm">
                {process.env.NEXTAUTH_URL || "https://yourblog.com"}/your-post
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {seo.description || "Your meta description will appear here. This is how your page will look in search results."}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save SEO Settings"}
          </button>
        </div>
      </div>
    </div>
  )
}