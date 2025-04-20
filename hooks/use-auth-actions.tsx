'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { API_PATHS } from '@/constants/api-paths';
import { useDispatch } from 'react-redux';
import { addUser } from '@/utils/userSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { post, get } = useApi();
  const dispatch = useDispatch();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await post(API_PATHS.LOGIN, {
        emailId: email,
        password,
      });

      toast.success('Logged in successfully!');

      const userData = response.user;
      dispatch(addUser(userData));
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await get(API_PATHS.LOGOUT);
      toast.success('Logged out successfully!');
      router.push('/login');
      dispatch(addUser(null));
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    logout,
    isLoading,
  };
}
