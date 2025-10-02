#!/usr/bin/env node

/**
 * Initialize Publishing Workflow
 * 
 * This script initializes the unified publishing workflow by:
 * 1. Checking database schema
 * 2. Creating default publishing templates
 * 3. Verifying platform configurations
 */

import { PrismaClient } from '@prisma/client';
import { initializeDefaultTemplates } from '../lib/publishing/default-templates';

const prisma = new PrismaClient();

async function checkDatabaseSchema() {
  console.log('\n📊 Checking database schema...');
  
  try {
    // Check if publishing tables exist by trying to count records
    const checks = await Promise.allSettled([
      prisma.publishingStatus.count(),
      prisma.publishingQueue.count(),
      prisma.publishingTemplate.count(),
      prisma.publishingAnalytics.count()
    ]);

    const allTablesExist = checks.every(result => result.status === 'fulfilled');
    
    if (allTablesExist) {
      console.log('✅ All publishing tables exist');
      return true;
    } else {
      console.log('❌ Some publishing tables are missing');
      console.log('   Run: npm run db:generate && npm run db:push');
      return false;
    }
  } catch (error) {
    console.log('❌ Database schema check failed');
    console.log('   Run: npm run db:generate && npm run db:push');
    return false;
  }
}

async function checkEnvironmentVariables() {
  console.log('\n🔐 Checking environment variables...');
  
  const requiredVars = [
    { name: 'DATABASE_URL', required: true },
    { name: 'HASHNODE_API_TOKEN', required: false },
    { name: 'HASHNODE_PUBLICATION_ID', required: false },
    { name: 'DEVTO_API_KEY', required: false },
    { name: 'MEDIUM_USER_ID', required: false },
    { name: 'MEDIUM_ACCESS_TOKEN', required: false },
    { name: 'LINKEDIN_ACCESS_TOKEN', required: false },
    { name: 'LINKEDIN_AUTHOR_ID', required: false }
  ];

  let allRequired = true;
  let hasOptional = false;

  for (const { name, required } of requiredVars) {
    const exists = !!process.env[name];
    
    if (required) {
      if (exists) {
        console.log(`✅ ${name} is configured`);
      } else {
        console.log(`❌ ${name} is REQUIRED but missing`);
        allRequired = false;
      }
    } else {
      if (exists) {
        console.log(`✅ ${name} is configured (optional)`);
        hasOptional = true;
      } else {
        console.log(`⚠️  ${name} is not configured (optional)`);
      }
    }
  }

  if (!allRequired) {
    console.log('\n❌ Please configure required environment variables in .env');
    return false;
  }

  if (!hasOptional) {
    console.log('\n⚠️  No platform credentials configured. Publishing will only work for Dashboard.');
    console.log('   To enable multi-platform publishing, configure platform credentials.');
  }

  return true;
}

async function initializeTemplates() {
  console.log('\n📝 Initializing default publishing templates...');
  
  try {
    await initializeDefaultTemplates(prisma);
    console.log('✅ Default templates initialized');
    return true;
  } catch (error) {
    console.log('❌ Failed to initialize templates');
    console.error(error);
    return false;
  }
}

async function verifyQueueProcessor() {
  console.log('\n⚙️  Checking queue processor configuration...');
  
  if (process.env.ENABLE_QUEUE_PROCESSOR === 'true') {
    console.log('✅ Queue processor is enabled for automatic scheduling');
  } else {
    console.log('⚠️  Queue processor is not enabled');
    console.log('   Set ENABLE_QUEUE_PROCESSOR=true to enable automatic scheduled publishing');
  }
}

async function showSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Publishing Workflow Summary');
  console.log('='.repeat(60));

  try {
    const [templates, queueItems, publishingStatuses, analytics] = await Promise.all([
      prisma.publishingTemplate.count(),
      prisma.publishingQueue.count(),
      prisma.publishingStatus.count(),
      prisma.publishingAnalytics.count()
    ]);

    console.log(`\n📝 Templates: ${templates}`);
    console.log(`📋 Queue Items: ${queueItems}`);
    console.log(`📊 Publishing Statuses: ${publishingStatuses}`);
    console.log(`📈 Analytics Records: ${analytics}`);

    // Show available templates
    const allTemplates = await prisma.publishingTemplate.findMany({
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }]
    });

    if (allTemplates.length > 0) {
      console.log('\n📚 Available Templates:');
      for (const template of allTemplates) {
        const badge = template.isDefault ? ' (Default)' : '';
        console.log(`   - ${template.name}${badge}`);
        console.log(`     ${template.description}`);
      }
    }
  } catch (error) {
    console.log('⚠️  Could not retrieve statistics');
  }
}

async function main() {
  console.log('🚀 Unified Publishing Workflow Initialization');
  console.log('='.repeat(60));

  try {
    // Step 1: Check database schema
    const schemaOk = await checkDatabaseSchema();
    if (!schemaOk) {
      console.log('\n❌ Database schema is not ready. Please run migrations first.');
      process.exit(1);
    }

    // Step 2: Check environment variables
    const envOk = await checkEnvironmentVariables();
    if (!envOk) {
      console.log('\n❌ Environment configuration is not complete.');
      process.exit(1);
    }

    // Step 3: Initialize templates
    const templatesOk = await initializeTemplates();
    if (!templatesOk) {
      console.log('\n⚠️  Template initialization had issues, but continuing...');
    }

    // Step 4: Verify queue processor
    await verifyQueueProcessor();

    // Step 5: Show summary
    await showSummary();

    console.log('\n' + '='.repeat(60));
    console.log('✅ Publishing Workflow Initialization Complete!');
    console.log('='.repeat(60));
    console.log('\n📖 Next Steps:');
    console.log('   1. Configure platform credentials in .env (if not done)');
    console.log('   2. Start the development server: npm run dev');
    console.log('   3. Access the publishing panel in the article editor');
    console.log('   4. Review the documentation: UNIFIED_PUBLISHING_WORKFLOW.md');
    console.log('');

  } catch (error) {
    console.error('\n❌ Initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the initialization
main();
