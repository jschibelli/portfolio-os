import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  // Create test-results directory if it doesn't exist
  const testResultsDir = path.join(config.rootDir || process.cwd(), 'test-results');
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
  }

  // Create snapshots directory if it doesn't exist
  const snapshotsDir = path.join(config.rootDir || process.cwd(), 'tests', 'visual');
  if (!fs.existsSync(snapshotsDir)) {
    fs.mkdirSync(snapshotsDir, { recursive: true });
  }

  // Log setup completion
  console.log('✅ Global test setup completed');
  console.log(`📁 Test results directory: ${testResultsDir}`);
  console.log(`📁 Snapshots directory: ${snapshotsDir}`);
}

export default globalSetup;
