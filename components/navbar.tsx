import React from 'react';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

const Navbar = () => {
  const pathname = usePathname();
  const currentRoute = pathname

  return (
    <div className='p-5 px-10'>
      {currentRoute === '/' ? (
        <div className='flex flex-row items-center justify-between'>
          <h2 className="text-2xl font-semibold tracking-tight">
            Text behind image
          </h2>
          <Button>
            New design
          </Button>
        </div>
      ) : currentRoute === '/design' ? (
        <div className='flex flex-row items-center justify-between'>
          <h2 className="text-2xl font-semibold tracking-tight">
            Text behind image editor
          </h2>
          <Button>
            Upload image
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;