/**
 * Admin Access Control Utilities
 * 
 * This module provides helper functions to check page access permissions
 * based on admin access levels (Full Access, Partial Access, Limited Access).
 */

export type AccessLevel = "Full Access" | "Partial Access" | "Limited Access";

export type AdminPage = 
  | "/admin"
  | "/admin/users"
  | "/admin/subscriptions"
  | "/admin/analytics"
  | "/admin/administrators"
  | "/admin/settings";

/**
 * Permission matrix defining which access levels can access which pages
 * Based on requirements 2.3, 2.4, 2.5
 */
const PERMISSION_MATRIX: Record<AdminPage, AccessLevel[]> = {
  "/admin": ["Full Access", "Partial Access", "Limited Access"],
  "/admin/users": ["Full Access", "Partial Access", "Limited Access"],
  "/admin/subscriptions": ["Full Access", "Partial Access"],
  "/admin/analytics": ["Full Access", "Partial Access", "Limited Access"],
  "/admin/administrators": ["Full Access"],
  "/admin/settings": ["Full Access", "Partial Access"],
};

/**
 * Check if an admin with a given access level can access a specific page
 * 
 * @param accessLevel - The admin's access level
 * @param page - The page path to check
 * @returns true if the admin can access the page, false otherwise
 */
export function canAccessPage(
  accessLevel: AccessLevel | null | undefined,
  page: AdminPage
): boolean {
  if (!accessLevel) return false;
  
  const allowedLevels = PERMISSION_MATRIX[page];
  return allowedLevels.includes(accessLevel);
}

/**
 * Get all pages that an admin with a given access level can access
 * 
 * @param accessLevel - The admin's access level
 * @returns Array of page paths the admin can access
 */
export function getAccessiblePages(
  accessLevel: AccessLevel | null | undefined
): AdminPage[] {
  if (!accessLevel) return [];
  
  return (Object.keys(PERMISSION_MATRIX) as AdminPage[]).filter((page) =>
    PERMISSION_MATRIX[page].includes(accessLevel)
  );
}

/**
 * Check if an admin has full access (highest permission level)
 * 
 * @param accessLevel - The admin's access level
 * @returns true if the admin has Full Access
 */
export function hasFullAccess(
  accessLevel: AccessLevel | null | undefined
): boolean {
  return accessLevel === "Full Access";
}

/**
 * Check if an admin has at least partial access
 * 
 * @param accessLevel - The admin's access level
 * @returns true if the admin has Full or Partial Access
 */
export function hasPartialAccessOrHigher(
  accessLevel: AccessLevel | null | undefined
): boolean {
  return accessLevel === "Full Access" || accessLevel === "Partial Access";
}

/**
 * Get a user-friendly error message for unauthorized access
 * 
 * @param accessLevel - The admin's access level
 * @param page - The page they attempted to access
 * @returns Error message string
 */
export function getUnauthorizedMessage(
  accessLevel: AccessLevel | null | undefined,
  page: AdminPage
): string {
  if (!accessLevel) {
    return "You do not have admin access to view this page.";
  }
  
  const requiredLevels = PERMISSION_MATRIX[page];
  const highestRequired = requiredLevels[0]; // First in array is typically highest
  
  return `Your ${accessLevel} level does not have permission to access this page. ${highestRequired} is required.`;
}

/**
 * Navigation item configuration with access level requirements
 */
export interface AdminNavItem {
  name: string;
  href: AdminPage;
  minAccessLevel: AccessLevel;
}

/**
 * Filter navigation items based on admin access level
 * 
 * @param items - Array of navigation items
 * @param accessLevel - The admin's access level
 * @returns Filtered array of navigation items the admin can access
 */
export function filterNavItemsByAccess(
  items: AdminNavItem[],
  accessLevel: AccessLevel | null | undefined
): AdminNavItem[] {
  if (!accessLevel) return [];
  
  return items.filter((item) => canAccessPage(accessLevel, item.href));
}
