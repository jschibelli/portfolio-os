import { ImageResponse } from 'next/og';

// Load the font
async function getFont() {
  try {
    const response = await fetch(
      new URL('../../../../assets/PlusJakartaSans-Bold.ttf', import.meta.url)
    );
    return await response.arrayBuffer();
  } catch (error) {
    console.error('Failed to load font:', error);
    return null;
  }
}

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Fetch project data
    const projectData = await fetchProjectData(slug);
    
    if (!projectData) {
      return new Response('Project not found', { status: 404 });
    }

    const font = await getFont();

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
            backgroundColor: '#fafaf9', // stone-50
            backgroundImage: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)',
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
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d6d3d1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              opacity: 0.3,
            }}
          />
          
          {/* Main Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              maxWidth: '1000px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Project Type Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#3b82f6', // blue-500
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '24px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Project Case Study
            </div>

            {/* Project Title */}
            <h1
              style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#1c1917', // stone-900
                lineHeight: '1.1',
                margin: '0 0 24px 0',
                maxWidth: '900px',
                fontFamily: font ? 'PlusJakartaSans' : 'system-ui',
              }}
            >
              {projectData.title}
            </h1>

            {/* Project Description */}
            <p
              style={{
                fontSize: '20px',
                color: '#57534e', // stone-600
                lineHeight: '1.4',
                margin: '0 0 32px 0',
                maxWidth: '800px',
                fontWeight: '400',
              }}
            >
              {projectData.description}
            </p>

            {/* Technology Tags */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: 'center',
                marginBottom: '32px',
              }}
            >
              {projectData.tags.slice(0, 4).map((tag: string, index: number) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#f5f5f4', // stone-100
                    color: '#44403c', // stone-700
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: '1px solid #e7e5e4', // stone-200
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>

            {/* Bottom Branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#78716c', // stone-500
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                JS
              </div>
              <span>John Schibelli</span>
              <span>•</span>
              <span>Portfolio</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              width: '120px',
              height: '120px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              opacity: 0.1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              width: '80px',
              height: '80px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              opacity: 0.1,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: font ? [
          {
            name: 'PlusJakartaSans',
            data: font,
            style: 'normal',
            weight: 700,
          },
        ] : [],
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}

async function fetchProjectData(slug: string) {
  try {
    // Import portfolio data
    const portfolioData = await import('../../../../data/portfolio.json');
    const project = portfolioData.default.find((p: any) => p.slug === slug);
    
    if (!project) {
      return null;
    }

    return {
      title: project.title,
      description: project.description,
      tags: project.tags || [],
      image: project.image,
      liveUrl: project.liveUrl,
      caseStudyUrl: project.caseStudyUrl,
    };
  } catch (error) {
    console.error('Error fetching project data:', error);
    return null;
  }
}
