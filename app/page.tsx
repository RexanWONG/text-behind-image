'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import { HeroImages } from '@/components/hero-images';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { HeroParallaxImages } from '@/components/hero-parallax-images';
import { AdditionalInfo } from '@/components/additional-info';
import Link from 'next/link';
import { FlipWords } from '@/components/ui/flip-words';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";

const Page = () => {
    const words = ["text-behind-image", "stunning", "creative", "unique"];

    return (
        <div className='flex flex-col min-h-screen items-center w-full mt-10'>
            <Navbar />
                <HeroHighlight>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: [20, -5, 0] }} 
                        transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
                        className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-black dark:text-white"
                    >
                        Create {" "}
                        <Highlight>
                            <span className="inline-block w-[470px] px-4 py-2">
                                <FlipWords className='text-white' words={words} />
                            </span>
                        </Highlight>
                        {" "} designs easily
                    </motion.h1>
                </HeroHighlight>
                <Link href={'/text-behind-image'} className='mb-10'>
                    <HoverBorderGradient containerClassName="rounded-full" as="button" className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2">
                        Open the app
                    </HoverBorderGradient>
                </Link>
                
                <div className='w-full h-full mt-2'>
                    <HeroImages />
                    <HeroParallaxImages />
                </div>
                <div className="flex flex-col items-center justify-center my-10">
                    <AdditionalInfo />
            </div>
        </div>
    );
}

const Navbar = () => {
    const navItems = [
        { name: "text-behind-image", link: "/text-behind-image" },
        { name: "Contact Us", link: "#" },
        { name: "Acknowledgements", link: "#" },
    ];

    return (
        <div className="w-full">
            <DesktopNav navItems={navItems} />
            <MobileNav navItems={navItems} />
        </div>
    );
};

const DesktopNav = ({ navItems }: any) => {
    const [hovered, setHovered] = useState<number | null>(null);
    return (
        <motion.div
            onMouseLeave={() => { setHovered(null); }}
            className={cn(
                "hidden lg:flex flex-row self-start bg-neutral-100  dark:bg-neutral-950 items-center justify-between py-2 max-w-7xl mx-auto px-4 rounded-full relative z-[60] w-full",
                "sticky top-40 inset-x-0"
            )}
        >
            <Logo />
            <div className="lg:flex flex-row flex-1 hidden items-center justify-center space-x-2 lg:space-x-2 text-sm text-zinc-600 font-medium hover:text-zinc-800 transition duration-200">
                {navItems.map((navItem: any, idx: number) => (
                    <Link
                        onMouseEnter={() => setHovered(idx)}
                        className="text-neutral-600 dark:text-neutral-300 relative px-4 py-2"
                        key={`link=${idx}`}
                        href={navItem.link}
                    >
                        {hovered === idx && (
                            <motion.div
                                layoutId="hovered"
                                className="w-full h-full absolute inset-0 bg-gray-200 dark:bg-neutral-800 rounded-full"
                            />
                        )}
                        <span className="relative z-20">{navItem.name}</span>
                    </Link>
                ))}
            </div>
            <button className="hidden md:block px-8 py-2 text-sm font-bold rounded-full bg-black dark:bg-white dark:text-black  text-white shadow-[0px_-2px_0px_0px_rgba(255,255,255,0.4)_inset]">
                X
            </button>
        </motion.div>
    );
};

const MobileNav = ({ navItems }: any) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <motion.div
                animate={{
                    borderRadius: open ? "4px" : "2rem",
                }}
                key={String(open)}
                className="flex relative flex-col lg:hidden w-full justify-between items-center bg-white dark:bg-neutral-950  max-w-[calc(100vw-2rem)] mx-auto px-4 py-2"
            >
                <div className="flex flex-row justify-between items-center w-full">
                    <Logo />
                    {open ? (
                        <IconX
                            className="text-black dark:text-white"
                            onClick={() => setOpen(!open)}
                        />
                    ) : (
                        <IconMenu2
                            className="text-black dark:text-white"
                            onClick={() => setOpen(!open)}
                        />
                    )}
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex rounded-lg absolute top-16 bg-white dark:bg-neutral-950 inset-x-0 z-20 flex-col items-start justify-start gap-4 w-full px-4 py-8"
                        >
                            {navItems.map((navItem: any, idx: number) => (
                                <Link
                                    key={`link=${idx}`}
                                    href={navItem.link}
                                    className="relative text-neutral-600 dark:text-neutral-300"
                                >
                                    <motion.span className="block">{navItem.name} </motion.span>
                                </Link>
                            ))}
                            <button className="px-8 py-2 w-full rounded-lg bg-black dark:bg-white dark:text-black font-medium text-white shadow-[0px_-2px_0px_0px_rgba(255,255,255,0.4)_inset]">
                                Book a call
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};

const Logo = () => {
    return (
        <Link
            href="/"
            className="font-normal flex space-x-2 items-center text-sm mr-4  text-black px-2 py-1  relative z-20"
        >
            {/* <Image
                src="/logo-dark.png"  // Assuming you saved the image as logo-dark.png in the public folder
                alt="logo"
                width={30}
                height={30}
            /> */}
            <span className="font-medium text-black dark:text-white">Background Magic</span>
        </Link>
    );
};

export default Page;
