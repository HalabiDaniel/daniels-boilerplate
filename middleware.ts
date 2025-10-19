import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
    // Protect dashboard routes
    if (isProtectedRoute(req)) await auth.protect();
    
    // Protect admin routes with role verification
    if (isAdminRoute(req)) {
        const { userId, sessionClaims } = await auth();
        
        // First check: User must be authenticated
        if (!userId) {
            return NextResponse.redirect(new URL('/sign-in', req.url));
        }
        
        // Debug logging to understand session structure
        console.log('=== ADMIN ROUTE DEBUG ===');
        console.log('Full sessionClaims:', JSON.stringify(sessionClaims, null, 2));
        console.log('sessionClaims keys:', Object.keys(sessionClaims || {}));
        console.log('publicMetadata:', sessionClaims?.publicMetadata);
        console.log('metadata:', sessionClaims?.metadata);
        
        // Try to get role from Clerk session claims first
        let userRole = (sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role) as string | string[] | undefined;
        console.log('Role from Clerk session claims:', userRole);
        
        // If no role in session claims, check Convex database
        if (!userRole) {
            console.log('No role in session claims, checking Convex...');
            try {
                const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
                const admin = await convex.query((api as any).admins.getAdminByClerkId, {
                    clerkId: userId,
                });
                
                if (admin) {
                    // Map Convex accessLevel to Clerk-like role format for consistency
                    // Full Access = admin-full, Partial Access = admin-partial, Limited Access = admin-limited
                    const accessLevelMap: Record<string, string> = {
                        'Full Access': 'admin-full',
                        'Partial Access': 'admin-partial',
                        'Limited Access': 'admin-limited',
                    };
                    userRole = accessLevelMap[admin.accessLevel] || admin.accessLevel;
                    console.log('Found admin in Convex with accessLevel:', admin.accessLevel, '-> role:', userRole);
                } else {
                    console.log('User not found in Convex admins table');
                }
            } catch (err) {
                console.error('Error querying Convex:', err);
            }
        }
        
        // Normalize userRole to string for comparison
        // Handle both string and array formats (role can be stored as array in Clerk metadata)
        let normalizedRole: string | undefined;
        if (Array.isArray(userRole)) {
            // If it's an array, get the first admin role
            normalizedRole = userRole.find(role => 
                role === 'admin-full' || role === 'admin-partial' || role === 'admin-limited'
            );
        } else if (typeof userRole === 'string') {
            normalizedRole = userRole;
        }
        
        console.log('Normalized role:', normalizedRole);
        
        // Check if user has admin role
        const hasAdminRole = Boolean(
            normalizedRole && (
                normalizedRole === 'admin-full' ||
                normalizedRole === 'admin-partial' ||
                normalizedRole === 'admin-limited'
            )
        );

        if (!hasAdminRole) {
            console.log('Admin access denied - no admin role found', {
                userId,
                userRole,
                normalizedRole,
                publicMetadata: sessionClaims?.publicMetadata,
            });
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        
        console.log('Admin access granted', {
            userId,
            normalizedRole
        });
    }
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
