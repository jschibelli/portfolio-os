// /app/(admin)/admin/articles/_components/EditorToolbar.tsx
// Enhanced toolbar component with keyboard shortcuts and better UX

'use client'

import React from 'react'
import { Editor } from '@tiptap/react'

interface EditorToolbarProps {
  editor: Editor
  onImageUpload: () => void
}

export function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  // Temporarily disabled - TipTap not properly configured
  // TODO: Re-enable when TipTap is properly set up with all extensions
  return null
}

/* 
TODO: Re-implement when TipTap is properly configured with:
- StarterKit
- Link extension
- Image extension
- All other necessary extensions

The original implementation had issues because the TipTap editor
was not properly configured with the required extensions.
*/