// app/gradient-behind-image/page.tsx
'use client'

import React, { useRef, useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Separator } from '@/components/ui/separator';
import Authenticate from '@/components/authenticate';
import { Button } from '@/components/ui/button';
import { removeBackground } from "@imgly/background-removal";
import { PlusIcon, ReloadIcon } from '@radix-ui/react-icons';
import TextCustomizer from '@/components/editor/text-customizer';
import Image from 'next/image';
import { Accordion } from '@/components/ui/accordion';
import '@/app/fonts.css'
import { HeroGradientParallaxImages } from '@/components/hero-gradient-parallax-images';
import { HeroImages } from '@/components/hero-images';
import { HeroParallaxImages } from '@/components/hero-parallax-images';
import Link from 'next/link';

const Page = () => {
    const { user } = useUser();
    const { session } = useSessionContext();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
    const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null);
    const [textSets, setTextSets] = useState<Array<any>>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
    const previewRef = useRef<HTMLDivElement>(null);

    // Add this new state to store the image dimensions
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (previewRef.current) {
            const { width, height } = previewRef.current.getBoundingClientRect();
            setPreviewSize({ width, height });
        }
    }, [selectedImage]);

    const handleUploadImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            const img = document.createElement('img');
            img.onload = () => {
                setImageSize({ width: img.width, height: img.height });
                setImageDimensions({ width: img.width, height: img.height });
            };
            img.src = imageUrl;
            await setupImage(imageUrl);
        }
    };

    const setupImage = async (imageUrl: string) => {
        try {
            const imageBlob = await removeBackground(imageUrl);
            const url = URL.createObjectURL(imageBlob);
            setRemovedBgImageUrl(url);
            setIsImageSetupDone(true);
        } catch (error) {
            console.error(error);
        }
    };

    const addNewTextSet = () => {
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, {
            id: newId,
            text: 'edit',
            fontFamily: 'Inter',
            left: 50, // Center of the image (x-axis)
            top: 50, // Center of the image (y-axis)
            x: 50, // Center of the image (x-axis)
            y: 50, // Center of the image (y-axis)
            color: 'white',
            fontSize: 30, // Percentage of image height
            fontWeight: 800,
            opacity: 1,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
            shadowSize: 4,
            rotation: 0
        }]);
    };

    const handleAttributeChange = (id: number, attribute: string, value: any) => {
        setTextSets(prev => prev.map(set => {
            if (set.id === id) {
                if (attribute === 'left') {
                    return { ...set, x: value };
                } else if (attribute === 'top') {
                    return { ...set, y: value };
                } else {
                    return { ...set, [attribute]: value };
                }
            }
            return set;
        }));
    };

    const duplicateTextSet = (textSet: any) => {
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, { ...textSet, id: newId }]);
    };

    const removeTextSet = (id: number) => {
        setTextSets(prev => prev.filter(set => set.id !== id));
    };

    // Modify the renderTextInPreview function
    const renderTextInPreview = (textSet: any) => {
        const previewAspectRatio = previewSize.width / previewSize.height;
        const imageAspectRatio = imageDimensions.width / imageDimensions.height;
        
        let scaleFactor: number;
        let offsetX = 0;
        let offsetY = 0;

        if (previewAspectRatio > imageAspectRatio) {
            // Preview is wider than the image
            scaleFactor = previewSize.height / imageDimensions.height;
            offsetX = (previewSize.width - imageDimensions.width * scaleFactor) / 2;
        } else {
            // Preview is taller than the image
            scaleFactor = previewSize.width / imageDimensions.width;
            offsetY = (previewSize.height - imageDimensions.height * scaleFactor) / 2;
        }

        const fontSize = (textSet.fontSize / 100) * imageDimensions.height * scaleFactor;
        const maxWidth = imageDimensions.width * scaleFactor * 1.5; // 150% of scaled image width

        const left = offsetX + (textSet.x / 100) * imageDimensions.width * scaleFactor;
        const top = offsetY + (textSet.y / 100) * imageDimensions.height * scaleFactor;

        return (
            <div
                key={textSet.id}
                style={{
                    position: 'absolute',
                    top: `${top}px`,
                    left: `${left}px`,
                    transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg)`,
                    color: textSet.color,
                    textAlign: 'center',
                    fontSize: `${fontSize}px`,
                    fontWeight: textSet.fontWeight,
                    fontFamily: textSet.fontFamily,
                    opacity: textSet.opacity,
                    zIndex: 3,
                    maxWidth: `${maxWidth}px`,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            >
                {textSet.text}
            </div>
        );
    };

    const saveCompositeImage = () => {
        if (!canvasRef.current || !isImageSetupDone) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = imageSize.width;
        canvas.height = imageSize.height;

        // Draw the original image
        const originalImg = document.createElement('img');
        originalImg.onload = () => {
            ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);
            
            // Draw text
            textSets.forEach(textSet => {
                ctx.save();
                const fontSize = (textSet.fontSize / 100) * canvas.height;
                ctx.font = `${textSet.fontWeight} ${fontSize}px ${textSet.fontFamily}`;
                ctx.fillStyle = textSet.color;
                ctx.globalAlpha = textSet.opacity;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const x = (textSet.x / 100) * canvas.width;
                const y = (textSet.y / 100) * canvas.height;

                ctx.translate(x, y);
                ctx.rotate((textSet.rotation * Math.PI) / 180);

                // Measure text and truncate if necessary
                const maxWidth = canvas.width * 1.5; // 150% of canvas width
                let text = textSet.text;
                let textWidth = ctx.measureText(text).width;
                if (textWidth > maxWidth) {
                    while (textWidth > maxWidth && text.length > 0) {
                        text = text.slice(0, -1);
                        textWidth = ctx.measureText(text + '...').width;
                    }
                    text += '...';
                }

                ctx.fillText(text, 0, 0, maxWidth);
                ctx.restore();
            });

            if (removedBgImageUrl) {
                const removedBgImg = document.createElement('img');
                removedBgImg.crossOrigin = "anonymous";
                removedBgImg.onload = () => {
                    ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
                    triggerDownload();
                };
                removedBgImg.src = removedBgImageUrl;
            } else {
                triggerDownload();
            }
        };
        originalImg.src = selectedImage || '';

        function triggerDownload() {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'text-behind-image.png';
            link.href = dataUrl;
            link.click();
        }
    };

    return (
        <>
            {user && session && session.user ? (
                <div className='flex flex-col min-h-screen'>
                    <div className='flex flex-row items-center justify-between p-5 px-10'>
                        <Link href="/" className="hover:underline">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Text behind image editor
                            </h2>
                        </Link>
                        <div className='flex gap-4'>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept=".jpg, .jpeg, .png" // Updated to accept only jpg and png
                            />
                            <Button onClick={handleUploadImage}>
                                Upload image
                            </Button>
                            <Avatar>
                                <AvatarImage src={user?.user_metadata.avatar_url} />
                            </Avatar>
                        </div>
                    </div>
                    <Separator />
                    {selectedImage ? (
                        <div className='flex flex-row items-start justify-start gap-10 w-full h-screen p-10'>
                            <div ref={previewRef} className="min-h-[400px] w-[80%] p-4 border border-border rounded-lg relative overflow-hidden">
                                {isImageSetupDone ? (
                                    <Image
                                        src={selectedImage} 
                                        alt="Uploaded"
                                        layout="fill"
                                        objectFit="contain"
                                        style={{zIndex: 1}}
                                    />
                                ) : (
                                    <span className='flex items-center w-full gap-2'><ReloadIcon className='animate-spin' /> Loading, please wait</span>
                                )}
                                {isImageSetupDone && textSets.map(renderTextInPreview)}
                                {removedBgImageUrl && (
                                    <Image
                                        src={removedBgImageUrl}
                                        alt="Removed bg"
                                        layout="fill"
                                        objectFit="contain"
                                        style={{zIndex: 3}}
                                    /> 
                                )}
                            </div>
                            <div className='flex flex-col w-full'>
                                <Button variant={'secondary'} onClick={addNewTextSet}><PlusIcon className='mr-2'/> Add New Text Set</Button>
                                <Accordion type="single" collapsible className="w-full mt-2">
                                    {textSets.map(textSet => (
                                        <TextCustomizer 
                                            key={textSet.id}
                                            textSet={{
                                                ...textSet,
                                                left: textSet.x,
                                                top: textSet.y
                                            }}
                                            handleAttributeChange={handleAttributeChange}
                                            removeTextSet={removeTextSet}
                                            duplicateTextSet={duplicateTextSet}
                                        />
                                    ))}
                                </Accordion>
                                
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                                <Button onClick={saveCompositeImage}>
                                    Save image
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center min-h-screen w-full'>
                            <h2 className="text-xl font-semibold mb-8">Welcome, get started by uploading an image!</h2>
                            <HeroParallaxImages />
                        </div>
                    )}
                </div>
            ) : (
                <Authenticate />
            )}
        </>
    );
}

export default Page;
