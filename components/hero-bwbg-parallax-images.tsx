"use client";

import { ParallaxScroll } from "./ui/parallax-scroll";

import peace from '@/public/peace.png'
import lambo from '@/public/lambo.png'
import bevo from '@/public/bevo.png'

export function HeroBWBGParallaxImages() {
  return <ParallaxScroll images={images} className="w-full"/>;
}

const images = [
  peace, lambo, bevo
];
