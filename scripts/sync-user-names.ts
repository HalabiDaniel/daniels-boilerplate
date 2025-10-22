/**
 * Script to sync user names from Clerk to Convex
 * 
 * This script fetches all users from Clerk, combines their firstName and lastName,
 * and updates the name field in Convex for all existing users.
 * 
 * Run with: npx tsx scripts/sync-user-names.ts
 */

import { clerkClient } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

async function syncUserNames() {
  console.log('Starting user name sync...\n');

  // Initialize clients
  const clerk = await clerkClient();
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  try {
    // Fetch all users from Clerk
    console.log('Fetching users from Clerk...');
    const clerkUsers = await clerk.users.getUserList({ limit: 500 });
    console.log(`Found ${clerkUsers.data.length} users in Clerk\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process each user
    for (const clerkUser of clerkUsers.data) {
      const clerkId = clerkUser.id;
      const email = clerkUser.emailAddresses?.[0]?.emailAddress;
      const firstName = clerkUser.firstName;
      const lastName = clerkUser.lastName;
      
      // Combine first and last name
      const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || undefined;

      if (!email) {
        console.log(`⚠️  Skipping user ${clerkId} - no email found`);
        skippedCount++;
        continue;
      }

      try {
        // Check if user exists in Convex
        const convexUser = await convex.query((api as any).users.getUserByClerkId, {
          clerkId,
        });

        if (!convexUser) {
          console.log(`⚠️  User ${clerkId} (${email}) not found in Convex - skipping`);
          skippedCount++;
          continue;
        }

        // Update user with full name
        await convex.mutation((api as any).users.upsertUser, {
          clerkId,
          email,
          name: fullName,
        });

        console.log(`✓ Updated ${email}: "${fullName || '(no name)'}"`);
        updatedCount++;
      } catch (error) {
        console.error(`✗ Error updating user ${clerkId} (${email}):`, error);
        errorCount++;
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('Sync completed!');
    console.log(`✓ Updated: ${updatedCount}`);
    console.log(`⚠️  Skipped: ${skippedCount}`);
    console.log(`✗ Errors: ${errorCount}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Fatal error during sync:', error);
    process.exit(1);
  }
}

// Run the script
syncUserNames()
  .then(() => {
    console.log('\nScript finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nScript failed:', error);
    process.exit(1);
  });
