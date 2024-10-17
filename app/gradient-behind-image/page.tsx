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

const Page = () => {
    const { user } = useUser();
    const { session } = useSessionContext();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
    const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null);
    const [textSets, setTextSets] = useState<Array<any>>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [color1, setColor1] = useState("#ff0000");
    const [color2, setColor2] = useState("#ffff00");
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [gradientDataURL, setGradientDataURL] = useState<string | null>(null);

    useEffect(() => {
        if (imageSize.width && imageSize.height) {
            const canvas = document.createElement('canvas');
            canvas.width = imageSize.width;
            canvas.height = imageSize.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Check if color codes are valid
                const isValidColor = (color: string) => /^#[0-9A-F]{6}$/i.test(color);
                if (!isValidColor(color1) || !isValidColor(color2)) {
                    console.error('Invalid color code');
                    return;
                }

                const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                gradient.addColorStop(0, color1);
                gradient.addColorStop(1, color2);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                setGradientDataURL(canvas.toDataURL());
            }
        }
    }, [color1, color2, imageSize]);

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
            top: 0,
            left: 0,
            color: 'white',
            fontSize: 200,
            fontWeight: 800,
            opacity: 1,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
            shadowSize: 4,
            rotation: 0
        }]);
    };

    const handleAttributeChange = (id: number, attribute: string, value: any) => {
        setTextSets(prev => prev.map(set => 
            set.id === id ? { ...set, [attribute]: value } : set
        ));
    };

    const duplicateTextSet = (textSet: any) => {
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, { ...textSet, id: newId }]);
    };

    const removeTextSet = (id: number) => {
        setTextSets(prev => prev.filter(set => set.id !== id));
    };

    const setRandomColors = () => {
        const randomColor = () => {
            const hex = Math.floor(Math.random()*16777215).toString(16);
            return '#' + '0'.repeat(6 - hex.length) + hex; // Ensure 6 digits
        };
        setColor1(randomColor());
        setColor2(randomColor());
    };

    const saveCompositeImage = () => {
        if (!canvasRef.current || !isImageSetupDone || !gradientDataURL) return;
    
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        canvas.width = imageSize.width;
        canvas.height = imageSize.height;
    
        // Draw gradient background
        const gradientImg = new Image();
        gradientImg.onload = () => {
            ctx.drawImage(gradientImg, 0, 0);
            
            // Draw text
            textSets.forEach(textSet => {
                ctx.save();
                ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px ${textSet.fontFamily}`;
                ctx.fillStyle = textSet.color;
                ctx.globalAlpha = textSet.opacity;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
        
                const x = canvas.width * (textSet.left + 50) / 100;
                const y = canvas.height * (50 - textSet.top) / 100;
        
                ctx.translate(x, y);
                ctx.rotate((textSet.rotation * Math.PI) / 180);
                ctx.fillText(textSet.text, 0, 0);
                ctx.restore();
            });
        
            if (removedBgImageUrl) {
                const removedBgImg = new Image();
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
        gradientImg.src = gradientDataURL;
    
        function triggerDownload() {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'gradient-text-behind-image.png';
            link.href = dataUrl;
            link.click();
        }
    };

    return (
        <>
            {user && session && session.user ? (
                <div className='flex flex-col min-h-screen'>
                    <div className='flex flex-row items-center justify-between p-5 px-10'>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Text behind image editor
                        </h2>
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
                            <div className="min-h-[400px] w-[80%] p-4 border border-border rounded-lg relative overflow-hidden">
                                {gradientDataURL && (
                                    <Image
                                        src={gradientDataURL}
                                        alt="Gradient background"
                                        width={imageSize.width}
                                        height={imageSize.height}
                                        style={{position: 'absolute', top: 0, left: 0, zIndex: 1}}
                                    />
                                )}
                                {isImageSetupDone ? (
                                    <Image
                                        src={selectedImage} 
                                        alt="Uploaded"
                                        width={imageSize.width}
                                        height={imageSize.height}
                                        style={{position: 'relative', zIndex: 2, opacity: 0}}
                                    />
                                ) : (
                                    <span className='flex items-center w-full gap-2'><ReloadIcon className='animate-spin' /> Loading, please wait</span>
                                )}
                                {isImageSetupDone && textSets.map(textSet => (
                                    <div
                                        key={textSet.id}
                                        style={{
                                            position: 'absolute',
                                            top: `${50 - textSet.top}%`,
                                            left: `${textSet.left + 50}%`,
                                            transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg)`,
                                            color: textSet.color,
                                            textAlign: 'center',
                                            fontSize: `${textSet.fontSize}px`,
                                            fontWeight: textSet.fontWeight,
                                            fontFamily: textSet.fontFamily,
                                            opacity: textSet.opacity,
                                            zIndex: 3
                                        }}
                                    >
                                        {textSet.text}
                                    </div>
                                ))}
                                {removedBgImageUrl && (
                                    <Image
                                        src={removedBgImageUrl}
                                        alt="Removed bg"
                                        width={imageSize.width}
                                        height={imageSize.height}
                                        style={{position: 'absolute', top: 0, left: 0, zIndex: 4}}
                                    /> 
                                )}
                            </div>
                            <div className='flex flex-col w-full'>
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold mb-2">Gradient Background</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="color"
                                            value={color1}
                                            onChange={(e) => setColor1(e.target.value)}
                                        />
                                        <input
                                            type="color"
                                            value={color2}
                                            onChange={(e) => setColor2(e.target.value)}
                                        />
                                        <Button onClick={setRandomColors}>Random Colors</Button>
                                    </div>
                                </div>
                                <Button variant={'secondary'} onClick={addNewTextSet}><PlusIcon className='mr-2'/> Add New Text Set</Button>
                                <Accordion type="single" collapsible className="w-full mt-2">
                                    {textSets.map(textSet => (
                                        <TextCustomizer 
                                            key={textSet.id}
                                            textSet={textSet}
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
                        <div className='flex items-center justify-center min-h-screen w-full'>
                            <h2 className="text-xl font-semibold">Welcome, get started by uploading an image!</h2>
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
