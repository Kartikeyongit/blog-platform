"use client"

import { useState, useEffect, useRef } from "react"
import { X, Plus, Loader2 } from "lucide-react"

interface Tag {
  id: string
  name: string
  slug: string
}

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export default function TagInput({ value, onChange, placeholder = "Add tags..." }: TagInputProps) {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch all existing tags
  useEffect(() => {
    fetch("/api/tags")
      .then(res => res.json())
      .then(data => setAllTags(data))
      .catch(() => {})
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter suggestions
  useEffect(() => {
    if (input.trim()) {
      const filtered = allTags.filter(
        tag => tag.name.toLowerCase().includes(input.toLowerCase()) &&
        !selectedTags.find(t => t.id === tag.id)
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setSuggestions(allTags.filter(tag => !selectedTags.find(t => t.id === tag.id)).slice(0, 5))
      setShowSuggestions(false)
    }
  }, [input, allTags, selectedTags])

  const addTag = async (tag: Tag) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      const newTags = [...selectedTags, tag]
      setSelectedTags(newTags)
      onChange(newTags.map(t => t.id))
    }
    setInput("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const createAndAddTag = async () => {
    const name = input.trim()
    if (!name) return

    setLoading(true)
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (res.ok) {
        const newTag = await res.json()
        setAllTags(prev => [...prev, newTag])
        addTag(newTag)
      }
    } catch (error) {
      console.error("Failed to create tag:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeTag = (tagId: string) => {
    const newTags = selectedTags.filter(t => t.id !== tagId)
    setSelectedTags(newTags)
    onChange(newTags.map(t => t.id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (input.trim()) {
        const existingTag = suggestions.find(
          t => t.name.toLowerCase() === input.toLowerCase()
        )
        if (existingTag) {
          addTag(existingTag)
        } else {
          createAndAddTag()
        }
      }
    } else if (e.key === "Backspace" && !input && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap items-center gap-2 p-3 border border-gray-300 rounded-lg bg-white min-h-[48px] cursor-text focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Selected Tags */}
        {selectedTags.map(tag => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
          >
            {tag.name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(tag.id)
              }}
              className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => input && setShowSuggestions(true)}
          placeholder={selectedTags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none border-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || input.trim()) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 max-h-48 overflow-y-auto">
          {suggestions.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5 text-gray-400" />
              {tag.name}
            </button>
          ))}
          
          {/* Create new tag option */}
          {input.trim() && !suggestions.find(t => t.name.toLowerCase() === input.toLowerCase()) && (
            <button
              type="button"
              onClick={createAndAddTag}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2 border-t border-gray-100"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              Create "{input.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}