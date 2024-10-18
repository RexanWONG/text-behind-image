"use client";

import { ParallaxScroll } from "./ui/parallax-scroll";

import mamba from '@/public/mamba.png' 
import mambaGradient from '@/public/mamba-gradient.png'
import mambaGradient2 from '@/public/mamba-gradient-2.png'
import iphone1 from '@/public/iphone-1.png'
import flower from '@/public/vibe.png'
import vogue from '@/public/vogue.png'

export function HeroGradientParallaxImages() {
  return <ParallaxScroll images={images} className="w-full"/>;
}

const images = [
  mamba, mambaGradient, mambaGradient2, iphone1, flower, vogue
];
