import React from 'react';
import { signOut } from 'next-auth/react';
import { AlertDialog } from '@/app/ui/AlertDialog';
import { Reset } from '@radix-ui/themes';
import { LogOut } from 'lucide-react';

export default function LogoutLink() {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  return (
    <AlertDialog
      title="Logout"
      open={isAlertOpen}
      color="ruby"
      trigger={
        <Reset>
          <button
            onClick={() => setIsAlertOpen(true)}
            className="flex items-center gap-2"
          >
            <LogOut size={15} />
            Log out
          </button>
        </Reset>
      }
      actionText="Yes, log out"
      cancelText="No, stay in the app"
      onCancel={() => setIsAlertOpen(false)}
      onAction={() => signOut({ callbackUrl: '/login' })}
    >
      Are you sure you want to log out?
    </AlertDialog>
  );
}
