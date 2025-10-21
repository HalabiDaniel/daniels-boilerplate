'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { UserDisplayData } from '@/lib/user-management-utils';
import { OperationStatus } from '@/components/admin/loading-states';

interface DeleteUserDialogProps {
  user: UserDisplayData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: UserDisplayData) => Promise<void>;
}

export function DeleteUserDialog({ user, open, onOpenChange, onConfirm }: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<Error | null>(null);

  const handleConfirm = async () => {
    if (!user) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await onConfirm(user);
      onOpenChange(false);
    } catch (error) {
      // Store error for display in dialog
      setDeleteError(error instanceof Error ? error : new Error('Delete operation failed'));
      console.error('Delete user error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      setDeleteError(null);
      onOpenChange(false);
    }
  };

  const handleRetry = () => {
    setDeleteError(null);
    handleConfirm();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            Delete User Account
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to permanently delete{' '}
            <span className="font-semibold text-foreground">{user.fullName}</span>&apos;s account?
          </DialogDescription>
        </DialogHeader>

        {/* Operation Status */}
        {(isDeleting || deleteError) && (
          <div className="px-6 pb-4">
            <OperationStatus
              isLoading={isDeleting}
              error={deleteError}
              loadingText="Deleting user from all systems..."
              onRetry={handleRetry}
            />
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
            aria-label="Cancel deletion and close dialog"
            className="px-6 py-3 h-11 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            aria-label={isDeleting ? `Deleting ${user.fullName}...` : `Confirm deletion of ${user.fullName}`}
            className="px-6 py-3 h-11 text-sm font-medium"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                <span>Deleting user...</span>
              </>
            ) : (
              'Delete User'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}