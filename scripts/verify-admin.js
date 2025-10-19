#!/usr/bin/env node

/**
 * Verification script to check admin configuration in both Clerk and Convex
 * 
 * This script validates:
 * 1. User exists in Convex
 * 2. Admin record exists in Convex
 * 3. User has admin role in Clerk
 * 4. Configuration consistency between systems
 * 
 * Usage: node scripts/verify-admin.js <clerk-id>
 */

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

async function getClerkUser(clerkId) {
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Clerk API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch from Clerk: ${error.message}`);
  }
}

async function verifyAdmin(clerkId) {
  console.log('\n🔐 Admin Configuration Verification\n');
  console.log(`Checking Clerk ID: ${clerkId}\n`);

  try {
    // Step 1: Check Clerk User
    console.log('1️⃣ Checking Clerk user...');
    const clerkUser = await getClerkUser(clerkId);
    console.log(`   ✅ User found: ${clerkUser.email_addresses?.[0]?.email_address}`);
    console.log(`   Public Metadata: ${JSON.stringify(clerkUser.public_metadata || {})}`);
    
    const clerkRole = clerkUser.public_metadata?.role;
    if (clerkRole) {
      console.log(`   ✅ Role in Clerk: ${clerkRole}`);
    } else {
      console.log(`   ⚠️  No role found in Clerk public_metadata`);
    }

    // Step 2: Check Convex User
    console.log('\n2️⃣ Checking Convex user...');
    const convexUser = await convex.query('users:getUserByClerkId', { 
      clerkId: clerkId.trim() 
    });

    if (convexUser) {
      console.log(`   ✅ User found: ${convexUser.email}`);
      console.log(`   Convex ID: ${convexUser._id}`);
    } else {
      console.log(`   ❌ User NOT found in Convex`);
      console.log(`   💡 User must sign up first before being made an admin`);
    }

    // Step 3: Check Admin Record in Convex
    console.log('\n3️⃣ Checking Convex admin record...');
    const admin = await convex.query('admins:getAdminByClerkId', { 
      clerkId: clerkId.trim() 
    });

    if (admin) {
      console.log(`   ✅ Admin record found`);
      console.log(`   Access Level: ${admin.accessLevel}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Became Admin At: ${new Date(admin.becameAdminAt).toLocaleString()}`);
    } else {
      console.log(`   ❌ Admin record NOT found in Convex`);
    }

    // Step 4: Verify consistency
    console.log('\n4️⃣ Verification Summary:');
    const checks = {
      'Clerk user exists': !!clerkUser,
      'Convex user exists': !!convexUser,
      'Admin record in Convex': !!admin,
      'Role set in Clerk': !!clerkRole,
      'Clerk role is valid': ['admin-full', 'admin-partial', 'admin-limited'].includes(clerkRole),
    };

    let allGood = true;
    for (const [check, passed] of Object.entries(checks)) {
      console.log(`   ${passed ? '✅' : '❌'} ${check}`);
      if (!passed) allGood = false;
    }

    // Step 5: Middleware test info
    console.log('\n5️⃣ Middleware will:');
    if (clerkRole && ['admin-full', 'admin-partial', 'admin-limited'].includes(clerkRole)) {
      console.log(`   ✅ ALLOW access (role: ${clerkRole})`);
    } else if (admin) {
      console.log(`   ✅ ALLOW access (found in Convex with ${admin.accessLevel})`);
    } else {
      console.log(`   ❌ DENY access (redirect to /dashboard)`);
    }

    console.log(`\n${allGood ? '✅ Configuration looks good!' : '❌ Configuration needs fixes'}\n`);

    if (!allGood) {
      console.log('💡 To set up admin, run:');
      console.log('   node scripts/add-admin.js\n');
    }

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

// Get Clerk ID from command line or prompt
const clerkId = process.argv[2];

if (!clerkId) {
  console.error('\n❌ Error: Clerk ID required');
  console.log('\nUsage: node scripts/verify-admin.js <clerk-id>\n');
  console.log('Example: node scripts/verify-admin.js user_1234567890\n');
  process.exit(1);
}

verifyAdmin(clerkId);
