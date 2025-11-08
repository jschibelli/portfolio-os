const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// Load environment variables from apps/site/.env.local
const envPath = path.join(__dirname, 'apps', 'site', '.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('✅ Loaded environment from apps/site/.env.local\n');
} else {
  console.log('⚠️  No .env.local found at apps/site/.env.local');
  console.log('⚠️  Using environment variables from system/Vercel\n');
}

const prisma = new PrismaClient();

async function checkAndResetPassword() {
  console.log('🔍 Checking your admin account...\n');
  
  try {
    // First, let's see what users exist
    console.log('📋 Fetching all users from database...');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in database!');
      console.log('\nCreating your admin account...');
    } else {
      console.log(`\n✅ Found ${allUsers.length} user(s):\n`);
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'N/A'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.createdAt.toLocaleDateString()}\n`);
      });
    }
    
    // Check if jschibelli@gmail.com exists
    const yourEmail = 'jschibelli@gmail.com';
    const existingUser = await prisma.user.findUnique({
      where: { email: yourEmail }
    });
    
    // Set new password - CHANGE THIS TO WHATEVER YOU WANT
    const newPassword = 'PortfolioAdmin2025!@#';
    
    if (existingUser) {
      console.log(`🔑 Found your account: ${yourEmail}`);
      console.log('🔄 Resetting password...\n');
    } else {
      console.log(`📝 Account not found. Creating new admin account for ${yourEmail}...\n`);
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update or create the user
    const user = await prisma.user.upsert({
      where: { email: yourEmail },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        name: 'John Schibelli'
      },
      create: {
        email: yourEmail,
        password: hashedPassword,
        role: 'ADMIN',
        name: 'John Schibelli'
      }
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ YOUR ADMIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:    ${user.email}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log(`👑 Role:     ${user.role}`);
    console.log(`👤 Name:     ${user.name}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('🎉 Success! You can now log in with these credentials.');
    console.log('📝 Save this password somewhere safe!\n');
    console.log('🌐 Login URLs:');
    console.log('   Local:    http://localhost:3003/login');
    console.log('   Prod:     https://your-admin-subdomain.vercel.app/login\n');
    
    // Optional: Clean up old admin accounts
    const oldAdmin = await prisma.user.findUnique({
      where: { email: 'admin@mindware-blog.com' }
    });
    
    if (oldAdmin && oldAdmin.email !== yourEmail) {
      console.log('🗑️  Found old default admin account (admin@mindware-blog.com)');
      console.log('   Do you want to remove it? (You can delete it manually later)');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your DATABASE_URL in .env.local');
    console.error('2. Make sure database is running');
    console.error('3. Run: cd apps/site && npx prisma generate');
    console.error('4. Run: cd apps/site && npx prisma db push');
  } finally {
    await prisma.$disconnect();
  }
}

checkAndResetPassword();

