// app/client-providers.tsx
'use client';

import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/theme-provider';
import ReduxProvider from './redux-provider';
import AppInitializer from './app-initializer';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <AppInitializer>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position='top-right' />
        </ThemeProvider>
      </AppInitializer>
    </ReduxProvider>
  );
}
