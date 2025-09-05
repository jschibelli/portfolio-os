// Vercel Integration Adapter
// Docs: https://vercel.com/docs/rest-api
// Server-only - uses Vercel API token

export interface VercelDeployment {
  uid: string;
  url: string;
  state: string;
  createdAt: string;
}

export interface VercelListParams {
  projectId?: string;
  limit?: number;
}

// Get Vercel API token from environment
function getVercelToken() {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) {
    throw new Error('VERCEL_API_TOKEN environment variable not set');
  }
  return token;
}

export async function listDeployments({ 
  projectId, 
  limit = 10 
}: VercelListParams = {}): Promise<VercelDeployment[]> {
  try {
    const token = getVercelToken();
    
    let url = 'https://api.vercel.com/v6/deployments?limit=' + limit;
    if (projectId) {
      url += `&projectId=${projectId}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status}`);
    }

    const data = await response.json();
    const deployments = data.deployments || [];

    return deployments.map((deployment: any) => ({
      uid: deployment.uid,
      url: deployment.url,
      state: deployment.state,
      createdAt: deployment.createdAt,
    }));
  } catch (error) {
    console.error('Error listing Vercel deployments:', error);
    throw error;
  }
}
