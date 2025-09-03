const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
  // Check if we're in the right directory
  const currentDir = process.cwd();
  console.log(`📁 Current directory: ${currentDir}`);
  
  // Check if Prisma schema exists
  const prismaSchemaPath = path.join(currentDir, 'prisma', 'schema.prisma');
  if (fs.existsSync(prismaSchemaPath)) {
    console.log('✅ Prisma schema found');
    
    // Try to generate Prisma client
    try {
      console.log('📦 Generating Prisma client...');
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma client generated successfully');
    } catch (error) {
      console.warn('⚠️ Prisma client generation failed, continuing with build...');
      console.warn('This is expected in some build environments');
    }
  } else {
    console.log('⚠️ Prisma schema not found, skipping Prisma generation');
  }
  
  // Run the build
  console.log('🏗️ Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
