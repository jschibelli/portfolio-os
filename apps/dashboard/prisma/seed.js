require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const prisma = new PrismaClient();

/**
 * Validates email format using RFC 5322 compliant regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

async function main() {
  const email = process.env.AUTH_ADMIN_EMAIL;
  const password = process.env.AUTH_ADMIN_PASSWORD;

  // Validate environment variables
  if (!email || !password) {
    throw new Error("Set AUTH_ADMIN_EMAIL and AUTH_ADMIN_PASSWORD environment variables");
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new Error(`Invalid email format: ${email}`);
  }

  // Validate password length (OWASP/NIST guidelines: minimum 8 characters)
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  console.log("🔐 Setting up admin user...\n");
  console.log(`   Email: ${email}`);

  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log(`ℹ️  Admin user already exists with email: ${email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   ID: ${existingAdmin.id}\n`);
      
      // Update to ensure ADMIN role
      if (existingAdmin.role !== "ADMIN") {
        const updated = await prisma.user.update({
          where: { email },
          data: { role: "ADMIN" }
        });
        console.log(`✅ Updated user role to ADMIN`);
        return updated;
      }
      
      return existingAdmin;
    }

    // Hash the password with bcrypt (cost factor 12 for security)
    console.log("🔒 Hashing password...");
    const hash = await bcrypt.hash(password, 12);

    // Generate a cryptographically secure UUID for the user ID
    const userId = crypto.randomUUID();

    // Create admin user
    console.log("👤 Creating admin user...");
    const admin = await prisma.user.create({
      data: {
        id: userId,
        email,
        password: hash,
        role: "ADMIN",
        name: "Admin",
        updatedAt: new Date()
      },
    });

    console.log("\n✅ Successfully created admin user!");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}\n`);
    
    return admin;
  } catch (error) {
    if (error.code === 'P2002') {
      console.error("❌ User with this email already exists");
    }
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
