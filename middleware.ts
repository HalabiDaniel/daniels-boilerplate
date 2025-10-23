import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// Add security headers to response
function addSecurityHeaders(response: NextResponse) {
    // Prevent clickjacking attacks
    response.headers.set('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection (legacy, but still useful for older browsers)
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Control referrer information
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy (replace Feature Policy)
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    return response;
}

export default clerkMiddleware(async (auth, req) => {
    // Create a NextResponse to potentially add headers to
    let response = NextResponse.next();
    
    // Protect dashboard routes
    if (isProtectedRoute(req)) await auth.protect();

    // Protect admin routes with role verification
    if (isAdminRoute(req)) {
        const { userId, sessionClaims } = await auth();

        // First check: User must be authenticated
        if (!userId) {
            response = NextResponse.redirect(new URL('/sign-in', req.url));
            return addSecurityHeaders(response);
        }

        // Try to get role from Clerk session claims first
        let userRole = ((sessionClaims?.publicMetadata as any)?.role || (sessionClaims?.metadata as any)?.role) as string | string[] | undefined;

        // If no role in session claims, check Convex database
        if (!userRole) {
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

        // Check if user has admin role
        const hasAdminRole = Boolean(
            normalizedRole && (
                normalizedRole === 'admin-full' ||
                normalizedRole === 'admin-partial' ||
                normalizedRole === 'admin-limited'
            )
        );

        if (!hasAdminRole) {
            response = NextResponse.redirect(new URL('/dashboard', req.url));
            return addSecurityHeaders(response);
        }
    }
    
    // Add security headers to all responses
    return addSecurityHeaders(response);
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
