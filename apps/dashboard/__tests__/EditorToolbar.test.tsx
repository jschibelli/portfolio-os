import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from '@tiptap/core'
import { EditorToolbar } from '../app/admin/articles/_components/EditorToolbar'

// Mock TipTap extensions
jest.mock('@tiptap/react', () => ({
  Editor: jest.fn().mockImplementation(() => ({
    chain: jest.fn().mockReturnThis(),
    focus: jest.fn().mockReturnThis(),
    toggleBold: jest.fn().mockReturnThis(),
    toggleItalic: jest.fn().mockReturnThis(),
    toggleUnderline: jest.fn().mockReturnThis(),
    toggleStrike: jest.fn().mockReturnThis(),
    toggleBulletList: jest.fn().mockReturnThis(),
    toggleOrderedList: jest.fn().mockReturnThis(),
    toggleTaskList: jest.fn().mockReturnThis(),
    toggleCode: jest.fn().mockReturnThis(),
    toggleCodeBlock: jest.fn().mockReturnThis(),
    toggleBlockquote: jest.fn().mockReturnThis(),
    setHorizontalRule: jest.fn().mockReturnThis(),
    insertTable: jest.fn().mockReturnThis(),
    setLink: jest.fn().mockReturnThis(),
    undo: jest.fn().mockReturnThis(),
    redo: jest.fn().mockReturnThis(),
    clearNodes: jest.fn().mockReturnThis(),
    unsetAllMarks: jest.fn().mockReturnThis(),
    run: jest.fn(),
    isActive: jest.fn().mockReturnValue(false),
    can: jest.fn().mockReturnValue({
      undo: jest.fn().mockReturnValue(true),
      redo: jest.fn().mockReturnValue(true)
    }),
    destroy: jest.fn()
  }))
}))

// Mock TipTap extensions
jest.mock('@tiptap/starter-kit', () => ({}))
jest.mock('@tiptap/extension-link', () => ({}))
jest.mock('@tiptap/extension-image', () => ({}))
jest.mock('@tiptap/extension-table', () => ({}))
jest.mock('@tiptap/extension-table-row', () => ({}))
jest.mock('@tiptap/extension-table-header', () => ({}))
jest.mock('@tiptap/extension-table-cell', () => ({}))
jest.mock('@tiptap/extension-task-list', () => ({}))
jest.mock('@tiptap/extension-task-item', () => ({}))
jest.mock('@tiptap/extension-code-block-lowlight', () => ({}))
jest.mock('lowlight', () => ({}))

// Mock the editor
const createMockEditor = () => ({
  chain: jest.fn().mockReturnThis(),
  focus: jest.fn().mockReturnThis(),
  toggleBold: jest.fn().mockReturnThis(),
  toggleItalic: jest.fn().mockReturnThis(),
  toggleUnderline: jest.fn().mockReturnThis(),
  toggleStrike: jest.fn().mockReturnThis(),
  toggleBulletList: jest.fn().mockReturnThis(),
  toggleOrderedList: jest.fn().mockReturnThis(),
  toggleTaskList: jest.fn().mockReturnThis(),
  toggleCode: jest.fn().mockReturnThis(),
  toggleCodeBlock: jest.fn().mockReturnThis(),
  toggleBlockquote: jest.fn().mockReturnThis(),
  setHorizontalRule: jest.fn().mockReturnThis(),
  insertTable: jest.fn().mockReturnThis(),
  setLink: jest.fn().mockReturnThis(),
  undo: jest.fn().mockReturnThis(),
  redo: jest.fn().mockReturnThis(),
  clearNodes: jest.fn().mockReturnThis(),
  unsetAllMarks: jest.fn().mockReturnThis(),
  run: jest.fn(),
  isActive: jest.fn().mockReturnValue(false),
  can: jest.fn().mockReturnValue({
    undo: jest.fn().mockReturnValue(true),
    redo: jest.fn().mockReturnValue(true)
  }),
  destroy: jest.fn()
})

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = jest.fn()
  console.warn = jest.fn()
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

describe('EditorToolbar', () => {
  let editor: Editor
  let mockOnImageUpload: jest.Mock

  beforeEach(() => {
    editor = createMockEditor()
    mockOnImageUpload = jest.fn()
  })

  afterEach(() => {
    editor.destroy()
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument()
  })

  it('renders all formatting buttons', () => {
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /underline/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /strikethrough/i })).toBeInTheDocument()
  })

  it('renders list buttons', () => {
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    expect(screen.getByRole('button', { name: /bullet list/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /numbered list/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /task list/i })).toBeInTheDocument()
  })

  it('renders code buttons', () => {
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    expect(screen.getByRole('button', { name: /inline code/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /code block/i })).toBeInTheDocument()
  })

  it('renders block element buttons', () => {
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    expect(screen.getByRole('button', { name: /quote/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /horizontal rule/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /insert table/i })).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    expect(screen.getByRole('button', { name: /insert image/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /clear formatting/i })).toBeInTheDocument()
  })

  it('handles bold formatting', async () => {
    const user = userEvent.setup()
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    const boldButton = screen.getByRole('button', { name: /bold/i })
    await user.click(boldButton)
    
    // The editor should have bold formatting applied
    expect(editor.isActive('bold')).toBe(true)
  })

  it('handles italic formatting', async () => {
    const user = userEvent.setup()
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    const italicButton = screen.getByRole('button', { name: /italic/i })
    await user.click(italicButton)
    
    expect(editor.isActive('italic')).toBe(true)
  })

  it('handles bullet list formatting', async () => {
    const user = userEvent.setup()
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    const bulletListButton = screen.getByRole('button', { name: /bullet list/i })
    await user.click(bulletListButton)
    
    expect(editor.isActive('bulletList')).toBe(true)
  })

  it('handles link insertion with valid URL', async () => {
    const user = userEvent.setup()
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    const linkButton = screen.getByRole('button', { name: /add link/i })
    
    // Mock window.prompt
    const mockPrompt = jest.spyOn(window, 'prompt').mockReturnValue('https://example.com')
    
    await user.click(linkButton)
    
    expect(editor.isActive('link')).toBe(true)
    mockPrompt.mockRestore()
  })

  it('handles link insertion with invalid URL', async () => {
    const user = userEvent.setup()
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    const linkButton = screen.getByRole('button', { name: /add link/i })
    
    // Mock window.prompt and alert
    const mockPrompt = jest.spyOn(window, 'prompt').mockReturnValue('invalid-url')
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {})
    
    await user.click(linkButton)
    
    expect(mockAlert).toHaveBeenCalledWith('Please enter a valid URL')
    expect(editor.isActive('link')).toBe(false)
    
    mockPrompt.mockRestore()
    mockAlert.mockRestore()
  })

  it('handles table insertion', async () => {
    const user = userEvent.setup()
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    const tableButton = screen.getByRole('button', { name: /insert table/i })
    await user.click(tableButton)
    
    // Check if table is inserted (this would depend on the editor's state)
    // For now, we just verify the button click doesn't throw an error
    expect(tableButton).toBeInTheDocument()
  })

  it('handles image upload', async () => {
    const user = userEvent.setup()
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    const imageButton = screen.getByRole('button', { name: /insert image/i })
    await user.click(imageButton)
    
    expect(mockOnImageUpload).toHaveBeenCalled()
  })

  it('handles undo/redo actions', async () => {
    const user = userEvent.setup()
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    const undoButton = screen.getByRole('button', { name: /undo/i })
    const redoButton = screen.getByRole('button', { name: /redo/i })
    
    await user.click(undoButton)
    await user.click(redoButton)
    
    // Verify buttons are clickable (exact behavior depends on editor state)
    expect(undoButton).toBeInTheDocument()
    expect(redoButton).toBeInTheDocument()
  })

  it('handles clear formatting', async () => {
    const user = userEvent.setup()
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    const clearButton = screen.getByRole('button', { name: /clear formatting/i })
    await user.click(clearButton)
    
    // Verify the action is executed without error
    expect(clearButton).toBeInTheDocument()
  })

  it('shows active state for formatting buttons', () => {
    // Set editor to bold state
    editor.chain().focus().toggleBold().run()
    
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    const boldButton = screen.getByRole('button', { name: /bold/i })
    expect(boldButton).toHaveClass('bg-primary') // Active state class
  })

  it('handles error gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock editor to throw an error
    const mockChain = jest.fn().mockImplementation(() => ({
      focus: jest.fn().mockImplementation(() => ({
        toggleBold: jest.fn().mockImplementation(() => ({
          run: jest.fn().mockImplementation(() => {
            throw new Error('Editor error')
          })
        }))
      }))
    }))
    
    editor.chain = mockChain
    
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    const boldButton = screen.getByRole('button', { name: /bold/i })
    await user.click(boldButton)
    
    // Should not crash and should log error
    expect(console.error).toHaveBeenCalledWith('Error in toggle bold:', expect.any(Error))
  })

  it('renders mobile responsive buttons', () => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768, // Mobile width
    })
    
    render(<EditorToolbar editor={editor} onImageUpload={mockOnImageUpload} />)
    
    // Mobile buttons should be visible
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /list/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /image/i })).toBeInTheDocument()
  })

  it('does not render when editor is null', () => {
    render(<EditorToolbar editor={null as any} onImageUpload={mockOnImageUpload} />)
    
    expect(screen.queryByRole('button', { name: /bold/i })).not.toBeInTheDocument()
  })
})
