import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { PaintBucket } from 'lucide-react';

const RandomColorAd = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <a href="https://randomcolor.com" target="_blank" rel="noopener noreferrer" className="block">
      <header className="flex flex-row items-center justify-between p-4 bg-white dark:bg-black border-b top-0 w-full">
        <div className="flex flex-row items-center gap-4">
          <div className="w-[60px] h-[60px] flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg">
            <PaintBucket className="w-8 h-8" />
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-sm md:hidden">
              <strong>randomcolor.com - </strong>
              Simple tool to generate random colors for your next project.
              <br className="block md:hidden" />
              <strong className="text-blue-500">
                Generate a random color now
              </strong>
              <span className='text-xs text-muted-foreground px-2'>
                SPONSORED
              </span>
            </p>
            <div className="hidden md:block">
              <p className="text-base inline">
                <strong>randomcolor.com - </strong>
                Simple tool to generate random colors for your next project.{" "}
                <strong className="text-blue-500 text-base">
                  Generate a random color now
                </strong>   
                <span className='text-xs text-muted-foreground px-2'>
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
          <X className="h-4 w-4" />
        </button>
      </header>
    </a>
  );
};

export default RandomColorAd; 