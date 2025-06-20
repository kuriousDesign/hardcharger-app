'use client';

//import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { PlayerClientType } from '@/models/Player';
//import { toast } from 'sonner';
//import { getLinks } from '@/lib/link-urls';
import { cn } from '@/lib/utils';
import { postSignOut } from '@/actions/userActions';

interface UserButtonProps {
  player: PlayerClientType;
}

export function UserButton({ player }: UserButtonProps) {
  const isAdmin = player.role === 'ADMIN';

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : names[0][0];
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await postSignOut(); // Assuming postSignOut is defined in userActions

      //toast.success('Signed out successfully');
      // force reload to ensure session is cleared
      //router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
      //router.refresh(); // Force reload to clear session
      // refresh the entire app
      window.location.reload();
      //toast.error('Failed to sign out');
    }
  };

  // Menu items
  const menuItems = [
    //{ label: 'Dashboard', href: getLinks().getDashboardUrl(), action: () => router.push(getLinks().getDashboardUrl()) },
    //...(isAdmin ? [{ label: 'Admin', href: getLinks().getAdminUrl(), action: () => router.push(getLinks().getAdminUrl()) }] : []),
    { label: 'Sign out', href: null, action: handleSignOut },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'relative rounded-full p-0 h-10 w-10 hover:bg-transparent hover:opacity-80 transition',
            isAdmin && 'before:absolute before:inset-0 before:rounded-full before:animate-pulse before:bg-blue-500/20 before:-z-10 ring-2 ring-blue-500'
          )}
          aria-label={`${player.name || 'User'}'s profile menu`}
        >
          <Avatar className="size-7">
            <AvatarImage src={player.image || ''} alt={`${player.name || 'User'}'s avatar`} />
            <AvatarFallback className="bg-secondary text-seondary-foreground">
              {getInitials(player.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        <ul className="flex flex-col">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Button
                variant="ghost"
                className="w-full text-left justify-start text-sm text-gray-700 hover:bg-gray-100 rounded-md px-4 py-2"
                onClick={item.action}
                role="menuitem"
              >
                {item.label}
              </Button>
            </li>
          ))}
        </ul>

      </PopoverContent>
    </Popover>
  );
}