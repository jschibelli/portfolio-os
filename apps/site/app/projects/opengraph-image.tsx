import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Projects - John Schibelli';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function OpengraphImage() {
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
          {/* Projects indicator */}
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
            🚀 Projects
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#fafaf9',
              lineHeight: '1.1',
              marginBottom: '24px',
            }}
          >
            My Projects
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '28px',
              color: '#d6d3d1',
              lineHeight: '1.4',
              marginBottom: '32px',
            }}
          >
            A curated collection of React, Next.js, and TypeScript projects
          </div>

          {/* Project types */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '24px',
              justifyContent: 'center',
            }}
          >
            {['Web Applications', 'Full-Stack Projects', 'Open Source', 'Case Studies', 'Live Demos'].map((type, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  color: '#fafaf9',
                  padding: '8px 16px',
                  borderRadius: '16px',
                  fontSize: '16px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                {type}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginTop: '32px',
              fontSize: '18px',
              color: '#a8a29e',
            }}
          >
            <span>✅ Completed Projects</span>
            <span>•</span>
            <span>🔧 Modern Technologies</span>
            <span>•</span>
            <span>📊 Live Demos</span>
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
            fontSize: '18px',
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
