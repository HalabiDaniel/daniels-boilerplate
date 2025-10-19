import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

/**
 * POST /api/admin/update-role
 * Updates a Clerk user's admin role based on access level
 * Requires Full Access admin authentication
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate the requesting user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize Convex client to check admin status
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    
    // Verify the requesting user is a Full Access admin
    const adminCheck = await convex.query(api.admins.isAdmin, {
      clerkId: userId,
    });
    
    if (!adminCheck.isAdmin || adminCheck.accessLevel !== 'Full Access') {
      return NextResponse.json(
        { error: 'Forbidden: Only Full Access admins can update roles' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { targetUserId, accessLevel } = body;

    // Validate required fields
    if (!targetUserId || !accessLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: targetUserId and accessLevel' },
        { status: 400 }
      );
    }

    // Validate access level
    const validAccessLevels = ['Full Access', 'Partial Access', 'Limited Access'];
    if (!validAccessLevels.includes(accessLevel)) {
      return NextResponse.json(
        { error: 'Invalid access level. Must be: Full Access, Partial Access, or Limited Access' },
        { status: 400 }
      );
    }

    // Map access level to Clerk role
    const roleMap: Record<string, string> = {
      'Full Access': 'admin-full',
      'Partial Access': 'admin-partial',
      'Limited Access': 'admin-limited',
    };
    
    const newRole = roleMap[accessLevel];

    // Get the Clerk client
    const client = await clerkClient();

    // Get current user to check existing roles
    const targetUser = await client.users.getUser(targetUserId);
    
    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found in Clerk' },
        { status: 404 }
      );
    }

    // Remove all existing admin roles
    const existingAdminRoles = ['admin-full', 'admin-partial', 'admin-limited'];
    
    // Handle role as either string, array, or undefined
    let currentRoles: string[] = [];
    const roleMetadata = targetUser.publicMetadata?.role;
    
    if (Array.isArray(roleMetadata)) {
      currentRoles = roleMetadata;
    } else if (typeof roleMetadata === 'string') {
      currentRoles = [roleMetadata];
    }
    
    const rolesToRemove = currentRoles.filter(role => existingAdminRoles.includes(role));

    // Update user's public metadata with new role (store as string, not array)
    const nonAdminRoles = currentRoles.filter(role => !existingAdminRoles.includes(role));

    await client.users.updateUser(targetUserId, {
      publicMetadata: {
        ...targetUser.publicMetadata,
        role: newRole,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Role updated to ${accessLevel}`,
      previousRoles: rolesToRemove,
      newRole,
    });

  } catch (error) {
    console.error('Error updating Clerk role:', error);
    
    // Handle specific Clerk API errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to update role: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/update-role
 * Removes all admin roles from a Clerk user
 * Requires Full Access admin authentication
 */
export async function DELETE(req: NextRequest) {
  try {
    // Authenticate the requesting user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize Convex client to check admin status
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    
    // Verify the requesting user is a Full Access admin
    const adminCheck = await convex.query(api.admins.isAdmin, {
      clerkId: userId,
    });
    
    if (!adminCheck.isAdmin || adminCheck.accessLevel !== 'Full Access') {
      return NextResponse.json(
        { error: 'Forbidden: Only Full Access admins can remove admin roles' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { targetUserId } = body;

    // Validate required fields
    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Missing required field: targetUserId' },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (targetUserId === userId) {
      return NextResponse.json(
        { error: 'Cannot remove your own admin roles' },
        { status: 403 }
      );
    }

    // Get the Clerk client
    const client = await clerkClient();

    // Get current user to check existing roles
    const targetUser = await client.users.getUser(targetUserId);
    
    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found in Clerk' },
        { status: 404 }
      );
    }

    // Remove all admin roles
    const existingAdminRoles = ['admin-full', 'admin-partial', 'admin-limited'];
    
    // Handle role as either string, array, or undefined
    let currentRoles: string[] = [];
    const roleMetadata = targetUser.publicMetadata?.role;
    
    if (Array.isArray(roleMetadata)) {
      currentRoles = roleMetadata;
    } else if (typeof roleMetadata === 'string') {
      currentRoles = [roleMetadata];
    }
    
    const removedRoles = currentRoles.filter(role => existingAdminRoles.includes(role));
    const updatedRoles = currentRoles.filter(role => !existingAdminRoles.includes(role));

    // Update user's public metadata without admin roles
    // If there are other roles, keep them as a string or array as appropriate
    const roleValue = updatedRoles.length === 1 ? updatedRoles[0] : (updatedRoles.length > 1 ? updatedRoles : undefined);
    
    await client.users.updateUser(targetUserId, {
      publicMetadata: {
        ...targetUser.publicMetadata,
        role: roleValue,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin roles removed successfully',
      removedRoles,
    });

  } catch (error) {
    console.error('Error removing Clerk admin roles:', error);
    
    // Handle specific Clerk API errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to remove admin roles: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
