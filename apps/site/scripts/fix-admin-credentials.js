const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function fixAdminCredentials() {
  console.log('🔐 Fixing admin credentials to match your .env.local file...');
  
  try {
    // Get credentials from .env.local
    const email = process.env.AUTH_ADMIN_EMAIL;
    const password = process.env.AUTH_ADMIN_PASSWORD;
    
    if (!email || !password) {
      console.error('❌ AUTH_ADMIN_EMAIL or AUTH_ADMIN_PASSWORD not found in .env.local');
      return;
    }
    
    console.log(`📧 Using email: ${email}`);
    console.log(`🔑 Using password: ${password}`);
    
    // Hash the password
    const hash = await bcrypt.hash(password, 12);
    
    // Update or create the admin user with your credentials
    const admin = await prisma.user.upsert({
      where: { email },
      update: { 
        password: hash,
        role: 'ADMIN',
        name: 'John Schibelli'
      },
      create: {
        email,
        password: hash,
        role: 'ADMIN',
        name: 'John Schibelli'
      },
    });
    
    console.log('✅ Admin user updated successfully!');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👑 Role: ${admin.role}`);
    
    // Also remove the old admin user if it exists
    const oldAdmin = await prisma.user.findUnique({
      where: { email: 'admin@mindware-blog.com' }
    });
    
    if (oldAdmin) {
      await prisma.user.delete({
        where: { email: 'admin@mindware-blog.com' }
      });
      console.log('🗑️  Removed old admin user (admin@mindware-blog.com)');
    }
    
    console.log('\n🎉 Your original credentials are now restored!');
    console.log('You can now log in with your original email and password.');
    
  } catch (error) {
    console.error('❌ Error fixing admin credentials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminCredentials();
