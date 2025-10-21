'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { UserDisplayData } from '@/lib/user-management-utils';
import Image from 'next/image';

interface UserAccordionListProps {
  users: UserDisplayData[];
  onDeleteUser: (user: UserDisplayData) => void;
  'aria-label'?: string;
}

function UserAvatar({ user }: { user: UserDisplayData }) {
  if (user.profilePictureUrl) {
    return (
      <Image
        src={user.profilePictureUrl}
        alt={`Profile picture of ${user.fullName}`}
        width={40}
        height={40}
        className="h-10 w-10 rounded-md object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div
      className="h-10 w-10 rounded-md flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
      style={{ backgroundColor: 'oklch(0.5 0.134 242.749)' }}
      role="img"
      aria-label={`Avatar for ${user.fullName} with initials ${user.initials}`}
    >
      {user.initials}
    </div>
  );
}


export function UserAccordionList({ users, onDeleteUser, 'aria-label': ariaLabel }: UserAccordionListProps) {
  // Users are already sorted by the parent component via the hook
  // No need to sort again here since sorting is handled centrally

  return (
    <div 
      className="border rounded-lg"
      role="region"
      aria-label={ariaLabel || `User management list with ${users.length} users`}
    >
      <Accordion type="single" collapsible className="w-full">
        {users.map((user) => (
          <AccordionItem 
            key={user.id} 
            value={user.id} 
            className="border-b last:border-b-0"
          >
            <AccordionTrigger 
              className="px-4 py-3 hover:no-underline focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={`View details for ${user.fullName}, ${user.email}`}
            >
              <div className="flex items-center gap-3 w-full">
                <UserAvatar user={user} />
                <div className="flex flex-col items-start text-left flex-1 min-w-0">
                  <span className="font-medium text-sm truncate w-full">{user.email}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-3" role="group" aria-labelledby={`user-${user.id}-details`}>
                <h3 id={`user-${user.id}-details`} className="sr-only">
                  Details for {user.fullName}
                </h3>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1" id={`user-${user.id}-name-label`}>
                    Name
                  </p>
                  <p className="text-sm font-medium" aria-labelledby={`user-${user.id}-name-label`}>
                    {user.fullName}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1" id={`user-${user.id}-subscription-label`}>
                    Subscription
                  </p>
                  <p className="text-sm" aria-labelledby={`user-${user.id}-subscription-label`}>
                    {user.subscriptionPlan.displayName}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1" id={`user-${user.id}-enddate-label`}>
                    End Date
                  </p>
                  <p className="text-sm" aria-labelledby={`user-${user.id}-enddate-label`}>
                    {user.currentPeriodEndFormatted || 'No end date'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1" id={`user-${user.id}-created-label`}>
                    Account Created
                  </p>
                  <p className="text-sm" aria-labelledby={`user-${user.id}-created-label`}>
                    {user.accountCreatedFormatted}
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteUser(user)}
                    className="w-full focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                    aria-label={`Delete user ${user.fullName}`}
                  >
                    Delete User
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}