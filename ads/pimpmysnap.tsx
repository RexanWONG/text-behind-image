import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { PaintBucket } from 'lucide-react';

const PimpMySnapAd = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div>
      <a href="https://pimpmysnap.com?utm_source=textbehindimage&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="block">
        <header className="flex flex-row items-center justify-between p-4 bg-white dark:bg-black border-b top-0 w-full">
          <div className="flex flex-row items-center gap-4">
            <div className="w-[60px] h-[60px] flex items-center justify-center bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 rounded-lg">
              <PaintBucket className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="text-sm md:hidden text-purple-500">
                <strong>pimpmysnap.com - </strong>
                Create scroll-stopping screenshots in seconds. Try it FREE!
                <br className="block md:hidden" />
                <strong className="text-purple-600">
                  Start creating now
                </strong>
                <span className='text-xs text-purple-400 px-2'>
                  SPONSORED
                </span>
              </p>
              <div className="hidden md:block">
                <p className="text-base inline text-purple-500">
                  <strong>pimpmysnap.com - </strong>
                  Create scroll-stopping screenshots in seconds. Try it FREE!{" "}
                  <strong className="text-purple-600 text-base">
                    Start creating now
                  </strong>   
                  <span className='text-xs text-purple-400 px-2'>
                    SPONSORED
                  </span>
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
            <X className="h-4 w-4 text-purple-500" />
          </button>
        </header>
      </a>
    </div>
  );
};

export default PimpMySnapAd; 