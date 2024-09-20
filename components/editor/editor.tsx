import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Design } from '@/types';
import { removeBackground } from "@imgly/background-removal";
import { PlusIcon, ReloadIcon } from '@radix-ui/react-icons';
import { Accordion } from "@/components/ui/accordion";
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import TextCustomizer from './text-customizer';

interface EditorProps {
    design: Design[];
}

const Editor: React.FC<EditorProps> = ({ design }) => {
    const supabase = useSupabaseClient()
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { toast } = useToast();

    const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
    const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null);
    const [textSets, setTextSets] = useState<Array<any>>([]);
    const initialTextSetsSet = useRef(false);

    const handleAttributeChange = (id: number, attribute: string, value: any) => {
        setTextSets(prev => prev.map(set => 
            set.id === id ? { ...set, [attribute]: value } : set
        ));
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
        }]);
    };

    const removeTextSet = (id: number) => {
        setTextSets(prev => prev.filter(set => set.id !== id));
    };

    const saveTextSets = async () => {
        try {
            const { error } = await supabase
                .from('designs')
                .update({ text_style: textSets })
                .eq('id', design[0].id);

            if (error) {
                console.error('Error saving text_style:', error);
                toast({
                    title: "🔴 Error saving changes",
                    description: "Your changes couldn't be saved automatically.",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "🔴 Error saving changes",
                description: "Your changes couldn't be saved automatically.",
            });
        }
    };

    const setupImage = async () => {
        try {
            const imageUrl = design[0].image;
            const imageBlob = await removeBackground(imageUrl);
            const url = URL.createObjectURL(imageBlob);
            setRemovedBgImageUrl(url);
            setIsImageSetupDone(true);
        } catch (error) {
            console.error(error);
        }
    };
 
    const saveCompositeImage = () => {
        if (!canvasRef.current || !isImageSetupDone) return;
    
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        // Get the current display size of the image in the editor
        const displayWidth = document.querySelector('.image-container')?.clientWidth || 1000;
        const displayHeight = document.querySelector('.image-container')?.clientHeight || 1000;
    
        const bgImg = new (window as any).Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
            // Set canvas size to match the image
            canvas.width = bgImg.width;
            canvas.height = bgImg.height;
    
            // Calculate the scale factor
            const scaleX = canvas.width / displayWidth;
            const scaleY = canvas.height / displayHeight;
    
            // Draw background image
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    
            // Draw text
            textSets.forEach(textSet => {
                const scaledFontSize = textSet.fontSize * scaleX;
                ctx.font = `${textSet.fontWeight} ${scaledFontSize}px ${textSet.fontFamily}`;
                ctx.fillStyle = textSet.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
    
                const x = canvas.width * (textSet.left + 50) / 100;
                const y = canvas.height * (50 - textSet.top) / 100;
    
                ctx.fillText(textSet.text, x, y);
            });
    
            // Draw removed background image
            if (removedBgImageUrl) {
                const removedBgImg = new (window as any).Image();
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
        bgImg.src = design[0].image;
    
        function triggerDownload() {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'composite_image.png';
            link.href = dataUrl;
            link.click();
        }
    };
    
    useEffect(() => {
        setupImage();
    }, [design]);

    useEffect(() => {
        if (!initialTextSetsSet.current && design[0]) {
            if (design[0].text_style) {
                setTextSets(design[0].text_style);
            } else {
                setTextSets([
                    {
                        id: 1,
                        text: 'edit',
                        fontFamily: 'Inter',
                        top: 0,
                        left: 0,
                        color: 'white',
                        fontSize: 200,
                        fontWeight: 800,
                    }
                ]);
            }
            initialTextSetsSet.current = true;
        }
    }, [design]);
    
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            saveTextSets();
        }, 2000);
    
        return () => clearTimeout(debounceTimer);
    }, [textSets]);

    return (
        <div className='flex flex-row items-start justify-start gap-10 w-full h-screen'>
            <div className="min-h-[400px] w-[80%] p-4 md:min-h-[700px] lg:min-h-[700px] border border-border rounded-lg relative overflow-hidden">
                {isImageSetupDone ? (
                    <Image
                        src={design[0].image}
                        alt={design[0].name}
                        layout="fill"
                        objectFit="contain" 
                        objectPosition="center" 
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
                            transform: 'translate(-50%, -50%)',
                            color: textSet.color,
                            textAlign: 'center',
                            fontSize: `${textSet.fontSize}px`,
                            fontWeight: textSet.fontWeight,
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                            fontFamily: textSet.fontFamily,
                        }}
                    >
                        {textSet.text}
                    </div>
                ))}
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
                <Button variant={'secondary'} onClick={addNewTextSet}><PlusIcon className='mr-2'/> Add New Text Set</Button>
                <Accordion type="single" collapsible className="w-full mt-2">
                    {textSets.map(textSet => (
                        <TextCustomizer 
                            key={textSet.id}
                            textSet={textSet}
                            handleAttributeChange={handleAttributeChange}
                            removeTextSet={removeTextSet}
                        />
                    ))}
                </Accordion>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <Button onClick={saveCompositeImage}>
                    Save image
                </Button>
            </div>
        </div>
    );
};

export default Editor;