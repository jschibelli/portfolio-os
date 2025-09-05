// /lib/editor/pmToMdx.ts
// Convert ProseMirror JSON to MDX string
// This handles the serialization of editor content to MDX format

import { JSONContent } from '@tiptap/core'

export function pmToMdx(doc: JSONContent): string {
  if (!doc.content) return ''

  return doc.content.map(node => serializeNode(node)).join('\n\n')
}

function serializeNode(node: JSONContent): string {
  switch (node.type) {
    case 'paragraph':
      return serializeParagraph(node)
    case 'heading':
      return serializeHeading(node)
    case 'bulletList':
      return serializeBulletList(node)
    case 'orderedList':
      return serializeOrderedList(node)
    case 'taskList':
      return serializeTaskList(node)
    case 'blockquote':
      return serializeBlockquote(node)
    case 'codeBlock':
      return serializeCodeBlock(node)
    case 'image':
      return serializeImage(node)
    case 'callout':
      return serializeCallout(node)
    case 'embed':
      return serializeEmbed(node)
    case 'component':
      return serializeComponent(node)
    case 'table':
      return serializeTable(node)
    case 'horizontalRule':
      return '---'
    default:
      return ''
  }
}

function serializeParagraph(node: JSONContent): string {
  if (!node.content) return ''
  return serializeInlineContent(node.content)
}

function serializeHeading(node: JSONContent): string {
  if (!node.content) return ''
  const level = node.attrs?.level || 1
  const prefix = '#'.repeat(level)
  return `${prefix} ${serializeInlineContent(node.content)}`
}

function serializeBulletList(node: JSONContent): string {
  if (!node.content) return ''
  return node.content.map(item => {
    if (item.type === 'listItem' && item.content) {
      const content = item.content.map(serializeNode).join('\n')
      return `- ${content}`
    }
    return ''
  }).join('\n')
}

function serializeOrderedList(node: JSONContent): string {
  if (!node.content) return ''
  return node.content.map((item, index) => {
    if (item.type === 'listItem' && item.content) {
      const content = item.content.map(serializeNode).join('\n')
      return `${index + 1}. ${content}`
    }
    return ''
  }).join('\n')
}

function serializeTaskList(node: JSONContent): string {
  if (!node.content) return ''
  return node.content.map(item => {
    if (item.type === 'taskItem' && item.content) {
      const checked = item.attrs?.checked ? '[x]' : '[ ]'
      const content = serializeInlineContent(item.content)
      return `${checked} ${content}`
    }
    return ''
  }).join('\n')
}

function serializeBlockquote(node: JSONContent): string {
  if (!node.content) return ''
  const content = node.content.map(serializeNode).join('\n')
  return content.split('\n').map(line => `> ${line}`).join('\n')
}

function serializeCodeBlock(node: JSONContent): string {
  if (!node.content) return ''
  const language = node.attrs?.language || ''
  const content = node.content.map(text => text.text || '').join('')
  return `\`\`\`${language}\n${content}\n\`\`\``
}

function serializeImage(node: JSONContent): string {
  const src = node.attrs?.src || ''
  const alt = node.attrs?.alt || ''
  const title = node.attrs?.title || ''
  const titleAttr = title ? ` "${title}"` : ''
  return `![${alt}](${src}${titleAttr})`
}

function serializeCallout(node: JSONContent): string {
  if (!node.content) return ''
  const variant = node.attrs?.variant || 'info'
  const title = node.attrs?.title || ''
  const content = node.content.map(serializeNode).join('\n')
  
  const titleAttr = title ? ` title="${title}"` : ''
  return `<Callout variant="${variant}"${titleAttr}>\n${content}\n</Callout>`
}

function serializeEmbed(node: JSONContent): string {
  const provider = node.attrs?.provider || ''
  const id = node.attrs?.id || ''
  
  switch (provider) {
    case 'youtube':
      return `<YouTube id="${id}" />`
    case 'tweet':
      return `<Tweet id="${id}" />`
    default:
      return ''
  }
}

function serializeComponent(node: JSONContent): string {
  const name = node.attrs?.name || ''
  const props = node.attrs?.props || {}
  
  if (!node.content) {
    // Self-closing component
    const propsString = Object.entries(props)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')
    return `<${name} ${propsString} />`
  }
  
  const content = node.content.map(serializeNode).join('\n')
  const propsString = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')
  
  return `<${name} ${propsString}>\n${content}\n</${name}>`
}

function serializeTable(node: JSONContent): string {
  if (!node.content) return ''
  
  const rows = node.content
  if (rows.length === 0) return ''
  
  // Header row
  const headerRow = rows[0]
  if (headerRow.type === 'tableRow' && headerRow.content) {
    const headers = headerRow.content.map(cell => {
      if (cell.type === 'tableHeader' && cell.content) {
        return serializeInlineContent(cell.content)
      }
      return ''
    })
    
    const headerLine = `| ${headers.join(' | ')} |`
    const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`
    
    // Data rows
    const dataRows = rows.slice(1).map(row => {
      if (row.type === 'tableRow' && row.content) {
        const cells = row.content.map(cell => {
          if (cell.type === 'tableCell' && cell.content) {
            return serializeInlineContent(cell.content)
          }
          return ''
        })
        return `| ${cells.join(' | ')} |`
      }
      return ''
    })
    
    return [headerLine, separatorLine, ...dataRows].join('\n')
  }
  
  return ''
}

function serializeInlineContent(content: JSONContent[]): string {
  return content.map(node => {
    if (node.type === 'text') {
      let text = node.text || ''
      
      // Apply marks
      if (node.marks) {
        for (const mark of node.marks) {
          switch (mark.type) {
            case 'bold':
              text = `**${text}**`
              break
            case 'italic':
              text = `*${text}*`
              break
            case 'code':
              text = `\`${text}\``
              break
            case 'strike':
              text = `~~${text}~~`
              break
            case 'link':
              const href = mark.attrs?.href || ''
              text = `[${text}](${href})`
              break
          }
        }
      }
      
      return text
    }
    
    return ''
  }).join('')
}


