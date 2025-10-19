#!/usr/bin/env node

/**
 * Interactive script to add admin users
 * 
 * This script:
 * 1. Prompts for user Clerk ID and access level
 * 2. Validates the user exists in Convex
 * 3. Adds the user to the admins table in Convex
 * 4. Adds the "admin" role to the user in Clerk
 * 
 * Usage: node scripts/add-admin.js
 */

const readline = require('readline');
const { ConvexHttpClient } = require('convex/browser');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CONVEX_URL) {
  console.error('❌ Error: NEXT_PUBLIC_CONVEX_URL not found in .env.local');
  process.exit(1);
}

if (!CLERK_SECRET_KEY) {
  console.error('❌ Error: CLERK_SECRET_KEY not found in .env.local');
  process.exit(1);
}

const convex = new ConvexHttpClient(CONVEX_URL);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Validate access level
function isValidAccessLevel(level) {
  const validLevels = ['Full Access', 'Partial Access', 'Limited Access'];
  return validLevels.includes(level);
}

// Add admin role to user in Clerk
async function addClerkAdminRole(clerkId, accessLevel) {
  try {
    // Map access level to role value that middleware expects
    const roleMap = {
      'Full Access': 'admin-full',
      'Partial Access': 'admin-partial',
      'Limited Access': 'admin-limited'
    };
    
    const response = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: {
          role: roleMap[accessLevel]
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Clerk API error: ${error.errors?.[0]?.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to update Clerk: ${error.message}`);
  }
}

// Main function
async function main() {
  console.log('\n🔐 Admin User Creation Script\n');
  console.log('This script will add a user to the admin table and grant them admin role in Clerk.\n');

  try {
    // Step 1: Get Clerk ID
    const clerkId = await question('Enter the user\'s Clerk ID: ');
    
    if (!clerkId || !clerkId.trim()) {
      console.error('❌ Error: Clerk ID is required');
      rl.close();
      process.exit(1);
    }

    // Step 2: Get access level
    console.log('\nAccess Levels:');
    console.log('  1. Full Access');
    console.log('  2. Partial Access');
    console.log('  3. Limited Access');
    
    const accessLevelChoice = await question('\nSelect access level (1-3): ');
    
    const accessLevelMap = {
      '1': 'Full Access',
      '2': 'Partial Access',
      '3': 'Limited Access'
    };
    
    const accessLevel = accessLevelMap[accessLevelChoice];
    
    if (!accessLevel) {
      console.error('❌ Error: Invalid access level selection');
      rl.close();
      process.exit(1);
    }

    console.log(`\n📋 Summary:`);
    console.log(`   Clerk ID: ${clerkId.trim()}`);
    console.log(`   Access Level: ${accessLevel}`);
    
    const confirm = await question('\nProceed with admin creation? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Operation cancelled');
      rl.close();
      process.exit(0);
    }

    console.log('\n⏳ Processing...\n');

    // Step 3: Look up user in Convex
    console.log('1️⃣ Looking up user in Convex...');
    const user = await convex.query('users:getUserByClerkId', { 
      clerkId: clerkId.trim() 
    });

    if (!user) {
      console.error(`❌ Error: User with Clerk ID "${clerkId.trim()}" not found in Convex database`);
      console.log('\n💡 Tip: The user must sign up first before being made an admin');
      rl.close();
      process.exit(1);
    }

    console.log(`   ✅ User found: ${user.email}`);

    // Step 4: Check if already an admin
    console.log('\n2️⃣ Checking admin status...');
    const existingAdmin = await convex.query('admins:getAdminByClerkId', { 
      clerkId: clerkId.trim() 
    });

    if (existingAdmin) {
      console.error(`❌ Error: User is already an admin with ${existingAdmin.accessLevel}`);
      rl.close();
      process.exit(1);
    }

    console.log('   ✅ User is not yet an admin');

    // Step 5: Create admin record in Convex
    console.log('\n3️⃣ Creating admin record in Convex...');
    
    await convex.mutation('adminSetup:createAdminDirect', {
      clerkId: clerkId.trim(),
      userId: user._id,
      email: user.email,
      name: user.email.split('@')[0], // Use email prefix as name fallback
      accessLevel: accessLevel,
      accountCreatedAt: user.createdAt,
    });
    console.log('   ✅ Admin record created in Convex');

    // Step 6: Add admin role in Clerk
    console.log('\n4️⃣ Adding admin role in Clerk...');
    await addClerkAdminRole(clerkId.trim(), accessLevel);
    console.log('   ✅ Admin role added in Clerk');

    console.log('\n✅ Success! User has been granted admin access');
    console.log(`   Email: ${user.email}`);
    console.log(`   Access Level: ${accessLevel}`);
    console.log('\n💡 The user may need to sign out and sign back in for changes to take effect.\n');

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
main();
