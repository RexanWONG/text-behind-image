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
import { Slider } from "@/components/ui/slider";
import { applyNoiseToGradient } from '@/lib/utils';
import { Input } from "@/components/ui/input"; // Add this import
import { HeroGradientParallaxImages } from '@/components/hero-gradient-parallax-images';
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

    const [color1, setColor1] = useState("#ff0000");
    const [color2, setColor2] = useState("#ffff00");
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [gradientDataURL, setGradientDataURL] = useState<string | null>(null);

    const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
    const previewRef = useRef<HTMLDivElement>(null);

    const [noiseLevel, setNoiseLevel] = useState(0);
    const [noiseLevelInput, setNoiseLevelInput] = useState("0");

    const [gradientCanvas, setGradientCanvas] = useState<HTMLCanvasElement | null>(null);

    // Add this new state to track if the gradient is ready
    const [isGradientReady, setIsGradientReady] = useState(false);

    // Add this new state for the gradient angle
    const [gradientAngle, setGradientAngle] = useState(0);

    // Add this new state for the temporary gradient angle during slider interaction
    const [tempGradientAngle, setTempGradientAngle] = useState(0);

    // Add this state to trigger gradient recalculation
    const [shouldRecalculateGradient, setShouldRecalculateGradient] = useState(false);

    useEffect(() => {
        if (previewRef.current) {
            const { width, height } = previewRef.current.getBoundingClientRect();
            setPreviewSize({ width, height });
        }
    }, [selectedImage]);

    // Modify this useEffect to trigger gradient calculation when image setup is done
    useEffect(() => {
        if (isImageSetupDone) {
            setShouldRecalculateGradient(true);
        }
    }, [isImageSetupDone]);

    // Modify the gradient calculation useEffect
    useEffect(() => {
        if (isImageSetupDone && imageSize.width && imageSize.height && (shouldRecalculateGradient || !isGradientReady)) {
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

                // Calculate start and end points for the gradient based on the angle
                const angle = gradientAngle * (Math.PI / 180); // Convert to radians
                const startX = canvas.width / 2 + Math.cos(angle + Math.PI) * canvas.width;
                const startY = canvas.height / 2 + Math.sin(angle + Math.PI) * canvas.height;
                const endX = canvas.width / 2 + Math.cos(angle) * canvas.width;
                const endY = canvas.height / 2 + Math.sin(angle) * canvas.height;

                const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
                gradient.addColorStop(0, color1);
                gradient.addColorStop(1, color2);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                setGradientCanvas(canvas);
                setIsGradientReady(true);
                setShouldRecalculateGradient(false); // Reset the flag
            }
        }
    }, [color1, color2, imageSize, isImageSetupDone, gradientAngle, shouldRecalculateGradient, isGradientReady]);

    useEffect(() => {
        if (gradientCanvas && noiseLevel > 0) {
            const ctx = gradientCanvas.getContext('2d');
            if (ctx) {
                const noisyImageData = applyNoiseToGradient(ctx, gradientCanvas.width, gradientCanvas.height, noiseLevel);
                ctx.putImageData(noisyImageData, 0, 0);
                setGradientDataURL(gradientCanvas.toDataURL());
            }
        } else if (gradientCanvas) {
            setGradientDataURL(gradientCanvas.toDataURL());
        }
    }, [gradientCanvas, noiseLevel]);

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
            // The gradient calculation will be triggered by the useEffect when isImageSetupDone becomes true
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

    const setRandomColors = () => {
        const randomColor = () => {
            const hex = Math.floor(Math.random()*16777215).toString(16);
            return '#' + '0'.repeat(6 - hex.length) + hex; // Ensure 6 digits
        };
        setColor1(randomColor());
        setColor2(randomColor());
        setShouldRecalculateGradient(true); // Add this line
    };

    const renderTextInPreview = (textSet: any) => {
        const fontSize = (textSet.fontSize / 100) * previewSize.height;
        const maxWidth = previewSize.width * 1.5; // 150% of preview width
        return (
            <div
                key={textSet.id}
                style={{
                    position: 'absolute',
                    top: `${textSet.y}%`,
                    left: `${textSet.x}%`,
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
        if (!canvasRef.current || !isImageSetupDone || !gradientDataURL) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = imageSize.width;
        canvas.height = imageSize.height;

        // Draw gradient background
        const gradientImg = document.createElement('img');
        gradientImg.onload = () => {
            ctx.drawImage(gradientImg, 0, 0);
            
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
        gradientImg.src = gradientDataURL;

        function triggerDownload() {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'gradient-text-behind-image.png';
            link.href = dataUrl;
            link.click();
        }
    };

    const handleNoiseLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNoiseLevelInput(value);
    };

    const applyNoiseLevel = () => {
        const numericValue = parseInt(noiseLevelInput, 10);
        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
            setNoiseLevel(numericValue);
        } else {
            // Reset to the last valid value if input is invalid
            setNoiseLevelInput(noiseLevel.toString());
        }
    };

    const handleNoiseLevelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            applyNoiseLevel();
        }
    };

    const handleNoiseLevelBlur = () => {
        applyNoiseLevel();
    };

    // Modify the handleGradientAngleChange function
    const handleGradientAngleChange = (value: number[]) => {
        setTempGradientAngle(value[0]);
    };

    // Modify the handleGradientAngleChangeEnd function
    const handleGradientAngleChangeEnd = (value: number[]) => {
        setGradientAngle(value[0]);
        setShouldRecalculateGradient(true);
    };

    // Add this new function to handle direct input of gradient angle
    const handleGradientAngleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= 360) {
            setTempGradientAngle(value);
        }
    };

    // Add this new function to handle input blur
    const handleGradientAngleInputBlur = () => {
        setGradientAngle(tempGradientAngle);
        setShouldRecalculateGradient(true);
    };

    // Add this new function to handle input key press
    const handleGradientAngleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setGradientAngle(tempGradientAngle);
            setShouldRecalculateGradient(true);
        }
    };

    return (
        <>
            {user && session && session.user ? (
                <div className='flex flex-col min-h-screen'>
                    <div className='flex flex-row items-center justify-between p-5 px-10'>
                        <Link href="/" className="hover:underline">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Gradient behind image editor
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
                                {isGradientReady && gradientDataURL && (
                                    <Image
                                        src={gradientDataURL}
                                        alt="Gradient background"
                                        layout="fill"
                                        objectFit="contain"
                                        style={{zIndex: 1}}
                                    />
                                )}
                                {isImageSetupDone ? (
                                    <Image
                                        src={selectedImage} 
                                        alt="Uploaded"
                                        layout="fill"
                                        objectFit="contain"
                                        style={{zIndex: 2, opacity: 0}}
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
                                        style={{zIndex: 4}}
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
                                            onChange={(e) => {
                                                setColor1(e.target.value);
                                                setShouldRecalculateGradient(true);
                                            }}
                                        />
                                        <input
                                            type="color"
                                            value={color2}
                                            onChange={(e) => {
                                                setColor2(e.target.value);
                                                setShouldRecalculateGradient(true);
                                            }}
                                        />
                                        <Button onClick={setRandomColors}>Random Colors</Button>
                                    </div>
                                    <div className="flex flex-col gap-2 mb-4">
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="gradient-angle" className="text-sm font-medium">
                                                Gradient Angle:
                                            </label>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={360}
                                                value={tempGradientAngle}
                                                onChange={handleGradientAngleInput}
                                                onBlur={handleGradientAngleInputBlur}
                                                onKeyPress={handleGradientAngleInputKeyPress}
                                                className="w-20"
                                            />
                                            <span className="text-sm">°</span>
                                        </div>
                                        <Slider
                                            id="gradient-angle"
                                            min={0}
                                            max={360}
                                            step={1}
                                            value={[tempGradientAngle]}
                                            onValueChange={handleGradientAngleChange}
                                            onValueCommit={handleGradientAngleChangeEnd}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="noise-input" className="text-sm font-medium">
                                            Noise Level (0-100):
                                        </label>
                                        <Input
                                            id="noise-input"
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={noiseLevelInput}
                                            onChange={handleNoiseLevelChange}
                                            onKeyDown={handleNoiseLevelKeyDown}
                                            onBlur={handleNoiseLevelBlur}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Text Set</h3>
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
                            <HeroGradientParallaxImages />
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
