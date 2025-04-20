export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';

export const axiosConfig = {
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};
