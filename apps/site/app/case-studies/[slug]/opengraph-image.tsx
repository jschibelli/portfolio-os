import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Case Study';
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

  // Mock case study data - in a real app, this would come from your CMS or database
  const caseStudies = [
    {
      id: 'tendrilo-case-study',
      title: 'Tendril Multi-Tenant Chatbot SaaS: Strategic Analysis and Implementation Plan',
      slug: 'tendrilo-case-study',
      description: 'Comprehensive strategic analysis and implementation plan for Tendril Multi-Tenant Chatbot SaaS platform targeting SMB market gaps.',
      tags: ['SaaS', 'AI', 'Multi-tenant', 'Chatbot'],
      publishedAt: '2025-01-10',
      author: 'John Schibelli',
      featured: true,
    },
  ];

  const caseStudy = caseStudies.find(cs => cs.slug === slug);

  if (!caseStudy) {
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
          <div style={{ fontSize: 48, fontWeight: 'bold' }}>Case Study Not Found</div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

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
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
            maxWidth: '1000px',
          }}
        >
          {/* Case Study indicator */}
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
            📋 Case Study
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#fafaf9',
              lineHeight: '1.1',
              marginBottom: '24px',
            }}
          >
            {caseStudy.title}
          </div>

          {/* Description */}
          {caseStudy.description && (
            <div
              style={{
                fontSize: '20px',
                color: '#d6d3d1',
                lineHeight: '1.4',
                marginBottom: '32px',
              }}
            >
              {caseStudy.description.length > 150 
                ? `${caseStudy.description.substring(0, 150)}...` 
                : caseStudy.description
              }
            </div>
          )}

          {/* Tags */}
          {caseStudy.tags && caseStudy.tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '24px',
                justifyContent: 'center',
              }}
            >
              {caseStudy.tags.slice(0, 4).map((tag: string, index: number) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    color: '#fafaf9',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  #{tag}
                </div>
              ))}
            </div>
          )}

          {/* Author and date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '32px',
              fontSize: '18px',
              color: '#a8a29e',
            }}
          >
            {caseStudy.author && (
              <span>By {caseStudy.author}</span>
            )}
            {caseStudy.publishedAt && (
              <span>•</span>
            )}
            {caseStudy.publishedAt && (
              <span>
                {new Date(caseStudy.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
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
