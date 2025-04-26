'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField } from '@/components/forms/form-field';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useApi } from '@/hooks/use-api';
import { User, Settings, Bell } from 'lucide-react';
import { API_PATHS } from '@/constants/api-paths';
import { addUser } from '@/utils/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '@/config/axios-config';

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { patch } = useApi();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      emailId: user?.emailId || '',
      about: user?.about || '',
      skills: user?.skills?.join(', ') || '',
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      emailId: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
      about: Yup.string(),
      skills: Yup.string(),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('emailId', values.emailId);
      formData.append('about', values.about);
      formData.append('skills', values.skills);

      if (photoFile) {
        formData.append('photoUrl', photoFile);
      }

      try {
        const res = await patch(API_PATHS.PROFILE_EDIT, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        dispatch(addUser(res));
        toast.success('Profile updated successfully');
      } catch (error) {
        console.error('Profile update failed:', error);
        toast.error('Failed to update profile');
      } finally {
        setIsLoading(false);
      }
    },
  });

  console.log(`${API_BASE_URL}/${user?.photoUrl}`);

  return (
    <div className='container mx-auto px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-3xl font-bold mb-8'>Your Profile</h1>

        <div className='grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8'>
          <Card>
            <CardHeader>
              <div className='mx-auto w-32 h-32 rounded-full overflow-hidden bg-muted'>
                <img
                  src={
                    user?.photoUrl
                      ? user?.photoUrl
                      : '/placeholder.svg?height=128&width=128'
                  }
                  alt='Profile'
                  className='w-full h-full object-cover'
                />
              </div>
              <CardTitle className='text-center mt-4'>{`${
                user?.firstName || ''
              } ${user?.lastName || ''}`}</CardTitle>
              <CardDescription className='text-center'>
                {user?.about || 'Tell us about yourself'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col space-y-2'>
                <Button variant='outline' className='justify-start'>
                  <User className='mr-2 h-4 w-4' />
                  Edit Profile
                </Button>
                <Button variant='outline' className='justify-start'>
                  <Settings className='mr-2 h-4 w-4' />
                  Account Settings
                </Button>
                <Button variant='outline' className='justify-start'>
                  <Bell className='mr-2 h-4 w-4' />
                  Notifications
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue='profile'>
            <TabsList className='mb-6'>
              <TabsTrigger value='profile'>Profile</TabsTrigger>
              <TabsTrigger value='settings'>Settings</TabsTrigger>
              <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value='profile'>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information
                  </CardDescription>
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
                      error={
                        formik.touched.firstName && formik.errors.firstName
                      }
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
                      placeholder='Enter email'
                      value={formik.values.emailId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.emailId && formik.errors.emailId}
                    />
                    <FormField
                      name='about'
                      label='About'
                      placeholder='Write something about yourself'
                      value={formik.values.about}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.about && formik.errors.about}
                      textarea
                    />
                    <FormField
                      name='skills'
                      label='Skills'
                      placeholder='Comma-separated (e.g. React, Next.js, Tailwind)'
                      value={formik.values.skills}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.skills && formik.errors.skills}
                    />
                  </form>

                  <div className='mx-auto mt-6 w-32 h-32 rounded-full overflow-hidden bg-muted relative group'>
                    <img
                      src={
                        photoPreview ||
                        user?.photoUrl ||
                        '/placeholder.svg?height=128&width=128'
                      }
                      alt='Profile'
                      className='w-full h-full object-cover'
                    />

                    <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => fileInputRef.current?.click()}
                        className='text-white'
                        type='button' // Prevents accidental submit
                      >
                        Change
                      </Button>
                    </div>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className='hidden'
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type='submit'
                    onClick={() => formik.handleSubmit()}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value='settings'>
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Account settings content would go here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='notifications'>
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage your notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Notification settings content would go here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
