'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center'
      >
        <h1 className='text-4xl font-bold mb-6'>Welcome to DevTinder</h1>
        <p className='text-lg text-muted-foreground mb-8'>
          A professional starter template with shadcn/ui, Framer Motion, and
          more
        </p>
        <div className='flex gap-4 justify-center'>
          <Button asChild>
            <Link href='/login'>Get Started</Link>
          </Button>
          <Button variant='outline' asChild>
            <Link href='/connections'>Explore</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
