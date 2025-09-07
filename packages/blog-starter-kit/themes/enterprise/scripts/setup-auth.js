const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function setupAuth() {
  console.log('🔐 Setting up authentication system...');
  
  try {
    // Check if .env.local exists
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      console.log('📝 Creating .env.local file...');
      
      const envContent = `# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/mindware_blog

# Authentication
AUTH_SECRET=your_super_secret_auth_key_change_this_in_production
AUTH_ADMIN_EMAIL=admin@mindware-blog.com
AUTH_ADMIN_PASSWORD=admin123

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Revalidation (optional)
REVALIDATE_SECRET=your_revalidate_secret_here

# AI Services
OPENAI_API_KEY=your_openai_api_key_here
`;
      
      fs.writeFileSync(envPath, envContent);
      console.log('✅ .env.local file created');
      console.log('⚠️  Please update DATABASE_URL with your actual database credentials');
    } else {
      console.log('✅ .env.local file already exists');
    }
    
    // Test database connection
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const email = 'admin@mindware-blog.com';
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 12);
    
    const admin = await prisma.user.upsert({
      where: { email },
      update: { role: 'ADMIN' },
      create: {
        email,
        password: hash,
        role: 'ADMIN',
        name: 'Admin User'
      },
    });
    
    console.log('✅ Admin user created/updated successfully');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👑 Role: ${admin.role}`);
    
    console.log('\n🎉 Authentication setup complete!');
    console.log('You can now log in with the admin credentials above.');
    
  } catch (error) {
    console.error('❌ Error setting up authentication:', error);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Database connection failed. Please check:');
      console.log('1. Your DATABASE_URL in .env.local');
      console.log('2. Your PostgreSQL server is running');
      console.log('3. Database credentials are correct');
    }
  } finally {
    await prisma.$disconnect();
  }
}

setupAuth();
