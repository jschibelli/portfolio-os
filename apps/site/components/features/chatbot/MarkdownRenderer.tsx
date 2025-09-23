import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Helper function to process inline markdown
function processInlineMarkdown(text: string): string {
  let processed = text;
  
  // Handle bold text
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-stone-900 dark:text-stone-100">$1</strong>');
  
  // Handle italic text
  processed = processed.replace(/\*(.*?)\*/g, '<em class="italic text-stone-800 dark:text-stone-200">$1</em>');
  
  // Handle inline code
  processed = processed.replace(/`(.*?)`/g, '<code class="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded text-sm font-mono text-stone-800 dark:text-stone-200">$1</code>');
  
  // Handle links
  processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  return processed;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) {
    return null;
  }

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Handle headings
    if (line.startsWith('### ')) {
      const headingText = processInlineMarkdown(line.slice(4));
      elements.push(
        <h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-stone-900 dark:text-stone-100" 
            dangerouslySetInnerHTML={{ __html: headingText }} />
      );
    } else if (line.startsWith('## ')) {
      const headingText = processInlineMarkdown(line.slice(3));
      elements.push(
        <h2 key={i} className="text-xl font-semibold mt-4 mb-2 text-stone-900 dark:text-stone-100" 
            dangerouslySetInnerHTML={{ __html: headingText }} />
      );
    } else if (line.startsWith('# ')) {
      const headingText = processInlineMarkdown(line.slice(2));
      elements.push(
        <h1 key={i} className="text-2xl font-bold mt-4 mb-3 text-stone-900 dark:text-stone-100" 
            dangerouslySetInnerHTML={{ __html: headingText }} />
      );
    }
    // Handle code blocks
    else if (line.startsWith('```')) {
      elements.push(
        <div key={i} className="bg-stone-100 dark:bg-stone-800 p-3 rounded-lg font-mono text-sm my-2 text-stone-800 dark:text-stone-200">
          Code block
        </div>
      );
    }
    // Handle blockquotes
    else if (line.startsWith('> ')) {
      const quoteText = processInlineMarkdown(line.slice(2));
      elements.push(
        <blockquote key={i} className="border-l-4 border-stone-300 dark:border-stone-600 pl-4 italic my-2 text-stone-700 dark:text-stone-300" 
                   dangerouslySetInnerHTML={{ __html: quoteText }} />
      );
    }
    // Handle unordered lists
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: React.ReactNode[] = [];
      let j = i;
      
      while (j < lines.length && (lines[j].startsWith('- ') || lines[j].startsWith('* '))) {
        const itemText = processInlineMarkdown(lines[j].slice(2));
        listItems.push(
          <li key={j} className="text-stone-800 dark:text-stone-200" 
              dangerouslySetInnerHTML={{ __html: itemText }} />
        );
        j++;
      }
      
      elements.push(
        <ul key={i} className="ml-4 my-2 list-disc list-inside">
          {listItems}
        </ul>
      );
      i = j - 1; // Skip processed lines
    }
    // Handle numbered lists
    else if (/^\d+\.\s/.test(line)) {
      const listItems: React.ReactNode[] = [];
      let j = i;
      
      while (j < lines.length && /^\d+\.\s/.test(lines[j])) {
        const itemText = processInlineMarkdown(lines[j].replace(/^\d+\.\s/, ''));
        listItems.push(
          <li key={j} className="text-stone-800 dark:text-stone-200" 
              dangerouslySetInnerHTML={{ __html: itemText }} />
        );
        j++;
      }
      
      elements.push(
        <ol key={i} className="ml-4 my-2 list-decimal list-inside">
          {listItems}
        </ol>
      );
      i = j - 1; // Skip processed lines
    }
    // Handle images
    else if (line.startsWith('![')) {
      const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        const [, alt, src] = match;
        elements.push(
          <img key={i} src={src} alt={alt} className="max-w-full h-auto rounded-lg my-2" />
        );
      }
    }
    // Handle regular paragraphs
    else if (line.trim()) {
      const paragraphText = processInlineMarkdown(line);
      elements.push(
        <p key={i} className="my-1 text-stone-800 dark:text-stone-200" 
           dangerouslySetInnerHTML={{ __html: paragraphText }} />
      );
    }
    
    i++;
  }

  return (
    <div className={`prose prose-stone max-w-none ${className}`}>
      {elements}
    </div>
  );
}
