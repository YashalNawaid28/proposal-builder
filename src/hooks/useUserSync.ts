import { useEffect, useCallback } from 'react';
import { useUser } from '@stackframe/stack';

export function useUserSync() {
  const user = useUser();

  const syncUser = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to sync user:', errorData.error);
        return;
      }

      const data = await response.json();
      console.log('User synced successfully:', data.message);
    } catch (error) {
      console.error('Error syncing user:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      syncUser();
    }
  }, [user, syncUser]);

  return { syncUser };
} 