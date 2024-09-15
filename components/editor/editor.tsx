'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Design } from '@/types'
import { removeBackground } from "@imgly/background-removal"; 
import SliderField from './slider-field';

interface EditorProps {
    design: Design[]
}

const Editor: React.FC<EditorProps> = ({ design }) => {
    const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false)
    const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null)
    const [textAttributes, setTextAttributes] = useState({
        top: 50,
        left: 50,
        color: 'white',
        fontSize: 200,
        fontWeight: 800,
    })

    const setupImage = async () => {
        try {
            const imageUrl = design[0].image;
            const imageBlob = await removeBackground(imageUrl);
            const url = URL.createObjectURL(imageBlob);

            console.log('url:', url);
            setRemovedBgImageUrl(url);
            setIsImageSetupDone(true)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setupImage()
    }, [design]);

    const handleAttributeChange = (attribute: string, value: any) => {
        setTextAttributes(prev => ({ ...prev, [attribute]: value }))
    }

    return (
        <div className='flex flex-row items-start justify-start gap-10 w-full h-screen'>
            <div className="min-h-[400px] w-[80%] p-4 md:min-h-[700px] lg:min-h-[700px] border border-border rounded-lg relative overflow-hidden">
                <Image
                    src={design[0].image}
                    alt={design[0].name}
                    layout="fill"
                    objectFit="contain" 
                    objectPosition="center" 
                    className={`${!isImageSetupDone ? 'animate-pulse' : ''}`}
                />
                {isImageSetupDone && (
                    <div
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                            position: 'absolute',
                            top: `${50 - textAttributes.top}%`,
                            left: `${textAttributes.left + 50}%`,
                            transform: 'translate(-50%, -50%)',
                            color: textAttributes.color,
                            textAlign: 'center',
                            fontSize: `${textAttributes.fontSize}px`,
                            fontWeight: textAttributes.fontWeight,
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                        }}
                    >
                        POV
                    </div>
                )}
                {removedBgImageUrl && (
                    <Image
                        src={removedBgImageUrl}
                        alt="Removed bg"
                        layout="fill"
                        objectFit="contain" 
                        objectPosition="center" 
                        className="absolute top-0 left-0 w-full h-full"
                    />
                )}
            </div>
            <div className='flex flex-col w-full'>
                <SliderField
                    attribute="fontSize"
                    label="Font Size"
                    min={10}
                    max={800}
                    step={1}
                    currentValue={textAttributes.fontSize}
                    handleAttributeChange={handleAttributeChange}
                />
                <SliderField
                    attribute="fontWeight"
                    label="Font Weight"
                    min={100}
                    max={900}
                    step={1}
                    currentValue={textAttributes.fontWeight}
                    handleAttributeChange={handleAttributeChange}
                />
                <SliderField
                    attribute="left"
                    label="X Position"
                    min={-200}
                    max={200}
                    step={1}
                    currentValue={textAttributes.left}
                    handleAttributeChange={handleAttributeChange}
                />
                <SliderField
                    attribute="top"
                    label="Y Position"
                    min={-100}
                    max={100}
                    step={1}
                    currentValue={textAttributes.top}
                    handleAttributeChange={handleAttributeChange}
                />
            </div>
        </div>
    )
} 

export default Editor