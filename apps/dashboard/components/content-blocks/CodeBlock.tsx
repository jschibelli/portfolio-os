/**
 * Code Block Component
 * Renders syntax-highlighted code blocks
 */

import React from 'react';
import { CodeBlock as CodeBlockType } from '@/lib/blocks/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  block: CodeBlockType;
  isEditable?: boolean;
  onUpdate?: (data: Partial<CodeBlockType['data']>) => void;
}

export function CodeBlock({ block, isEditable = false, onUpdate }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const { code, language, filename, showLineNumbers, highlightLines } = block.data;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleCodeChange = (newCode: string) => {
    if (onUpdate) {
      onUpdate({ code: newCode });
    }
  };

  return (
    <div className="relative group">
      {/* Filename */}
      {filename && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono border-b border-gray-700">
          {filename}
        </div>
      )}

      {/* Copy Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </>
        )}
      </Button>

      {/* Code Content */}
      <div className="relative">
        {isEditable ? (
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full min-h-[200px] p-4 font-mono text-sm bg-gray-900 text-gray-100 border-0 resize-none focus:outline-none"
            placeholder="Enter your code here..."
            spellCheck={false}
          />
        ) : (
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            showLineNumbers={showLineNumbers}
            lineNumberStyle={{
              color: '#6b7280',
              fontSize: '0.875rem',
              paddingRight: '1rem',
              userSelect: 'none'
            }}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: '#1e1e1e',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {code || '// No code provided'}
          </SyntaxHighlighter>
        )}
      </div>

      {/* Language Badge */}
      <div className="absolute bottom-2 left-2 bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-mono">
        {language}
      </div>
    </div>
  );
}
