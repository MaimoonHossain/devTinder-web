'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { API_PATHS } from '@/constants/api-paths';
import UserCard from '@/components/general/feed/UserCard';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  photoUrl: string;
  about: string;
  skills: string[];
}

export default function Home() {
  const { get, post } = useApi();
  const [users, setUsers] = useState<User[]>([]);

  const fetchFeed = async () => {
    try {
      const data = await get(API_PATHS.USER_FEED);
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const reviewUser = async (
    userId: string,
    status: 'interested' | 'ignored'
  ) => {
    try {
      await post(`${API_PATHS.SEND_CONNECTION_REQUEST}/${status}/${userId}`);
      toast.success(
        `User ${status === 'interested' ? 'interested' : 'ignored'}`
      );
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error(
        `Failed to ${status === 'interested' ? 'send request' : 'ignore user'}`
      );
    }
  };

  if (users.length === 0) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        No users found.
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      <h1 className='text-3xl font-bold mb-8'>User Feed</h1>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onInterested={() => reviewUser(user._id, 'interested')}
            onIgnore={() => reviewUser(user._id, 'ignored')}
          />
        ))}
      </div>
    </div>
  );
}
