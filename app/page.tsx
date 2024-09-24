'use client'

import React from 'react';
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import { HeroImages } from '@/components/hero-images';

const page = () => {
    return (
        <div className='flex flex-col min-h-screen items-center w-full mt-20'>
            <HeroHighlight>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: [20, -5, 0] }} 
                    transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
                    className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold leading-relaxed lg:leading-snug"
                >
                    Create {" "}
                    <Highlight className="text-white">
                        text-behind-image
                    </Highlight>
                    {" "} designs easily
                </motion.h1>
            </HeroHighlight>
            <div className='w-full'>
                <HeroImages />
            </div>
        </div>
    );
}

export default page;    