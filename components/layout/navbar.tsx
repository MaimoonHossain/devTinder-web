'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthActions } from '@/hooks/use-auth-actions';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Home, Menu, User, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Connections', href: '/connections', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useMobile();
  const { logout } = useAuthActions();
  const user = useSelector((state: any) => state.user);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        {/* Mobile Sidebar Trigger + Logo */}
        <div className='flex items-center gap-2'>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className='lg:hidden'>
              <Button variant='ghost' size='icon'>
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-[240px] sm:w-[300px]'>
              <div className='flex flex-col gap-6 py-4'>
                <Link
                  href='/'
                  className='flex items-center gap-2 font-bold text-xl'
                  onClick={() => setOpen(false)}
                >
                  Next.js 15
                </Link>
                <nav className='flex flex-col gap-2'>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      <item.icon className='h-4 w-4' />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link href='/' className='flex items-center gap-2 font-bold text-xl'>
            Next.js 15
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className='hidden lg:flex items-center gap-6'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80',
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              {pathname === item.href && (
                <motion.span
                  layoutId='navbar-indicator'
                  className='absolute bottom-0 h-0.5 w-full bg-primary'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side (Theme + Auth) */}
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          {!isMobile && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={user?.photoUrl}
                          alt={user?.firstName}
                        />
                        <AvatarFallback>
                          {user?.firstName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-sm font-medium'>
                        Welcome, {user?.firstName}
                      </span>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-40'>
                    <DropdownMenuItem asChild>
                      <Link href='/profile'>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href='/connections'>Connections</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href='/requests'>Requests</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => logout()}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild>
                  <Link href='/login'>Login</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
