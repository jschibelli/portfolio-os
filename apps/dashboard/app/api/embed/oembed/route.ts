import { NextRequest, NextResponse } from 'next/server'

/**
 * oEmbed Proxy API
 * Fetches oEmbed data for generic URL embeds
 * Supports the oEmbed protocol for automatic embed generation
 * 
 * @see https://oembed.com/
 */

interface OEmbedResponse {
  type: 'photo' | 'video' | 'link' | 'rich'
  version: string
  title?: string
  author_name?: string
  author_url?: string
  provider_name?: string
  provider_url?: string
  cache_age?: number
  thumbnail_url?: string
  thumbnail_width?: number
  thumbnail_height?: number
  // Type-specific fields
  url?: string // photo
  width?: number
  height?: number
  html?: string // video, rich
}

/**
 * Known oEmbed providers and their endpoints
 * This list can be expanded as needed
 */
const OEMBED_PROVIDERS = [
  {
    name: 'Vimeo',
    pattern: /vimeo\.com/,
    endpoint: 'https://vimeo.com/api/oembed.json'
  },
  {
    name: 'SoundCloud',
    pattern: /soundcloud\.com/,
    endpoint: 'https://soundcloud.com/oembed'
  },
  {
    name: 'Spotify',
    pattern: /spotify\.com/,
    endpoint: 'https://embed.spotify.com/oembed'
  },
  {
    name: 'Flickr',
    pattern: /flickr\.com/,
    endpoint: 'https://www.flickr.com/services/oembed'
  },
  {
    name: 'SlideShare',
    pattern: /slideshare\.net/,
    endpoint: 'https://www.slideshare.net/api/oembed/2'
  }
]

/**
 * GET /api/embed/oembed?url=<encoded_url>
 * Fetches oEmbed data for a given URL
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Find matching oEmbed provider
    const provider = OEMBED_PROVIDERS.find(p => p.pattern.test(url))

    if (!provider) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No oEmbed provider found for this URL',
          supportedProviders: OEMBED_PROVIDERS.map(p => p.name)
        },
        { status: 404 }
      )
    }

    // Fetch oEmbed data
    const oembedUrl = `${provider.endpoint}?url=${encodeURIComponent(url)}&format=json`
    
    console.log(`[oEmbed API] Fetching from ${provider.name}: ${url}`)

    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Portfolio-OS/1.0',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`[oEmbed API] Provider returned ${response.status}`)
      return NextResponse.json(
        { success: false, error: `Provider returned error: ${response.status}` },
        { status: response.status }
      )
    }

    const data: OEmbedResponse = await response.json()

    console.log(`[oEmbed API] Successfully fetched oEmbed data for ${provider.name}`)

    return NextResponse.json({
      success: true,
      provider: provider.name,
      data: {
        type: data.type,
        title: data.title,
        author: data.author_name,
        authorUrl: data.author_url,
        providerName: data.provider_name,
        providerUrl: data.provider_url,
        thumbnailUrl: data.thumbnail_url,
        html: data.html,
        width: data.width,
        height: data.height,
        url: data.url
      }
    })

  } catch (error) {
    console.error('[oEmbed API] Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { success: false, error: 'Failed to fetch oEmbed data' },
      { status: 500 }
    )
  }
}

