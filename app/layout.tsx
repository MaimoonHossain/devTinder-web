import type React from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import '@/app/globals.css';
import ClientProviders from './client-providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Next.js 15 App',
  description: 'A professional Next.js 15 application',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <div className='flex min-h-screen flex-col'>
              <Navbar />
              <main className='flex-1'>{children}</main>
              <Footer />
            </div>
            <Toaster position='top-right' />
          </ThemeProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
