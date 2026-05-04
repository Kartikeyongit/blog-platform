"use client"

import { useState } from "react"
import { X, Copy, ExternalLink, Download, Trash2 } from "lucide-react"

interface MediaItem {
  id: string
  url: string
  name: string
  createdAt: Date
  size: number
}

export default function MediaGallery() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [copied, setCopied] = useState(false)

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Media Gallery</h2>
        <p className="text-sm text-gray-500">
          {media.length} {media.length === 1 ? "file" : "files"}
        </p>
      </div>

      {media.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No media uploaded yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Upload images in post editor or settings
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className={`relative group bg-white rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                selected?.id === item.id
                  ? "border-blue-500 shadow-md"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => setSelected(item)}
            >
              <div className="aspect-square">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    copyUrl(item.url)}
                  }
                  className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  title={copied ? "Copied!" : "Copy URL"}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-gray-700 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatSize(item.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <img
              src={selected.url}
              alt={selected.name}
              className="w-full max-h-[80vh] object-contain"
            />
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{selected.name}</p>
                <p className="text-sm text-gray-500">{formatSize(selected.size)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyUrl(selected.url)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  {copied ? "Copied!" : "Copy URL"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}