import React, { useState } from 'react';
import PallyyLogo from '@/public/pallyy.svg'; 
import Image from 'next/image';
import { X } from 'lucide-react';

const PallyyAd = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <a href="https://pallyy.com?utm_source=text-behind-image&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="block">
      <header className="flex flex-row items-center justify-between p-4 bg-white dark:bg-black border-b top-0 w-full">
        <div className="flex flex-row items-center gap-4">
          <Image src={PallyyLogo} alt="Pallyy Logo" width={60} />
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-sm md:hidden">
              Schedule any image to all of your favourite social networks in seconds.
              <br className="block md:hidden" />
              <strong className="text-blue-500">
                Start a free trial
              </strong>
              <span className='text-xs text-muted-foreground px-2'>
                SPONSORED
              </span>
            </p>
            <div className="hidden md:block">
              <p className="text-base inline">
                Schedule any image to all of your favourite social networks in seconds.{" "}
                <strong className="text-blue-500 text-base">
                  Start a free trial
                </strong>   
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsVisible(false);
          }}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Close advertisement"
        >
          <X className="h-4 w-4" />
        </button>
      </header>
    </a>
  );
};

export default PallyyAd;