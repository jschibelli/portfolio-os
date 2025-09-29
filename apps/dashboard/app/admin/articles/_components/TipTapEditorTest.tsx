// /app/(admin)/admin/articles/_components/TipTapEditorTest.tsx
// Test component to verify TipTap editor functionality

'use client'

import React, { useState } from 'react'
import { CompleteTipTapEditor } from './CompleteTipTapEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function TipTapEditorTest() {
  const [content, setContent] = useState('<p>Test the TipTap editor with all extensions!</p>')
  const [savedContent, setSavedContent] = useState('')

  const handleSave = () => {
    setSavedContent(content)
    console.log('Saved content:', content)
  }

  const handleClear = () => {
    setContent('')
    setSavedContent('')
  }

  const handleLoadSample = () => {
    const sampleContent = `
      <h1>TipTap Editor Test</h1>
      <h2>Features Test</h2>
      <p>This is a <strong>bold</strong> text and this is <em>italic</em> text.</p>
      <p>You can also have <u>underlined</u> and <s>strikethrough</s> text.</p>
      <p>Inline <code>code</code> is also supported.</p>
      
      <h3>Lists</h3>
      <ul>
        <li>Bullet list item 1</li>
        <li>Bullet list item 2</li>
      </ul>
      
      <ol>
        <li>Ordered list item 1</li>
        <li>Ordered list item 2</li>
      </ol>
      
      <h3>Task List</h3>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="true">Completed task</li>
        <li data-type="taskItem" data-checked="false">Pending task</li>
      </ul>
      
      <h3>Blockquote</h3>
      <blockquote>
        <p>This is a blockquote with some important information.</p>
      </blockquote>
      
      <h3>Code Block</h3>
      <pre><code>function hello() {
  console.log("Hello, TipTap!");
}</code></pre>
      
      <h3>Table</h3>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bold</td>
            <td>✅ Working</td>
          </tr>
          <tr>
            <td>Italic</td>
            <td>✅ Working</td>
          </tr>
        </tbody>
      </table>
      
      <hr>
      
      <p>Horizontal rule above this text.</p>
    `
    setContent(sampleContent)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>TipTap Editor Test</CardTitle>
          <p className="text-sm text-gray-600">
            Test all TipTap editor features including formatting, lists, tables, and more.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={handleLoadSample} variant="outline">
              Load Sample Content
            </Button>
            <Button onClick={handleSave} variant="default">
              Save Content
            </Button>
            <Button onClick={handleClear} variant="destructive">
              Clear
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Editor</h3>
            <CompleteTipTapEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing to test the TipTap editor..."
            />
          </div>
          
          {savedContent && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Saved Content (HTML)</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">{savedContent}</pre>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Text Formatting</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>Ctrl+B - Bold</li>
                  <li>Ctrl+I - Italic</li>
                  <li>Ctrl+U - Underline</li>
                  <li>Ctrl+Shift+X - Strikethrough</li>
                  <li>Ctrl+E - Inline Code</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Structure</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>Ctrl+Alt+1 - Heading 1</li>
                  <li>Ctrl+Alt+2 - Heading 2</li>
                  <li>Ctrl+Alt+3 - Heading 3</li>
                  <li>Ctrl+Shift+8 - Bullet List</li>
                  <li>Ctrl+Shift+7 - Ordered List</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Blocks</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>Ctrl+Shift+B - Blockquote</li>
                  <li>Ctrl+Alt+C - Code Block</li>
                  <li>Ctrl+Shift+H - Horizontal Rule</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Actions</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>Ctrl+K - Link</li>
                  <li>Ctrl+Z - Undo</li>
                  <li>Ctrl+Shift+Z - Redo</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TipTapEditorTest
