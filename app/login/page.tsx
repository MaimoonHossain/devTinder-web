'use client';

import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthActions } from '@/hooks/use-auth-actions';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await login(values.email, values.password);
        router.push('/');
      } catch (error) {
        toast.error('Failed to login. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className='container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)]'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className='space-y-4'>
              <FormField
                name='email'
                label='Email'
                type='email'
                placeholder='Enter your email'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
              />
              <FormField
                name='password'
                label='Password'
                type='password'
                placeholder='Enter your password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
              />
            </form>
          </CardContent>
          <CardFooter>
            <Button
              className='w-full'
              onClick={() => formik.handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
