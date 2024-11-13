'use client';

import React from 'react';
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import { HeroImages } from '@/components/hero-images';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { HeroParallaxImages } from '@/components/hero-parallax-images';
import { AdditionalInfo } from '@/components/additional-info';
import Link from 'next/link';
import PallyyAd from '@/ads/pallyy';

const page = () => {
    return ( 
        <div className='flex flex-col min-h-screen items-center w-full'>
            <PallyyAd />
            <HeroHighlight>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: [20, -5, 0] }} 
                    transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
                    className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-black dark:text-white"
                >
                    Create {" "}
                    <Highlight className='text-white'>
                        text-behind-image
                    </Highlight>
                    {" "} designs easily
                </motion.h1>
            </HeroHighlight>
            <Link href={'/app'} className='mb-10'>
                <HoverBorderGradient containerClassName="rounded-full" as="button" className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2">
                    Open the app
                </HoverBorderGradient>
            </Link>

            <div className="flex space-x-4">
                <a href="https://www.producthunt.com/posts/text-behind-image?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-text&#0045;behind&#0045;image" target="_blank">
                    <img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=494264&theme=light&period=monthly&topic_id=164" alt="Text&#0032;Behind&#0032;Image - Create&#0032;stunning&#0032;text&#0045;behind&#0045;image&#0032;designs&#0032;easily | Product Hunt" width="250" height="54" />
                </a>
                <a href="https://www.producthunt.com/posts/text-behind-image?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-text&#0045;behind&#0045;image" target="_blank">
                    <img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=494264&theme=light&period=daily" alt="Text&#0032;Behind&#0032;Image - Create&#0032;stunning&#0032;text&#0045;behind&#0045;image&#0032;designs&#0032;easily | Product Hunt" width="250" height="54" />
                </a>
                <a href="https://www.producthunt.com/posts/text-behind-image?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-text&#0045;behind&#0045;image" target="_blank">
                    <img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=494264&theme=light&period=monthly&topic_id=44" alt="Text&#0032;Behind&#0032;Image - Create&#0032;stunning&#0032;text&#0045;behind&#0045;image&#0032;designs&#0032;easily | Product Hunt" width="250" height="54" />
                </a>
            </div>

            <div className='w-full h-full mt-2'>
                <HeroImages />
                <HeroParallaxImages />
            </div>
            <div className="flex flex-col items-center justify-center my-10">
                <AdditionalInfo />
                <div className='text-2xl mt-10'>
                    Created by <Link href={'https://www.rexanwong.xyz'} target="_blank" rel="noopener noreferrer" className='hover:font-bold'>Rexan Wong</Link>         
                </div> 
            </div>
        </div>
    );
}

export default page;