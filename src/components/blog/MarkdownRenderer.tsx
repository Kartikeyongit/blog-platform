"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Headers with clear styling
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-lg font-semibold text-gray-900 mt-5 mb-2" {...props}>
              {children}
            </h4>
          ),
          
          // Paragraphs
          p: ({ children, ...props }) => (
            <p className="text-gray-700 leading-relaxed mb-4" {...props}>
              {children}
            </p>
          ),

          // Images
          img: ({ src, alt, ...props }) => (
            <img
              src={src || ""}
              alt={alt || ""}
              className="rounded-xl shadow-md my-6 w-full max-w-full"
              loading="lazy"
              {...props}
            />
          ),

          // Links
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2"
              {...props}
            >
              {children}
            </a>
          ),

          // Code blocks
          pre: ({ children, ...props }) => (
            <pre className="bg-gray-100 text-gray-800 p-4 rounded-xl overflow-x-auto my-4 text-sm border border-gray-200" {...props}>
              {children}
            </pre>
          ),

          // Inline code
          code: ({ children, className, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-medium" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },

          // Blockquote
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-blue-500 bg-blue-50 py-3 px-4 rounded-r-lg my-4 text-gray-700 italic" {...props}>
              {children}
            </blockquote>
          ),

          // Lists
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-6 my-4 space-y-1 text-gray-700" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-6 my-4 space-y-1 text-gray-700" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="pl-1" {...props}>
              {children}
            </li>
          ),

          // Horizontal rule
          hr: ({ ...props }) => (
            <hr className="my-8 border-gray-200" {...props} />
          ),

          // Table
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-gray-300" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="bg-gray-100 px-4 py-2 border border-gray-300 font-semibold text-left text-gray-900" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-2 border border-gray-300 text-gray-700" {...props}>
              {children}
            </td>
          ),

          // Strong/Bold
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-gray-900" {...props}>
              {children}
            </strong>
          ),

          // Emphasis/Italic
          em: ({ children, ...props }) => (
            <em className="italic text-gray-700" {...props}>
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}