import React from 'react';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useUser } from '@/hooks/useUser';

const Navbar = () => {
  const pathname = usePathname();
  const currentRoute = pathname

  const { user } = useUser()

  return (
    <div className='p-5 px-10'>
      {currentRoute === '/' ? (
        <div className='flex flex-row items-center justify-between'>
          <h2 className="text-2xl font-semibold tracking-tight">
            Text behind image
          </h2>
          <div className='flex gap-4'>
            <Button>
              New design
            </Button>
            <Avatar>
              <AvatarImage src={user?.user_metadata.avatar_url} />
            </Avatar>
          </div>
        </div>
      ) : currentRoute === '/design' ? (
        <div className='flex flex-row items-center justify-between'>
          <h2 className="text-2xl font-semibold tracking-tight">
            Text behind image editor
          </h2>
          {/* <div className='flex gap-4'>
            <Button>
              Upload image
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
          </div> */}
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;