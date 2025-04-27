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
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { API_PATHS } from '@/constants/api-paths';
import { useApi } from '@/hooks/use-api';
import { addUser } from '@/utils/userSlice';
import { useDispatch } from 'react-redux';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, 'First Name must be at least 3 characters')
    .max(10, 'First Name must be at most 10 characters')
    .required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  emailId: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  age: Yup.number()
    .min(18, 'You must be at least 18 years old')
    .required('Age is required'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'others'], 'Invalid gender')
    .required('Gender is required'),
  about: Yup.string(),
  skills: Yup.string(), // we'll split it later into array
  photoUrl: Yup.mixed().required('Profile photoUrl is required'),
});

export default function SignupPage() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { post } = useApi(); // Assuming you have a custom hook for API calls
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      emailId: '',
      password: '',
      age: '',
      gender: '',
      about: '',
      skills: '',
      photoUrl: null,
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('emailId', values.emailId);
        formData.append('password', values.password);
        formData.append('age', values.age);
        formData.append('gender', values.gender);
        formData.append('about', values.about || 'No bio provided');
        formData.append(
          'skills',
          JSON.stringify(values.skills.split(',').map((skill) => skill.trim()))
        );
        if (values.photoUrl) {
          formData.append('photoUrl', values.photoUrl);
        }

        // You would typically send this to your signup API
        // await yourApi.signup(formData);
        const res = await post(API_PATHS.SIGNUP, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        dispatch(addUser(res));

        toast.success('Account created successfully!');
        router.push('/');
      } catch (error) {
        console.error(error);
        toast.error('Failed to create account. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue('photoUrl', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className='space-y-4'>
              <FormField
                name='firstName'
                label='First Name'
                placeholder='Enter first name'
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && formik.errors.firstName}
              />
              <FormField
                name='lastName'
                label='Last Name'
                placeholder='Enter last name'
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && formik.errors.lastName}
              />
              <FormField
                name='emailId'
                label='Email'
                type='email'
                placeholder='Enter your email'
                value={formik.values.emailId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.emailId && formik.errors.emailId}
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
              <FormField
                name='age'
                label='Age'
                type='number'
                placeholder='Enter your age'
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.age && formik.errors.age}
              />
              <div className='space-y-1'>
                <label htmlFor='gender' className='block text-sm font-medium'>
                  Gender
                </label>
                <select
                  id='gender'
                  name='gender'
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='w-full border rounded-md p-2'
                >
                  <option value=''>Select Gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='others'>Others</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <p className='text-red-500 text-sm'>{formik.errors.gender}</p>
                )}
              </div>
              <FormField
                name='about'
                label='About'
                placeholder='Tell us about yourself'
                value={formik.values.about}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormField
                name='skills'
                label='Skills (comma separated)'
                placeholder='e.g., React, Node.js, Python'
                value={formik.values.skills}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className='space-y-1'>
                <label className='block text-sm font-medium'>
                  Profile Photo
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handlePhotoChange}
                  className='w-full border rounded-md p-2'
                />
                {formik.touched.photoUrl && formik.errors.photoUrl && (
                  <p className='text-red-500 text-sm'>
                    {formik.errors.photoUrl}
                  </p>
                )}
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt='Profile Preview'
                    className='w-24 h-24 rounded-full object-cover mt-2'
                  />
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              className='w-full'
              onClick={() => formik.handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
