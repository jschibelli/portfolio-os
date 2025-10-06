import { ImageResponse } from 'next/og';
import { fetchPostBySlug } from '../../../../lib/hashnode-api';

export const runtime = 'edge';
export const alt = 'Blog Post';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

interface OpengraphImageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OpengraphImage({ params }: OpengraphImageProps) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0c0a09',
            color: '#fafaf9',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 'bold' }}>Post Not Found</div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // If the post has a cover image, use it as a background with overlay
  const hasCoverImage = post.coverImage?.url;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: hasCoverImage ? 'transparent' : '#0c0a09',
          backgroundImage: hasCoverImage ? `url(${post.coverImage.url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {/* Dark overlay for better text readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: hasCoverImage ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
          }}
        />

        {/* Main content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
            maxWidth: '1000px',
          }}
        >
          {/* Blog indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(245, 158, 11, 0.9)',
              color: '#0c0a09',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '24px',
            }}
          >
            📝 Blog Post
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#fafaf9',
              lineHeight: '1.1',
              marginBottom: '24px',
              textShadow: hasCoverImage ? '2px 2px 4px rgba(0, 0, 0, 0.8)' : 'none',
            }}
          >
            {post.title}
          </div>

          {/* Description/Brief */}
          {post.brief && (
            <div
              style={{
                fontSize: '24px',
                color: '#d6d3d1',
                lineHeight: '1.4',
                marginBottom: '32px',
                textShadow: hasCoverImage ? '1px 1px 2px rgba(0, 0, 0, 0.8)' : 'none',
              }}
            >
              {post.brief.length > 120 
                ? `${post.brief.substring(0, 120)}...` 
                : post.brief
              }
            </div>
          )}

          {/* Author and date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '18px',
              color: '#a8a29e',
            }}
          >
            {post.author?.name && (
              <span style={{ textShadow: hasCoverImage ? '1px 1px 2px rgba(0, 0, 0, 0.8)' : 'none' }}>
                By {post.author.name}
              </span>
            )}
            {post.publishedAt && (
              <span style={{ textShadow: hasCoverImage ? '1px 1px 2px rgba(0, 0, 0, 0.8)' : 'none' }}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '24px',
                justifyContent: 'center',
              }}
            >
              {post.tags.slice(0, 3).map((tag: any, index: number) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    color: '#fafaf9',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    textShadow: hasCoverImage ? '1px 1px 2px rgba(0, 0, 0, 0.8)' : 'none',
                  }}
                >
                  #{tag.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '16px',
            color: '#fafaf9',
            textShadow: hasCoverImage ? '1px 1px 2px rgba(0, 0, 0, 0.8)' : 'none',
          }}
        >
          <span>johnschibelli.dev</span>
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '60px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '60px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.03) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
