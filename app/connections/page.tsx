'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '@/hooks/use-api';
import { API_PATHS } from '@/constants/api-paths';
import toast from 'react-hot-toast';
import UserCard from '@/components/general/feed/UserCard';

interface Connection {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  photoUrl: string;
  about: string;
  skills: string[];
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { get } = useApi();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await get(API_PATHS.USER_CONNECTIONS);
        setConnections(data.filteredConnections || []);
      } catch (error) {
        toast.error('Failed to load connections');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, []);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        Loading connections...
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        No connections found.
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
        <h1 className='text-3xl font-bold mb-8'>Your Connections</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {connections.map((connection) => (
            <motion.div
              key={connection._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Reuse UserCard, but no actions */}
              <UserCard user={connection} hideActions={true} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
