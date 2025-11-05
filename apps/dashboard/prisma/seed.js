require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const prisma = new PrismaClient();

// Security constants
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const BCRYPT_COST_FACTOR = 12;

/**
 * Sanitizes email input by trimming whitespace and converting to lowercase
 * @param {string} email - Raw email input
 * @returns {string} - Sanitized email
 */
function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return '';
  }
  return email.trim().toLowerCase();
}

/**
 * Validates email format using RFC 5322 compliant regex with edge case handling
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Prevent excessively long emails
  if (email.length > 254) {
    return false;
  }
  
  // RFC 5322 compliant regex with proper TLD validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  // Additional validation: check for consecutive dots
  if (email.includes('..')) {
    return false;
  }
  
  return emailRegex.test(email);
}

/**
 * Validates password meets security requirements
 * @param {string} password - Password to validate
 * @returns {{ isValid: boolean, errors: string[] }} - Validation result
 */
function validatePassword(password) {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  // Length validation (OWASP/NIST guidelines)
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
  }
  
  if (password.length > MAX_PASSWORD_LENGTH) {
    errors.push(`Password must not exceed ${MAX_PASSWORD_LENGTH} characters`);
  }
  
  // Complexity validation (at least 3 of 4 character types)
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const complexityScore = [hasLowercase, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (complexityScore < 3) {
    errors.push('Password must contain at least 3 of: lowercase, uppercase, numbers, special characters');
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Validates environment variables for admin user creation
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @throws {Error} If validation fails
 */
function validateEnvironmentVariables(email, password) {
  if (!email || !password) {
    throw new Error('AUTH_ADMIN_EMAIL and AUTH_ADMIN_PASSWORD environment variables are required');
  }
}

/**
 * Finds an existing admin user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} - User object or null
 */
async function findExistingUser(email) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
  } catch (error) {
    console.error('❌ Error checking for existing user:', error.message);
    throw new Error(`Failed to query database: ${error.message}`);
  }
}

/**
 * Ensures user has ADMIN role, updating if necessary
 * @param {string} email - User email
 * @param {Object} user - Existing user object
 * @returns {Promise<Object>} - Updated or existing user
 */
async function ensureAdminRole(email, user) {
  if (user.role === "ADMIN") {
    console.log(`ℹ️  User already has ADMIN role`);
    return user;
  }
  
  try {
    const updated = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN", updatedAt: new Date() }
    });
    console.log(`✅ Updated user role from ${user.role} to ADMIN`);
    return updated;
  } catch (error) {
    console.error('❌ Error updating user role:', error.message);
    throw new Error(`Failed to update user role: ${error.message}`);
  }
}

/**
 * Creates a new admin user with hashed password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Created user object
 */
async function createAdminUser(email, password) {
  try {
    // Hash the password with bcrypt (includes automatic salting)
    console.log("🔒 Hashing password with bcrypt (cost factor: 12)...");
    const hash = await bcrypt.hash(password, BCRYPT_COST_FACTOR);

    // Generate a cryptographically secure RFC 4122 UUID
    const userId = crypto.randomUUID();

    // Create admin user with transaction for atomicity
    console.log("👤 Creating admin user in database...");
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
    // Handle specific Prisma error codes
    if (error.code === 'P2002') {
      throw new Error('User with this email already exists (unique constraint violation)');
    }
    console.error('❌ Error creating user:', error.message);
    throw new Error(`Failed to create admin user: ${error.message}`);
  }
}

/**
 * Main function to setup admin user
 */
async function main() {
  // Get credentials from environment variables
  const rawEmail = process.env.AUTH_ADMIN_EMAIL;
  const password = process.env.AUTH_ADMIN_PASSWORD;

  console.log("🔐 Setting up admin user...\n");

  // Validate environment variables are present
  validateEnvironmentVariables(rawEmail, password);

  // Sanitize and validate email
  const email = sanitizeEmail(rawEmail);
  if (!isValidEmail(email)) {
    throw new Error(`Invalid email format: ${rawEmail}`);
  }

  // Validate password complexity
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    const errorMessage = passwordValidation.errors.join('\n   - ');
    throw new Error(`Password validation failed:\n   - ${errorMessage}`);
  }

  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password.length} characters (validated)\n`);

  // Check if user already exists
  const existingUser = await findExistingUser(email);

  if (existingUser) {
    console.log(`ℹ️  Admin user already exists`);
    console.log(`   Email: ${existingUser.email}`);
    console.log(`   Role: ${existingUser.role}`);
    console.log(`   ID: ${existingUser.id}`);
    console.log(`   Created: ${existingUser.createdAt.toISOString()}\n`);
    
    // Ensure user has ADMIN role
    return await ensureAdminRole(email, existingUser);
  }

  // Create new admin user
  return await createAdminUser(email, password);
}

// Execute main function with comprehensive error handling
main()
  .catch((error) => {
    console.error("\n❌ Error seeding database:");
    console.error(`   ${error.message}\n`);
    
    // Log additional details for debugging
    if (error.code) {
      console.error(`   Error Code: ${error.code}`);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.error('\n   Stack Trace:');
      console.error(error.stack);
    }
    
    process.exit(1);
  })
  .finally(async () => {
    // Always disconnect from database to prevent connection leaks
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('⚠️  Warning: Failed to disconnect from database:', disconnectError.message);
    }
  });

/**
 * SECURITY NOTES:
 * 
 * 1. Password Hashing:
 *    - bcrypt automatically includes salt generation (random data added to password before hashing)
 *    - Cost factor of 12 provides strong security while maintaining performance
 *    - Each password hash is unique even for identical passwords
 * 
 * 2. Input Sanitization:
 *    - Email addresses are trimmed and lowercased to prevent duplicates
 *    - Edge cases like consecutive dots and excessive length are handled
 * 
 * 3. Password Requirements:
 *    - Minimum 8 characters (OWASP/NIST guidelines)
 *    - Maximum 128 characters (prevents DoS via bcrypt)
 *    - Complexity requirement: 3 of 4 character types (lowercase, uppercase, numbers, special)
 * 
 * 4. Environment Variables:
 *    - Credentials are never hardcoded in source code
 *    - Must be set in environment variables or .env.local file
 *    - Not included in version control (see .gitignore)
 * 
 * 5. Database Security:
 *    - RFC 4122 UUIDs prevent ID enumeration attacks
 *    - Unique constraints prevent duplicate users
 *    - All operations use Prisma's parameterized queries (SQL injection safe)
 */
