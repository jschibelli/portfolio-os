#!/usr/bin/env tsx
/**
 * Trigger a Vercel redeployment to update blog content
 * 
 * Usage:
 *   VERCEL_API_TOKEN=your_token npx tsx scripts/trigger-vercel-redeploy.ts
 * 
 * Get your Vercel token from: https://vercel.com/account/tokens
 */

async function triggerRedeploy() {
  const token = process.env.VERCEL_API_TOKEN;
  
  if (!token) {
    console.error('❌ VERCEL_API_TOKEN environment variable is required');
    console.log('\n💡 Get your token from: https://vercel.com/account/tokens');
    console.log('\nUsage:');
    console.log('  VERCEL_API_TOKEN=your_token npx tsx scripts/trigger-vercel-redeploy.ts\n');
    process.exit(1);
  }

  console.log('🚀 Triggering Vercel redeployment...\n');

  try {
    // Get deployments to find the latest production deployment
    const deploymentsResponse = await fetch(
      'https://api.vercel.com/v6/deployments?limit=1&state=READY&target=production',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!deploymentsResponse.ok) {
      throw new Error(`Failed to fetch deployments: ${deploymentsResponse.status}`);
    }

    const deploymentsData = await deploymentsResponse.json();
    const latestDeployment = deploymentsData.deployments?.[0];

    if (!latestDeployment) {
      console.error('❌ No production deployments found');
      process.exit(1);
    }

    console.log(`📦 Latest deployment: ${latestDeployment.url}`);
    console.log(`   Created: ${new Date(latestDeployment.createdAt).toLocaleString()}`);

    // Trigger a redeploy by creating a new deployment from the latest one
    const redeployResponse = await fetch(
      `https://api.vercel.com/v13/deployments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: latestDeployment.name,
          deploymentId: latestDeployment.uid,
          target: 'production',
        }),
      }
    );

    if (!redeployResponse.ok) {
      const error = await redeployResponse.text();
      throw new Error(`Failed to trigger redeployment: ${redeployResponse.status} - ${error}`);
    }

    const redeployData = await redeployResponse.json();

    console.log('\n✅ Redeployment triggered successfully!');
    console.log(`   Deployment URL: ${redeployData.url}`);
    console.log(`   Status: ${redeployData.readyState}`);
    console.log('\n⏳ Wait 2-3 minutes for the deployment to complete');
    console.log(`   Monitor at: https://vercel.com/${latestDeployment.name}\n`);

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

triggerRedeploy();

