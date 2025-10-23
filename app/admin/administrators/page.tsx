'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronDown, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { AccessControlWrapper } from '@/components/admin/access-control-wrapper';
import { toast } from 'sonner';
import { formatAccountCreatedDate, formatBecameAdminDate } from '@/lib/date-utils';

const ACCESS_LEVEL_IMAGES = {
  "Full Access": "https://res.cloudinary.com/dbactyzwl/image/upload/v1760829597/Untitled_design_4_tkhskv.png",
  "Partial Access": "https://res.cloudinary.com/dbactyzwl/image/upload/v1760829597/Untitled_design_5_mgoqws.png",
  "Limited Access": "https://res.cloudinary.com/dbactyzwl/image/upload/v1760829597/Untitled_design_6_hb4omx.png"
};

type AccessLevel = "Full Access" | "Partial Access" | "Limited Access";

// Helper function to get user initials
function getUserInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Helper function to format name as "First Name + Last Name Initial"
function formatDisplayName(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    const firstName = parts[0];
    const lastNameInitial = parts[parts.length - 1][0].toUpperCase() + '.';
    return `${firstName} ${lastNameInitial}`;
  }
  return name;
}

export default function AdministratorsPage() {
  const { user } = useUser();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<{ id: Id<"admins">, name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Fetch all admins
  const admins = useQuery(api.admins.getAllAdmins);
  
  // Check for error state (null means query failed)
  const hasError = admins === null;
  const isLoading = admins === undefined;

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
    window.location.reload();
  };
  
  // Mutations
  const updateAdminAccessLevel = useMutation(api.admins.updateAdminAccessLevel);
  const deleteAdmin = useMutation(api.admins.deleteAdmin);

  const handleAccessLevelChange = async (adminId: Id<"admins">, newAccessLevel: AccessLevel) => {
    if (!user?.id) return;
    
    setIsUpdating(true);
    const admin = admins?.find(a => a._id === adminId);
    const adminName = admin?.name || 'Administrator';
    
    try {
      await updateAdminAccessLevel({
        adminId,
        newAccessLevel,
        currentUserClerkId: user.id,
      });

      // Call API route to update Clerk role
      let clerkSyncSuccess = true;
      if (admin) {
        try {
          const response = await fetch('/api/admin/update-role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              targetUserId: admin.clerkId,
              accessLevel: newAccessLevel
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Clerk sync error:', errorData);
            clerkSyncSuccess = false;
            
            // Show warning but don't fail the whole operation
            toast.warning('Partial update', {
              description: `Access level updated in database, but failed to sync with Clerk: ${errorData.error || 'Unknown error'}`
            });
          }
        } catch (clerkError) {
          console.error('Clerk sync failed:', clerkError);
          clerkSyncSuccess = false;
          
          toast.warning('Partial update', {
            description: 'Access level updated in database, but failed to sync with Clerk. The user may need to sign out and back in.'
          });
        }
      }

      if (clerkSyncSuccess) {
        toast.success('Access level updated', {
          description: `${adminName}'s access level has been changed to ${newAccessLevel}.`
        });
      }
    } catch (error) {
      console.error('Failed to update access level:', error);
      
      if (error instanceof Error && error.message.includes('Cannot modify your own access level')) {
        toast.warning('Action not allowed', {
          description: 'You cannot modify your own access level.'
        });
      } else {
        toast.error('Failed to update access level', {
          description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (adminId: Id<"admins">, adminName: string) => {
    setAdminToDelete({ id: adminId, name: adminName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete || !user?.id) return;
    
    setIsDeleting(true);
    const adminName = adminToDelete.name;
    
    try {
      await deleteAdmin({
        adminId: adminToDelete.id,
        currentUserClerkId: user.id,
      });

      // Call API route to remove Clerk role
      const admin = admins?.find(a => a._id === adminToDelete.id);
      if (admin) {
        const response = await fetch('/api/admin/update-role', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetUserId: admin.clerkId
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Clerk sync error:', errorData);
          throw new Error(errorData.error || 'Failed to remove role from Clerk');
        }
      }

      toast.success('Administrator removed', {
        description: `${adminName} has been removed as an administrator.`
      });

      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    } catch (error) {
      console.error('Failed to delete admin:', error);
      
      if (error instanceof Error && error.message.includes('Cannot delete your own admin account')) {
        toast.warning('Action not allowed', {
          description: 'You cannot delete your own admin account.'
        });
      } else if (error instanceof Error && error.message.includes('Cannot delete the last Full Access administrator')) {
        toast.warning('Action not allowed', {
          description: 'Cannot delete the last Full Access administrator. At least one Full Access admin must remain.'
        });
      } else {
        toast.error('Failed to delete administrator', {
          description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
        });
      }
      
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AccessControlWrapper requiredPage="/admin/administrators">
      <div>
        <h1 className="text-3xl font-semibold mb-6" style={{ letterSpacing: '-1px' }}>
          Administrators
        </h1>
        <p className="text-muted-foreground mb-8">
          Manage administrator accounts and access levels
        </p>

        {isLoading && (
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading administrators...</p>
            </div>
          </div>
        )}

        {hasError && (
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <div className="space-y-2">
                <p className="text-lg font-semibold">Failed to load administrators</p>
                <p className="text-sm text-muted-foreground">
                  There was an error loading the administrator list. Please try again.
                </p>
              </div>
              <Button onClick={handleRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {!isLoading && !hasError && admins && admins.length === 0 && (
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">No administrators found</p>
              <p className="text-sm text-muted-foreground">
                There are currently no administrators in the system.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !hasError && admins && admins.length > 0 && (
        <>
          {/* Desktop Table View - Hidden on mobile/tablet */}
          <div className="hidden lg:block border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Account Created</TableHead>
                  <TableHead>Became Admin</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => {
                const isCurrentUser = admin.clerkId === user?.id;
                
                return (
                  <TableRow key={admin._id}>
                    <TableCell>
                      <span className="font-medium">{formatDisplayName(admin.name)}</span>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Image
                          src={ACCESS_LEVEL_IMAGES[admin.accessLevel as AccessLevel]}
                          alt={admin.accessLevel}
                          width={20}
                          height={20}
                        />
                        <span>{admin.accessLevel}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatAccountCreatedDate(admin.accountCreatedAt)}</TableCell>
                    <TableCell>{formatBecameAdminDate(admin.becameAdminAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={isCurrentUser || isUpdating}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Edit access level
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => handleAccessLevelChange(admin._id, "Full Access")}
                                disabled={admin.accessLevel === "Full Access"}
                              >
                                Full Access
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAccessLevelChange(admin._id, "Partial Access")}
                                disabled={admin.accessLevel === "Partial Access"}
                              >
                                Partial Access
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAccessLevelChange(admin._id, "Limited Access")}
                                disabled={admin.accessLevel === "Limited Access"}
                              >
                                Limited Access
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(admin._id, admin.name)}
                          >
                            Delete admin
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile/Tablet Accordion View - Hidden on desktop */}
          <div className="lg:hidden border rounded-lg">
            <Accordion type="single" collapsible className="w-full">
              {admins.map((admin) => {
                const isCurrentUser = admin.clerkId === user?.id;
                
                return (
                  <AccordionItem key={admin._id} value={admin._id} className="border-b last:border-b-0">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex flex-col items-start text-left flex-1 min-w-0">
                          <span className="font-medium text-sm truncate w-full">{admin.email}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Name</p>
                          <p className="text-sm font-medium">{admin.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Access Level</p>
                          <div className="flex items-center gap-2">
                            <Image
                              src={ACCESS_LEVEL_IMAGES[admin.accessLevel as AccessLevel]}
                              alt={admin.accessLevel}
                              width={20}
                              height={20}
                            />
                            <span className="text-sm">{admin.accessLevel}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Account Created</p>
                          <p className="text-sm">{formatAccountCreatedDate(admin.accountCreatedAt)}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Became Admin</p>
                          <p className="text-sm">{formatBecameAdminDate(admin.becameAdminAt)}</p>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                disabled={isCurrentUser || isUpdating}
                              >
                                Edit Access Level
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                              <DropdownMenuItem
                                onClick={() => handleAccessLevelChange(admin._id, "Full Access")}
                                disabled={admin.accessLevel === "Full Access"}
                              >
                                Full Access
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAccessLevelChange(admin._id, "Partial Access")}
                                disabled={admin.accessLevel === "Partial Access"}
                              >
                                Partial Access
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAccessLevelChange(admin._id, "Limited Access")}
                                disabled={admin.accessLevel === "Limited Access"}
                              >
                                Limited Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(admin._id, admin.name)}
                            disabled={isCurrentUser || isUpdating}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </>
        )}

        {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Administrator</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {adminToDelete?.name} as an administrator? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AccessControlWrapper>
  );
}
