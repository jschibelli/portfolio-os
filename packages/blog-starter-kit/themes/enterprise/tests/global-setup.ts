import { FullConfig } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  try {
    // Validate config parameter with detailed error message
    if (!config) {
      throw new Error('Config parameter is required for global setup');
    }

    if (!config.rootDir) {
      console.warn('⚠️  No rootDir specified in config, using process.cwd()');
    }

    const rootDir = config.rootDir || process.cwd();
    console.log(`📂 Using root directory: ${rootDir}`);

    // Create test-results directory if it doesn't exist (async)
    const testResultsDir = path.join(rootDir, 'test-results');
    try {
      await fs.access(testResultsDir);
      console.log(`📁 Test results directory already exists: ${testResultsDir}`);
    } catch {
      await fs.mkdir(testResultsDir, { recursive: true });
      console.log(`📁 Created test results directory: ${testResultsDir}`);
    }

    // Create snapshots directory if it doesn't exist (async)
    const snapshotsDir = path.join(rootDir, 'tests', 'visual');
    try {
      await fs.access(snapshotsDir);
      console.log(`📁 Snapshots directory already exists: ${snapshotsDir}`);
    } catch {
      await fs.mkdir(snapshotsDir, { recursive: true });
      console.log(`📁 Created snapshots directory: ${snapshotsDir}`);
    }

    // Create test-results subdirectories for better organization
    const subdirs = ['screenshots', 'videos', 'traces', 'reports'];
    for (const subdir of subdirs) {
      const subdirPath = path.join(testResultsDir, subdir);
      try {
        await fs.access(subdirPath);
      } catch {
        await fs.mkdir(subdirPath, { recursive: true });
        console.log(`📁 Created ${subdir} directory: ${subdirPath}`);
      }
    }

    // Log setup completion with timing
    const setupTime = Date.now();
    console.log('✅ Global test setup completed successfully');
    console.log(`📁 Test results directory: ${testResultsDir}`);
    console.log(`📁 Snapshots directory: ${snapshotsDir}`);
    console.log(`⏱️  Setup completed in ${Date.now() - setupTime}ms`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    
    console.error('❌ Global test setup failed with detailed error information:');
    console.error(`   Error: ${errorMessage}`);
    console.error(`   Stack: ${errorStack}`);
    console.error(`   Config: ${JSON.stringify(config, null, 2)}`);
    
    // Re-throw with more context
    throw new Error(`Global setup failed: ${errorMessage}`);
  }
}

export default globalSetup;
