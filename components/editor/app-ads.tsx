'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import Image, { StaticImageData } from 'next/image'
import formfactorImg from '@/public/ads/formfactor.jpg'
import ninjatoolsImg from '../../public/ads/ninjatools.png'

interface Ad {
    name: string;
    image: StaticImageData;
    description: string;
    url: string;
}

const ads: Ad[] = [
    // {
    //     name: "Formfactor",
    //     image: formfactorImg,
    //     description: "Websites that attract users | Discover how we transformed the Hypefury website — and let us do the same for you!",
    //     url: "https://www.formfactor.design/case-studies/hypefury"
    // },
    {
        name: "NinjaTools",
        image: ninjatoolsImg,
        description: "Streamline your AI workflow | One interface for all your AI models, saving you $600 annually",
        url: "https://ninjatools.ai/?ref=textbehindimage"
    }
]

const AppAds = () => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAdIndex((prevIndex) => 
                prevIndex === ads.length - 1 ? 0 : prevIndex + 1
            )
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    if (!isVisible) return null;

    const currentAd = ads[currentAdIndex]

    return (
        <a 
            href={currentAd.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full md:w-[80%] border border-border rounded-lg hover:opacity-90 transition-opacity md:relative fixed bottom-0 left-0 right-0 bg-background z-50 md:z-auto"
        >
            <div className="flex flex-col md:flex-col gap-2">
                <div className="md:hidden flex items-center justify-between p-4">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                                src={currentAd.image}
                                alt={currentAd.name}
                                layout="fill"
                                className="object-cover rounded-md"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm">
                                <strong>{currentAd.name}</strong> - {currentAd.description}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            setIsVisible(false);
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ml-4"
                        aria-label="Close advertisement"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="hidden md:block p-3">
                    <div className="relative mb-2">
                        <Image
                            src={currentAd.image}
                            alt={currentAd.name}
                            layout="responsive"
                            width={280}
                            height={200}
                            className="object-cover rounded-md"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm">
                            <strong>{currentAd.name}</strong> - {currentAd.description}
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsVisible(false);
                                }}
                                className="ml-2 text-red-500 hover:text-red-600 transition-colors"
                                aria-label="Close advertisement"
                            >
                                Close ad
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default AppAds

