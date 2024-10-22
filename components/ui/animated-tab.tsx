"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { HeroImages } from "../hero-images";
import { HeroGradientParallaxImages } from "../hero-gradient-parallax-images";
import { HeroBWBGParallaxImages } from "../hero-bwbg-parallax-images";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);
  const [tabs, setTabs] = useState<Tab[]>(propTabs);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  const [hovering, setHovering] = useState(false);

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-center [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
          containerClassName
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.title}
            onClick={() => {
              moveSelectedTabToTop(idx);
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn("relative px-3 py-1.5 rounded-full text-sm", tabClassName)}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full ",
                  activeTabClassName
                )}
              />
            )}

            <span className="relative block text-black dark:text-white">
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <FadeInDiv
        tabs={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
        className={cn("mt-16", contentClassName)}
      />
    </>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  hovering,
}: {
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tab.value === tabs[0].value;
  };
  return (
    <div className="relative w-full h-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 40, 0] : 0,
          }}
          className={cn("w-full h-full absolute top-0 left-0", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};

// Updated TabsDemo component
export function TabsDemo() {
  const tabs = [
    {
      title: "Text Behind Image",
      value: "text-behind-image",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl md:text-3xl font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600">
          <p className="mb-4">Text Behind Image</p>
          <HeroImages />
        </div>
      ),
    },
    {
      title: "Gradient Behind Image",
      value: "gradient-behind-image",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl md:text-3xl font-bold text-white bg-gradient-to-br from-pink-500 to-orange-500">
          <p className="mb-4">Gradient Behind Image</p>
          <HeroGradientParallaxImages />
        </div>
      ),
    },
    {
      title: "BWBG Behind Image",
      value: "bwbg-behind-image",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl md:text-3xl font-bold text-white bg-gradient-to-br from-gray-900 to-gray-500">
          <p className="mb-4">BWBG Behind Image</p>
          <HeroBWBGParallaxImages />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[70rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-20">
      <Tabs tabs={tabs} />
    </div>
  );
}
