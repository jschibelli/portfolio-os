#!/usr/bin/env tsx
/**
 * Trigger a Vercel redeployment to update blog content.
 *
 * Usage:
 *   1. Save VERCEL_API_TOKEN to .env.local (recommended)
 *   2. Run: npx tsx scripts/trigger-vercel-redeploy.ts
 *
 * Get your Vercel token from: https://vercel.com/account/tokens
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnvFile(fileName: string) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) {
    return;
  }

  const fileContents = readFileSync(filePath, 'utf8');
  for (const line of fileContents.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const delimiterIndex = trimmed.indexOf('=');
    if (delimiterIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, delimiterIndex).trim();
    if (!key || process.env[key]) {
      continue;
    }

    let value = trimmed.slice(delimiterIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function ensureEnvLoaded() {
  // Load from .env.local first (project-specific), then fallback to .env
  loadEnvFile('.env.local');
  loadEnvFile('.env');
}

async function triggerRedeploy() {
  ensureEnvLoaded();

  const token = process.env.VERCEL_API_TOKEN;
  
  if (!token) {
    console.error('❌ VERCEL_API_TOKEN environment variable is required');
    console.log('\n💡 Get your token from: https://vercel.com/account/tokens');
    console.log('\nRecommended:');
    console.log('  echo VERCEL_API_TOKEN=your_token >> .env.local');
    console.log('  npx tsx scripts/trigger-vercel-redeploy.ts\n');
    console.log('Alternative (one-off):');
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

