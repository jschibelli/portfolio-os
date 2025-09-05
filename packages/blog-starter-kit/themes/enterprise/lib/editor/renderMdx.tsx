// /lib/editor/renderMdx.tsx
// MDX rendering utility for the preview pane
// Uses next-mdx-remote to render MDX content with custom components

import React from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { mdxComponents } from './mdxComponents'

interface RenderMdxProps {
  mdxContent: string
  className?: string
}

export function RenderMdx({ mdxContent, className = '' }: RenderMdxProps) {
  // For now, we'll render the MDX as plain text with basic formatting
  // In a full implementation, you'd use next-mdx-remote or @mdx-js/react
  
  if (!mdxContent.trim()) {
    return (
      <div className={`prose prose-stone max-w-none ${className}`}>
        <p className="text-stone-500 italic">Start writing to see a preview...</p>
      </div>
    )
  }

  // Simple MDX-like rendering for preview
  // In production, you'd use proper MDX parsing
  const lines = mdxContent.split('\n')
  const renderedLines = lines.map((line, index) => {
    // Handle headings
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-lg font-semibold mt-6 mb-3">{line.slice(4)}</h3>
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-xl font-semibold mt-6 mb-3">{line.slice(3)}</h2>
    }
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>
    }
    
    // Handle code blocks
    if (line.startsWith('```')) {
      return <div key={index} className="bg-stone-100 p-4 rounded-lg font-mono text-sm my-4">Code block</div>
    }
    
    // Handle blockquotes
    if (line.startsWith('> ')) {
      return <blockquote key={index} className="border-l-4 border-stone-300 pl-4 italic my-4">{line.slice(2)}</blockquote>
    }
    
    // Handle lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return <li key={index} className="ml-4">{line.slice(2)}</li>
    }
    
    // Handle images
    if (line.startsWith('![')) {
      const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
      if (match) {
        const [, alt, src] = match
        return <img key={index} src={src} alt={alt} className="max-w-full h-auto rounded-lg my-4" />
      }
    }
    
    // Handle links
    if (line.includes('[') && line.includes('](')) {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
      let processedLine = line
      let match
      while ((match = linkRegex.exec(line)) !== null) {
        const [fullMatch, text, url] = match
        processedLine = processedLine.replace(fullMatch, `<a href="${url}" class="text-blue-600 hover:underline">${text}</a>`)
      }
      return <p key={index} className="my-2" dangerouslySetInnerHTML={{ __html: processedLine }} />
    }
    
    // Handle bold and italic
    let processedLine = line
    processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>')
    processedLine = processedLine.replace(/`(.*?)`/g, '<code class="bg-stone-100 px-1 py-0.5 rounded text-sm">$1</code>')
    
    // Regular paragraphs
    if (line.trim()) {
      return <p key={index} className="my-2" dangerouslySetInnerHTML={{ __html: processedLine }} />
    }
    
    return null
  }).filter(Boolean)

  return (
    <div className={`prose prose-stone max-w-none ${className}`}>
      {renderedLines}
    </div>
  )
}

// Alternative implementation using proper MDX (commented out for now)
/*
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

export async function serializeMdx(mdxContent: string): Promise<MDXRemoteSerializeResult> {
  return await serialize(mdxContent, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  })
}

export function RenderMdx({ mdxContent, className = '' }: RenderMdxProps) {
  const [serializedContent, setSerializedContent] = useState<MDXRemoteSerializeResult | null>(null)
  
  useEffect(() => {
    serializeMdx(mdxContent).then(setSerializedContent)
  }, [mdxContent])
  
  if (!serializedContent) {
    return <div className={className}>Loading preview...</div>
  }
  
  return (
    <div className={`prose prose-stone max-w-none ${className}`}>
      <MDXRemote {...serializedContent} components={mdxComponents} />
    </div>
  )
}
*/


