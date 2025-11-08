const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  console.log('🔐 Admin Password Reset Tool\n');
  
  try {
    // SET YOUR CREDENTIALS HERE
    const newEmail = 'admin@mindware-blog.com';
    const newPassword = 'SecureAdmin2025!@#';
    const adminName = 'John Schibelli';
    
    console.log(`📧 Email: ${newEmail}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log(`👤 Name: ${adminName}\n`);
    
    // Hash the password
    console.log('🔒 Hashing password...');
    const hash = await bcrypt.hash(newPassword, 12);
    
    // Update or create the admin user
    console.log('💾 Updating database...');
    const admin = await prisma.user.upsert({
      where: { email: newEmail },
      update: { 
        password: hash,
        role: 'ADMIN',
        name: adminName
      },
      create: {
        email: newEmail,
        password: hash,
        role: 'ADMIN',
        name: adminName
      },
    });
    
    console.log('\n✅ Admin credentials reset successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:    ${admin.email}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log(`👑 Role:     ${admin.role}`);
    console.log(`👤 Name:     ${admin.name}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('🎉 You can now log in to your dashboard!');
    console.log('🌐 Dashboard URL: http://localhost:3003 (local)');
    console.log('🌐 Or your deployed admin subdomain\n');
    
  } catch (error) {
    console.error('\n❌ Error resetting admin credentials:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure your database is running');
    console.error('2. Check DATABASE_URL in your .env.local file');
    console.error('3. Run: cd apps/site && npx prisma generate');
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();







