'use client';

import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/axios-config';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
    withCredentials: true,
  });

  // Add request interceptor to include auth token
  api.interceptors.request.use(
    (config) => {
      // Get token from localStorage in client-side
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle errors globally
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        // Handle specific error responses here
        if (error.response.status === 401) {
          // Handle unauthorized access

          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            router.push('/login');
          }
        } else if (error.response.status === 403) {
          // Handle forbidden access

          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            router.push('/');
          }
        }
      } else {
        console.error('Network error or timeout', error);
      }
      return Promise.reject(error);
    }
  );

  const get = async (url: string, params = {}) => {
    setIsLoading(true);
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const post = async (url: string, data = {}, config = {}) => {
    setIsLoading(true);
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const put = async (url: string, data = {}) => {
    setIsLoading(true);
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const patch = async (url: string, data = {}, config = {}) => {
    setIsLoading(true);
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const del = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    get,
    post,
    put,
    patch,
    del,
    isLoading,
  };
}
