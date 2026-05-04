"use client"

import { useState, useCallback } from "react"
import { Upload, X, Image, Loader2, CheckCircle } from "lucide-react"
import { cn } from "../../lib/utils"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  endpoint?: "postImage" | "contentImage" | "avatar"
  className?: string
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  endpoint = "postImage",
  className,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const handleUpload = async (file: File) => {
    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      // For now, we'll use a base64 preview since Uploadthing needs API key
      // In production, replace with actual Uploadthing upload
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange(e.target?.result as string)
        setLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError("Upload failed. Please try again.")
      setLoading(false)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith("image/")) {
        handleUpload(file)
      }
    },
    [handleUpload]
  )

  return (
    <div className={className}>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden">
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*"
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) handleUpload(file)
                }
                input.click()
              }}
              className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              Change
            </button>
            {onRemove && (
              <button
                onClick={onRemove}
                className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          )}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div
              onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*"
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) handleUpload(file)
                }
                input.click()
              }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Drop your image here, or <span className="text-blue-600">browse</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 4MB
                </p>
              </div>
            </div>
          )}
          {error && (
            <p className="text-sm text-red-600 mt-3">{error}</p>
          )}
        </div>
      )}
    </div>
  )
}