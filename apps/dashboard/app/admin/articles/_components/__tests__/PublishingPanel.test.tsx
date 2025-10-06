import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PublishingPanel } from '../PublishingPanel'

// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, variant, ...props }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={className}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  )
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, type, min, className, ...props }: any) => (
    <input 
      value={value} 
      onChange={onChange} 
      type={type}
      min={min}
      className={className}
      {...props}
    />
  )
}))

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, className, ...props }: any) => (
    <label htmlFor={htmlFor} className={className} {...props}>
      {children}
    </label>
  )
}))

jest.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange, id, ...props }: any) => (
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={(e) => onCheckedChange(e.target.checked)}
      id={id}
      {...props}
    />
  )
}))

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <select value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardDescription: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <div className={className}>{children}</div>
}))

jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

// Mock fetch
global.fetch = jest.fn()

const defaultProps = {
  articleId: 'test-article-id',
  series: [
    { id: 'series-1', title: 'Test Series 1', articles: [] },
    { id: 'series-2', title: 'Test Series 2', articles: [] }
  ]
}

describe('PublishingPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all publishing options', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    expect(screen.getByText('Article Status')).toBeInTheDocument()
    expect(screen.getByText('Visibility')).toBeInTheDocument()
    expect(screen.getByText('Publishing Options')).toBeInTheDocument()
    expect(screen.getByText('Reading Time')).toBeInTheDocument()
    expect(screen.getByText('Series Assignment')).toBeInTheDocument()
    expect(screen.getByText('Cross-Platform Publishing')).toBeInTheDocument()
  })

  it('shows schedule picker when scheduled status is selected', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    // Click on Scheduled status
    const scheduledOption = screen.getByText('Scheduled')
    fireEvent.click(scheduledOption)
    
    // Check that schedule input appears
    expect(screen.getByDisplayValue('')).toBeInTheDocument()
  })

  it('allows toggling publishing options', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    // Check that switches are present
    expect(screen.getByText('Featured Article')).toBeInTheDocument()
    expect(screen.getByText('Allow Comments')).toBeInTheDocument()
    expect(screen.getByText('Allow Reactions')).toBeInTheDocument()
    expect(screen.getByText('Paywall Content')).toBeInTheDocument()
  })

  it('allows series selection', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    // Check that series dropdown is present
    expect(screen.getByText('Select Series')).toBeInTheDocument()
    expect(screen.getByText('Choose a series (optional)')).toBeInTheDocument()
  })

  it('shows reading time input', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    expect(screen.getByText('Reading Time')).toBeInTheDocument()
    expect(screen.getByDisplayValue('0')).toBeInTheDocument()
  })

  it('shows cross-platform publishing options', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    expect(screen.getByText('Hashnode')).toBeInTheDocument()
    expect(screen.getByText('Dev.to')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('calls onPreview when preview button is clicked', () => {
    const mockOnPreview = jest.fn()
    render(<PublishingPanel {...defaultProps} onPreview={mockOnPreview} />)
    
    const previewButton = screen.getByText('Preview')
    fireEvent.click(previewButton)
    
    expect(mockOnPreview).toHaveBeenCalledTimes(1)
  })

  it('saves publishing options when save button is clicked', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    } as Response)

    render(<PublishingPanel {...defaultProps} />)
    
    const saveButton = screen.getByText('Save Options')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/articles/publishing-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: 'test-article-id',
          status: 'DRAFT',
          visibility: 'PUBLIC',
          featured: false,
          allowComments: true,
          allowReactions: true,
          paywalled: false,
          readingMinutes: 0,
          seriesId: undefined,
          seriesPosition: undefined,
          crossPlatformPublishing: {
            hashnode: false,
            dev: false,
            medium: false
          }
        })
      })
    })
  })

  it('handles save errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<PublishingPanel {...defaultProps} />)
    
    const saveButton = screen.getByText('Save Options')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })

  it('updates reading time when input changes', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    const readingTimeInput = screen.getByDisplayValue('0')
    fireEvent.change(readingTimeInput, { target: { value: '5' } })
    
    expect(readingTimeInput).toHaveValue(5)
  })

  it('handles series selection', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    const seriesSelect = screen.getByDisplayValue('')
    fireEvent.change(seriesSelect, { target: { value: 'series-1' } })
    
    expect(seriesSelect).toHaveValue('series-1')
  })

  it('calls onSave when provided', async () => {
    const mockOnSave = jest.fn().mockResolvedValue(undefined)
    render(<PublishingPanel {...defaultProps} onSave={mockOnSave} />)
    
    const saveButton = screen.getByText('Save Options')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled()
    })
  })
})