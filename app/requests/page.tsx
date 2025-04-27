'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '@/hooks/use-api';
import { API_PATHS } from '@/constants/api-paths';
import toast from 'react-hot-toast';
import UserCard from '@/components/general/feed/UserCard';

interface RequestUser {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  photoUrl: string;
  about: string;
  skills: string[];
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { get, post } = useApi();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await get(API_PATHS.USER_REQUESTS);
        setRequests(data.connectionRequests || []);
      } catch (error) {
        toast.error('Failed to load requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const reviewRequest = async (
    userId: string,
    status: 'accepted' | 'rejected'
  ) => {
    try {
      await post(`${API_PATHS.REVIEW_USER_REQUEST}/${status}/${userId}`);
      toast.success(
        `Request ${status === 'accepted' ? 'accepted' : 'rejected'}`
      );
      setRequests((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error(
        `Failed to ${status === 'accepted' ? 'accept' : 'reject'} request`
      );
    }
  };

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        Loading requests...
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        No requests found.
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-3xl font-bold mb-8'>User Requests</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {requests.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <UserCard
                user={user?.fromUserId}
                onIgnore={() => reviewRequest(user._id, 'rejected')}
                onInterested={() => reviewRequest(user._id, 'accepted')}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
