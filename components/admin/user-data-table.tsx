'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { UserDisplayData } from '@/lib/user-management-utils';
import { SortState } from '@/lib/hooks/use-admin-users';
import Image from 'next/image';

interface UserDataTableProps {
  users: UserDisplayData[];
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  onDeleteUser: (user: UserDisplayData) => void;
  'aria-label'?: string;
}

interface SortableHeaderProps {
  field: string;
  label: string;
  currentSort: SortState;
  onSortChange: (sort: SortState) => void;
  className?: string;
}

function SortableHeader({ field, label, currentSort, onSortChange, className }: SortableHeaderProps) {
  const isActive = currentSort.field === field;
  const direction = isActive ? currentSort.direction : 'asc';
  
  const handleClick = () => {
    if (isActive) {
      // Toggle direction if same field
      onSortChange({
        field,
        direction: direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Set new field with default direction
      onSortChange({
        field,
        direction: 'asc',
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const sortStatus = isActive 
    ? `sorted ${direction === 'asc' ? 'ascending' : 'descending'}`
    : 'not sorted';

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="h-auto p-0 font-medium hover:bg-transparent focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label={`Sort by ${label}, currently ${sortStatus}`}
        aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        {label}
        {isActive ? (
          direction === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" aria-hidden="true" />
        )}
      </Button>
    </TableHead>
  );
}

function UserAvatar({ user }: { user: UserDisplayData }) {
  if (user.profilePictureUrl) {
    return (
      <Image
        src={user.profilePictureUrl}
        alt={`Profile picture of ${user.fullName}`}
        width={40}
        height={40}
        className="h-10 w-10 rounded-md object-cover"
      />
    );
  }

  return (
    <div
      className="h-10 w-10 rounded-md flex items-center justify-center text-white text-sm font-semibold"
      style={{ backgroundColor: 'oklch(0.5 0.134 242.749)' }}
      role="img"
      aria-label={`Avatar for ${user.fullName} with initials ${user.initials}`}
    >
      {user.initials}
    </div>
  );
}

function UserActionDropdown({ user, onDeleteUser }: { user: UserDisplayData; onDeleteUser: (user: UserDisplayData) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon-sm"
          aria-label={`Actions for ${user.fullName}`}
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Open actions menu for {user.fullName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label={`Actions for ${user.fullName}`}>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDeleteUser(user)}
          aria-label={`Delete user ${user.fullName}`}
        >
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserDataTable({ users, sort, onSortChange, onDeleteUser, 'aria-label': ariaLabel }: UserDataTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table 
        role="table" 
        aria-label={ariaLabel || `User management table with ${users.length} users`}
      >
        <TableHeader>
          <TableRow role="row">
            <SortableHeader
              field="name"
              label="User"
              currentSort={sort}
              onSortChange={onSortChange}
            />
            <SortableHeader
              field="email"
              label="Email"
              currentSort={sort}
              onSortChange={onSortChange}
            />
            <SortableHeader
              field="subscription"
              label="Subscription"
              currentSort={sort}
              onSortChange={onSortChange}
            />
            <SortableHeader
              field="currentPeriodEnd"
              label="End Date"
              currentSort={sort}
              onSortChange={onSortChange}
            />
            <SortableHeader
              field="createdAt"
              label="Created"
              currentSort={sort}
              onSortChange={onSortChange}
            />
            <TableHead className="w-[50px]" aria-label="Actions">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow 
              key={user.id} 
              role="row"
              aria-rowindex={index + 2} // +2 because header is row 1
            >
              <TableCell role="gridcell">
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} />
                  <span className="font-medium">{user.displayName}</span>
                </div>
              </TableCell>
              <TableCell role="gridcell" aria-label={`Email: ${user.email}`}>
                {user.email}
              </TableCell>
              <TableCell role="gridcell" aria-label={`Subscription: ${user.subscriptionPlan.displayName}`}>
                <span>{user.subscriptionPlan.displayName}</span>
              </TableCell>
              <TableCell role="gridcell" aria-label={`End date: ${user.currentPeriodEndFormatted || 'No end date'}`}>
                {user.currentPeriodEndFormatted || '-'}
              </TableCell>
              <TableCell role="gridcell" aria-label={`Account created: ${user.accountCreatedFormatted}`}>
                {user.accountCreatedFormatted}
              </TableCell>
              <TableCell role="gridcell">
                <UserActionDropdown user={user} onDeleteUser={onDeleteUser} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}