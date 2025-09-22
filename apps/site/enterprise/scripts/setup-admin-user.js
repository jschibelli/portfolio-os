const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setupAdminUser() {
  try {
    console.log('🔐 Setting up admin user...\n');
    
    // Get admin credentials from environment or prompt
    const adminEmail = process.env.AUTH_ADMIN_EMAIL || 'admin@mindware-blog.com';
    const adminPassword = process.env.AUTH_ADMIN_PASSWORD || 'SecureAdmin2025!@#';
    const adminName = process.env.AUTH_ADMIN_NAME || 'Admin User';
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (existingAdmin) {
      console.log(`✅ Admin user already exists: ${adminEmail}`);
      console.log(`   Role: ${existingAdmin.role}`);
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   ID: ${adminUser.id}`);
    
    if (!process.env.AUTH_ADMIN_EMAIL) {
      console.log('\n📝 Add these to your .env.local file:');
      console.log(`AUTH_ADMIN_EMAIL=${adminEmail}`);
      console.log(`AUTH_ADMIN_PASSWORD=${adminPassword}`);
    }
    
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  setupAdminUser().catch(console.error);
}

module.exports = { setupAdminUser };
