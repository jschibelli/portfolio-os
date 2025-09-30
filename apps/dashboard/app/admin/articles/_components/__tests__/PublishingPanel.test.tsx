import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PublishingPanel } from '../PublishingPanel'

// Mock the API fetch
global.fetch = jest.fn()

const mockSeries = [
  {
    id: '1',
    title: 'React Series',
    slug: 'react-series',
    description: 'A series about React development',
    articles: []
  },
  {
    id: '2', 
    title: 'Next.js Series',
    slug: 'nextjs-series',
    description: 'A series about Next.js',
    articles: []
  }
]

const defaultProps = {
  articleId: 'test-article-id',
  series: mockSeries,
  onPreview: jest.fn()
}

describe('PublishingPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all publishing options sections', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    // Check for main sections
    expect(screen.getByText('Article Status')).toBeInTheDocument()
    expect(screen.getByText('Visibility')).toBeInTheDocument()
    expect(screen.getByText('Publishing Options')).toBeInTheDocument()
    expect(screen.getByText('Series Assignment')).toBeInTheDocument()
    expect(screen.getByText('Article Details')).toBeInTheDocument()
    expect(screen.getByText('Cross-Platform Publishing')).toBeInTheDocument()
  })

  it('allows status selection', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    // Check that all status options are present
    expect(screen.getByText('Draft')).toBeInTheDocument()
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(screen.getByText('Published')).toBeInTheDocument()
    expect(screen.getByText('Archived')).toBeInTheDocument()
  })

  it('allows visibility selection', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    // Check that all visibility options are present
    expect(screen.getByText('Public')).toBeInTheDocument()
    expect(screen.getByText('Unlisted')).toBeInTheDocument()
    expect(screen.getByText('Private')).toBeInTheDocument()
    expect(screen.getByText('Members Only')).toBeInTheDocument()
  })

  it('shows schedule picker when scheduled status is selected', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    // Click on Scheduled status
    const scheduledOption = screen.getByText('Scheduled')
    fireEvent.click(scheduledOption)
    
    // Check that schedule picker appears
    expect(screen.getByText('Schedule Publication')).toBeInTheDocument()
  })

  it('allows toggling publishing options', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    // Check that switches are present
    expect(screen.getByText('Featured Article')).toBeInTheDocument()
    expect(screen.getByText('Allow Comments')).toBeInTheDocument()
    expect(screen.getByText('Allow Reactions')).toBeInTheDocument()
    expect(screen.getByText('Premium Content (Paywall)')).toBeInTheDocument()
  })

  it('allows series selection', () => {
    render(<PublishingPanel {...defaultProps} />)
    
    // Check that series dropdown is present
    expect(screen.getByText('Select Series')).toBeInTheDocument()
    expect(screen.getByText('React Series')).toBeInTheDocument()
    expect(screen.getByText('Next.js Series')).toBeInTheDocument()
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
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<PublishingPanel {...defaultProps} />)
    
    const saveButton = screen.getByText('Save Options')
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save publishing options:', 
        expect.any(Error)
      )
    })

    consoleSpy.mockRestore()
  })
})
