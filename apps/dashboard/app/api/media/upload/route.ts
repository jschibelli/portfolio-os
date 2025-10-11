import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Configure route to be dynamic (skip static generation)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy load sharp to avoid build-time dependency issues
const getSharp = async () => {
  const sharp = (await import('sharp')).default;
  return sharp;
};

/**
 * Advanced Media Upload API
 * Handles image uploads with optimization, WebP conversion, and blur data generation
 */

// Constants for image processing
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
const THUMBNAIL_SIZE = 300;
const MEDIUM_SIZE = 800;
const LARGE_SIZE = 1920;
const BLUR_SIZE = 20;
const WEBP_QUALITY = 85;
const THUMBNAIL_QUALITY = 70;

interface ImageVariant {
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

interface UploadResult {
  success: boolean;
  original: ImageVariant;
  webp?: ImageVariant;
  thumbnail?: ImageVariant;
  medium?: ImageVariant;
  large?: ImageVariant;
  blurDataURL?: string;
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
    hasAlpha: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR', 'AUTHOR'].includes((session.user as any)?.role)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const generateVariants = formData.get('generateVariants') === 'true';
    const generateBlur = formData.get('generateBlur') !== 'false'; // Default true
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file provided' 
      }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        success: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}` 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        success: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` 
      }, { status: 400 });
    }

    console.log(`[Media Upload] Processing: ${file.name} (${file.size} bytes) by ${session.user?.email}`);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Get image metadata using sharp
    const metadata = await (await getSharp())(buffer).metadata();
    
    // Generate unique filename base
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 10);
    const fileBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filenameBase = `media/${timestamp}-${fileBaseName}-${randomId}`;

    const result: UploadResult = {
      success: true,
      original: {
        url: '',
        width: metadata.width || 0,
        height: metadata.height || 0,
        size: file.size,
        format: metadata.format || 'unknown'
      },
      metadata: {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        size: file.size,
        hasAlpha: metadata.hasAlpha || false
      }
    };

    // Upload original
    const originalExt = file.name.split('.').pop();
    const originalBlob = await put(`${filenameBase}.${originalExt}`, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    result.original.url = originalBlob.url;

    // Generate WebP version for better compression
    const webpBuffer = await (await getSharp())(buffer)
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    
    const webpBlob = await put(`${filenameBase}.webp`, webpBuffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: 'image/webp'
    });
    
    result.webp = {
      url: webpBlob.url,
      width: metadata.width || 0,
      height: metadata.height || 0,
      size: webpBuffer.length,
      format: 'webp'
    };

    // Generate blur data URL for lazy loading
    if (generateBlur) {
      const blurBuffer = await (await getSharp())(buffer)
        .resize(BLUR_SIZE, BLUR_SIZE, { fit: 'cover' })
        .webp({ quality: 20 })
        .toBuffer();
      
      result.blurDataURL = `data:image/webp;base64,${blurBuffer.toString('base64')}`;
    }

    // Generate size variants if requested
    if (generateVariants && metadata.width && metadata.height) {
      // Thumbnail
      if (metadata.width > THUMBNAIL_SIZE || metadata.height > THUMBNAIL_SIZE) {
        const thumbnailBuffer = await (await getSharp())(buffer)
          .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: 'cover' })
          .webp({ quality: THUMBNAIL_QUALITY })
          .toBuffer();
        
        const thumbnailBlob = await put(`${filenameBase}-thumb.webp`, thumbnailBuffer, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
          contentType: 'image/webp'
        });
        
        result.thumbnail = {
          url: thumbnailBlob.url,
          width: THUMBNAIL_SIZE,
          height: THUMBNAIL_SIZE,
          size: thumbnailBuffer.length,
          format: 'webp'
        };
      }

      // Medium size
      if (metadata.width > MEDIUM_SIZE) {
        const mediumMeta = await (await getSharp())(buffer).metadata();
        const aspectRatio = (mediumMeta.width || 1) / (mediumMeta.height || 1);
        const mediumHeight = Math.round(MEDIUM_SIZE / aspectRatio);
        
        const mediumBuffer = await (await getSharp())(buffer)
          .resize(MEDIUM_SIZE, mediumHeight, { fit: 'inside' })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();
        
        const mediumBlob = await put(`${filenameBase}-medium.webp`, mediumBuffer, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
          contentType: 'image/webp'
        });
        
        result.medium = {
          url: mediumBlob.url,
          width: MEDIUM_SIZE,
          height: mediumHeight,
          size: mediumBuffer.length,
          format: 'webp'
        };
      }

      // Large size (for high-res displays)
      if (metadata.width > LARGE_SIZE) {
        const largeMeta = await (await getSharp())(buffer).metadata();
        const aspectRatio = (largeMeta.width || 1) / (largeMeta.height || 1);
        const largeHeight = Math.round(LARGE_SIZE / aspectRatio);
        
        const largeBuffer = await (await getSharp())(buffer)
          .resize(LARGE_SIZE, largeHeight, { fit: 'inside' })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();
        
        const largeBlob = await put(`${filenameBase}-large.webp`, largeBuffer, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
          contentType: 'image/webp'
        });
        
        result.large = {
          url: largeBlob.url,
          width: LARGE_SIZE,
          height: largeHeight,
          size: largeBuffer.length,
          format: 'webp'
        };
      }
    }

    console.log(`[Media Upload] Success: ${file.name} → ${result.webp?.url}`);

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Media Upload] Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { success: false, error: 'Failed to upload and process image' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Media upload endpoint' });
}
