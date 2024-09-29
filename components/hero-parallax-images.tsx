"use client";

import { ParallaxScroll } from "./ui/parallax-scroll";

import life from '@/public/life.png' 
import wow from '@/public/wow.png'
import go from '@/public/go.png'
import cold from '@/public/cold.png'
import pressure from '@/public/pressure.png'
import enjoy from '@/public/enjoy.png'
import nature from '@/public/nature.png'
import vie from '@/public/vie.png'
import snap from '@/public/snap.png'

export function HeroParallaxImages() {
  return <ParallaxScroll images={images} className="w-full"/>;
}

const images = [
  go, wow, life, enjoy, pressure, snap, nature, vie, cold
];
