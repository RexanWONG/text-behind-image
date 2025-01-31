import React, { useState } from 'react';
import { X } from 'lucide-react';

const FirecrawlAd = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div>
      <a href="https://firecrawl.dev?utm_source=textbehindimage&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="block">
        <header className="flex flex-row items-center justify-between p-4 bg-white dark:bg-black border-b top-0 w-full">
          <div className="flex flex-row items-center gap-2">
            <div className="flex items-center justify-center rounded-lg">
              <p className="text-lg">🔥</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-sm md:hidden ">
                <strong>Firecrawl - </strong>
                Turn websites into LLM-ready data
                <span className='text-xs px-2'>
                  SPONSORED
                </span>
              </p>
              <div className="hidden md:block">
                <p className="text-base inline ">
                  <strong>Firecrawl - </strong>
                  Turn websites into LLM-ready data
                  <span className='text-xs px-2'>
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
            <X className="h-4 w-4 " />
          </button>
        </header>
      </a>
    </div>
  );
};

export default FirecrawlAd; 