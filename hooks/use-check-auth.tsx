'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/use-api';
import { API_PATHS } from '@/constants/api-paths';
import { useDispatch } from 'react-redux';
import { addUser } from '@/utils/userSlice';

export function useCheckAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { get } = useApi();
  const dispatch = useDispatch();

  const checkAuth = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // First check localStorage for quick hydration
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        dispatch(addUser(parsedUser));
      }

      // Then verify with the API
      const userData = await get(API_PATHS.ME);
      if (userData) {
        setUser(userData);
        dispatch(addUser(userData));
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      // Clear invalid credentials
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        localStorage.removeItem('user');
        setUser(null);
        dispatch(addUser(null));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    isLoading,
    checkAuth, // Optional: expose for manual re-checking
  };
}
