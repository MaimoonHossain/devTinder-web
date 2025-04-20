// In layout.tsx or _app.tsx (wherever you bootstrap the app)
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@/utils/userSlice';
import axios from 'axios';
import { API_PATHS } from '@/constants/api-paths';
import { useApi } from '@/hooks/use-api';

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const user = useSelector((state: { user: any }) => state.user);
  const { get } = useApi();

  const fetchUser = async () => {
    try {
      const res = await get(API_PATHS.USER_PROFILE);
      dispatch(addUser(res));
    } catch (error) {
      console.log('Error fetching user:', error);
    }
  };

  useEffect(() => {
    if (user) return;
    fetchUser();
  }, []);

  return children;
}
