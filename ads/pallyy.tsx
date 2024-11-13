import React from 'react';
import PallyyLogo from '@/public/pallyy.svg'; 
import Image from 'next/image';

const PallyyAd = () => {
  return (
    <header className="flex flex-row items-center justify-center gap-4 p-4 bg-white dark:bg-black border-b top-0 w-fit">
      <Image src={PallyyLogo} alt="Pallyy Logo" width={60} />
        <div className="flex flex-row items-center justify-center gap-1">
        <p>Schedule any image to all of your favourite social networks in seconds.{"  "}</p>
            <a href="https://pallyy.com" target="_blank" rel="noopener noreferrer" className="text-blue-500">
                Start a free trial
            </a>
            <span className='text-xs text-muted-foreground px-2'>
                SPONSORED
            </span>
        </div>
    </header> 
  );
};

export default PallyyAd;