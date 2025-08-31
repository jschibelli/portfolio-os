import React, { useEffect, useRef } from 'react';
import { useEmbeds } from '@starter-kit/utils/renderer/hooks/useEmbeds';
import { markdownToHtml } from '@starter-kit/utils/renderer/markdownToHtml';
import { parseFencedBlocks, renderFencedBlocks } from '../../../lib/case-study-blocks';

type Props = {
  contentMarkdown: string;
};

// Helper function to generate consistent IDs
const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Helper function to add IDs to headings using regex (works in SSR)
const addIdsToHeadings = (htmlContent: string): string => {
  return htmlContent.replace(
    /<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/g,
    (match, level, attributes, content) => {
      // Check if ID already exists
      if (attributes.includes('id=')) {
        // If ID exists but has "heading-" prefix, remove it
        const idMatch = attributes.match(/id="([^"]*)"/);
        if (idMatch && idMatch[1].startsWith('heading-')) {
          const newId = idMatch[1].replace('heading-', '');
          const newAttributes = attributes.replace(/id="[^"]*"/, `id="${newId}"`);
          return `<h${level}${newAttributes}>${content}</h${level}>`;
        }
        return match;
      }
      
      // Generate ID from content
      const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
      const id = generateHeadingId(textContent);
      
      // Add ID attribute
      const newAttributes = attributes ? `${attributes} id="${id}"` : ` id="${id}"`;
      return `<h${level}${newAttributes}>${content}</h${level}>`;
    }
  );
};

const CaseStudyMarkdownComponent = ({ contentMarkdown }: Props) => {
  useEmbeds({ enabled: true });
  const contentRef = useRef<HTMLDivElement>(null);

  // Add IDs to headings after the component mounts (fallback)
  useEffect(() => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        if (!heading.id) {
          const text = heading.textContent || '';
          const id = generateHeadingId(text);
          heading.id = id;
        }
      });
    }
  }, [contentMarkdown]);

  // Parse content and preserve block positions
  const renderContent = () => {
    // Parse blocks directly in the component
    const blockRegex = /:::(\w+)\n([\s\S]*?)\n:::/g;
    const parts: Array<{ type: 'markdown' | 'block'; content: string; blockType?: string; blockData?: any }> = [];
    let lastIndex = 0;
    let match;

    console.log('Content length:', contentMarkdown.length);
    console.log('Looking for blocks with regex pattern:', blockRegex);
    
    // Test if we can find any ::: patterns at all
    const allMatches = contentMarkdown.match(/:::/g);
    console.log('Total ::: patterns found:', allMatches ? allMatches.length : 0);
    
    // Show the exact content around the first few ::: patterns
    const firstColonIndex = contentMarkdown.indexOf(':::');
    if (firstColonIndex !== -1) {
      const start = Math.max(0, firstColonIndex - 20);
      const end = Math.min(contentMarkdown.length, firstColonIndex + 100);
      console.log('Content around first ::: pattern:');
      console.log('"' + contentMarkdown.substring(start, end) + '"');
    }
    
    // Test the regex on a sample
    const sampleContent = contentMarkdown.substring(0, 2000);
    console.log('Sample content length:', sampleContent.length);
    const sampleMatches = sampleContent.match(/:::(\w+)\n([\s\S]*?)\n:::/g);
    console.log('Sample matches found:', sampleMatches ? sampleMatches.length : 0);
    if (sampleMatches) {
      console.log('First sample match:', sampleMatches[0]);
    }

    // Find all blocks and their positions
    while ((match = blockRegex.exec(contentMarkdown)) !== null) {
      const [fullMatch, blockType, blockContent] = match;
      const startIndex = match.index;
      
      console.log('Found block:', blockType, 'at position:', startIndex);
      console.log('Block content preview:', blockContent.substring(0, 100) + '...');
      
      // Add markdown content before this block
      if (startIndex > lastIndex) {
        const markdownBefore = contentMarkdown.slice(lastIndex, startIndex);
        if (markdownBefore.trim()) {
          parts.push({ type: 'markdown', content: markdownBefore });
        }
      }
      
      // Parse block data based on type
      const lines = blockContent.trim().split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        let blockData;
        
        // Handle different block types with appropriate parsing
        switch (blockType) {
          case 'quote':
            // Parse quote blocks with key-value format
            const quoteData: any = {};
            lines.forEach(line => {
              const [key, ...valueParts] = line.split(':');
              if (key && valueParts.length > 0) {
                quoteData[key.trim()] = valueParts.join(':').trim();
              }
            });
            blockData = { type: 'quote', data: quoteData };
            break;
            
          case 'timeline':
            // Parse timeline blocks with phase, title, duration, description format
            const timelineData = lines.map(line => {
              const [phase, title, duration, ...descriptionParts] = line.split(',').map(s => s.trim());
              return {
                phase,
                title,
                duration,
                description: descriptionParts.join(', ')
              };
            });
            blockData = { type: 'timeline', data: timelineData };
            break;
            
          default:
            // Default parsing for table-like blocks
            const headers = lines[0].split(',').map(h => h.trim());
            const rows = lines.slice(1).map(line => 
              line.split(',').map(cell => cell.trim())
            );
            blockData = { type: blockType, headers, rows };
        }
        
        console.log('Parsed block data:', blockData);
        
        parts.push({ 
          type: 'block', 
          content: '', 
          blockType, 
          blockData 
        });
      }
      
      lastIndex = startIndex + fullMatch.length;
    }
    
    // Add remaining markdown content
    if (lastIndex < contentMarkdown.length) {
      const remainingMarkdown = contentMarkdown.slice(lastIndex);
      if (remainingMarkdown.trim()) {
        parts.push({ type: 'markdown', content: remainingMarkdown });
      }
    }

    console.log('Total parts found:', parts.length);
    console.log('Parts:', parts.map(p => ({ type: p.type, blockType: p.blockType })));

    // Render parts in order
    return (
      <div ref={contentRef} className="hashnode-content-style mx-auto w-full px-5 md:max-w-screen-md">
        {parts.map((part, index) => {
          if (part.type === 'markdown') {
            let htmlContent = markdownToHtml(part.content);
            
            // Add IDs to headings immediately during rendering
            try {
              htmlContent = addIdsToHeadings(htmlContent);
            } catch (error) {
              console.warn('Failed to add IDs to headings during rendering:', error);
            }
            
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            );
          } else if (part.type === 'block' && part.blockType && part.blockData) {
            // Render actual React components using the case study blocks library
            try {
              // Convert the parsed block data to the format expected by renderFencedBlocks
              const blocks = [{
                type: part.blockType,
                headers: part.blockData.headers || [],
                rows: part.blockData.rows || []
              }];
              
              const blockComponents = renderFencedBlocks(blocks);
              return <React.Fragment key={index}>{blockComponents}</React.Fragment>;
            } catch (error) {
              console.error('Error rendering block component:', error);
              // Fallback to placeholder if component rendering fails
              return (
                <div key={index} className="p-4 bg-red-100 dark:bg-red-900 rounded-lg my-4 border-2 border-red-500">
                  <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">
                    ❌ Error Rendering Block: {part.blockType}
                  </h3>
                  <div className="text-sm text-red-700 dark:text-red-300 mb-2">
                    {error instanceof Error ? error.message : 'Unknown error'}
                  </div>
                  <details className="text-xs">
                    <summary className="cursor-pointer">Block Data (click to expand)</summary>
                    <pre className="mt-2 overflow-auto">
                      {JSON.stringify(part.blockData, null, 2)}
                    </pre>
                  </details>
                </div>
              );
            }
          }
          return null;
        })}
      </div>
    );
  };

  return renderContent();
};

export const CaseStudyMarkdown = React.memo(CaseStudyMarkdownComponent);
