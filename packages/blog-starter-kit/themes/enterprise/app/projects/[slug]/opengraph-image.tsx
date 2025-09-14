// import { ImageResponse } from 'next/og';
const ImageResponse = ({ children }: { children: React.ReactNode }) => null;
import { getProjectBySlug } from '../../../lib/project-utils';

export const runtime = 'edge';
export const alt = 'Project Overview';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface OpengraphImageProps {
  params: {
    slug: string;
  };
}

export default async function OpengraphImage({ params }: OpengraphImageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
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
          <div style={{ fontSize: 48, fontWeight: 'bold' }}>Project Not Found</div>
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
          backgroundColor: '#0c0a09',
          color: '#fafaf9',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #0c0a09 100%)',
            opacity: 0.8,
          }}
        />
        
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '60px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '40px',
                backgroundColor: '#f59e0b',
                marginRight: '20px',
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#a8a29e',
                letterSpacing: '0.05em',
              }}
            >
              PROJECT SHOWCASE
            </div>
          </div>

          {/* Project Title */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              lineHeight: '1.1',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {project.title}
          </div>

          {/* Project Description */}
          <div
            style={{
              fontSize: '28px',
              lineHeight: '1.4',
              color: '#d6d3d1',
              marginBottom: '40px',
              maxWidth: '900px',
            }}
          >
            {project.description}
          </div>

          {/* Bottom Section */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: 'auto',
            }}
          >
            {/* Technologies */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                maxWidth: '600px',
              }}
            >
              {project.tags.slice(0, 6).map((tag, index) => (
                <div
                  key={tag}
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    color: '#f59e0b',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '18px',
                    fontWeight: '500',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>

            {/* Author & URL */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                textAlign: 'right',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#fafaf9',
                  marginBottom: '8px',
                }}
              >
                John Schibelli
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#a8a29e',
                }}
              >
                schibelli.dev
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
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
