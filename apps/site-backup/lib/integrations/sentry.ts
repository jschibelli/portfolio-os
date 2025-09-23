// Sentry Integration Adapter
// Docs: https://docs.sentry.io/api/
// Server-only - uses Sentry API token

export interface SentryIssue {
  id: string;
  title: string;
  culprit: string;
  permalink: string;
  lastSeen: string;
}

export interface SentryListParams {
  org: string;
  project: string;
  limit?: number;
}

// Get Sentry API token from environment
function getSentryToken() {
  const token = process.env.SENTRY_API_TOKEN;
  if (!token) {
    throw new Error('SENTRY_API_TOKEN environment variable not set');
  }
  return token;
}

export async function listIssues({ 
  org, 
  project, 
  limit = 10 
}: SentryListParams): Promise<SentryIssue[]> {
  try {
    const token = getSentryToken();
    
    const response = await fetch(
      `https://sentry.io/api/0/projects/${org}/${project}/issues/?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.status}`);
    }

    const data = await response.json();
    const issues = data || [];

    return issues.map((issue: any) => ({
      id: issue.id,
      title: issue.title,
      culprit: issue.culprit || 'Unknown',
      permalink: issue.permalink,
      lastSeen: issue.lastSeen,
    }));
  } catch (error) {
    console.error('Error listing Sentry issues:', error);
    throw error;
  }
}
