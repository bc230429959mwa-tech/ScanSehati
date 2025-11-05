import { useState, useEffect, useCallback } from 'react';

interface UserItem {
    username: string;
    fullName: string;
}

type TargetRole = "doctor" | "pharmacist";

export const useUserList = (targetRole: TargetRole) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the new reusable API endpoint
      const response = await fetch(`/api/users/list?role=${targetRole}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${targetRole}s. Status: ${response.status}`);
      }
      
      const data: UserItem[] = await response.json();
      setUsers(data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [targetRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refresh: fetchUsers };
};