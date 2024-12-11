import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { Atom } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import UserAccountnav from './UserAccountnav';
import ThemeToggle from './ThemeToggle'

const Navbar = async() => {
  const session = await getServerSession(authOptions);

  return (
    <div className=' bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0 dark:bg-black'>
      <div className='container flex items-center justify-between'>
        <Link href='/'>
          <Atom/>
        </Link>
        <div className="flex items-center gap-4">
        <ThemeToggle/>
        {session?.user ? (
         <UserAccountnav />
        ) : (
          <Link className={buttonVariants()} href='/sign-in'>
          Sign in
        </Link>
        )}
        </div>
        
      </div>
    </div>
  );
};

export default Navbar;
