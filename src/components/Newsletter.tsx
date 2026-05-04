"use client"

import { useState } from "react"
import { Mail, ArrowRight, CheckCircle, Loader2, X } from "lucide-react"

interface NewsletterProps {
  variant?: "hero" | "sidebar" | "footer"
}

export default function Newsletter({ variant = "hero" }: NewsletterProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [showForm, setShowForm] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage(data.message || "Successfully subscribed!")
        if (data.alreadySubscribed || data.reactivated) {
          setTimeout(() => {
            setStatus("idle")
            setEmail("")
            setName("")
          }, 3000)
        }
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to subscribe")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error. Please try again.")
    }
  }

  if (variant === "hero") {
    return (
      <section className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10 shadow-sm">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="w-10 h-10 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Stay in the Loop
          </h2>
          <p className="text-gray-500 mb-8">
            Get the latest posts delivered straight to your inbox. No spam, ever.
          </p>

          {status === "success" ? (
            <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 rounded-xl p-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="text-red-500 mt-3 text-sm">{message}</p>
          )}
        </div>
      </section>
    )
  }

  if (variant === "sidebar") {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <Mail className="w-8 h-8 mb-3 text-gray-400" />
        <h3 className="text-lg font-bold text-gray-900 mb-1">Newsletter</h3>
        <p className="text-sm text-gray-500 mb-4">
          Get the latest posts delivered to your inbox.
        </p>

        {status === "success" ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white placeholder-gray-400 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
            {status === "error" && (
              <p className="text-red-500 text-xs mt-2">{message}</p>
            )}
          </form>
        )}
      </div>
    )
  }

  // Footer variant
  return (
    <div className="max-w-[220px] mx-auto lg:mx-0">
      {status === "success" ? (
        <div className="flex items-center justify-center lg:justify-start gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Subscribed!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
      )}
    </div>
  )
}