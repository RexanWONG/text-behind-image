import React from 'react';
import PallyyLogo from '@/public/pallyy.svg'; 
import Image from 'next/image';

const PallyyAd = () => {
  return (
    <a href="https://pallyy.com?utm_source=text-behind-image&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="block">
      <header className="flex flex-row items-center justify-center gap-4 p-4 bg-white dark:bg-black border-b top-0 w-fit">
        <Image src={PallyyLogo} alt="Pallyy Logo" width={60} />
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-sm md:hidden">
            Schedule any image to all of your favourite social networks in seconds.
            <br className="block md:hidden" />
            <strong className="text-blue-500">
              Start a free trial
            </strong><span className='text-xs text-muted-foreground px-2'>
              SPONSORED
            </span>
          </p>
          <div className="hidden md:flex flex-row items-center justify-center gap-1">
            <p className="text-base">Schedule any image to all of your favourite social networks in seconds.{" "}</p>
            <strong className="text-blue-500 text-base">
              Start a free trial
            </strong>
          </div>
        </div>
      </header>
    </a>
  );
};

export default PallyyAd;