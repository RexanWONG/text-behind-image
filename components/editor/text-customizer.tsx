import React, { useState, useEffect } from 'react';
import InputField from './input-field';
import SliderField from './slider-field';
import ColorPicker from './color-picker';
import FontFamilyPicker from './font-picker'; 
import { Button } from '../ui/button';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Move, Text, Bold, RotateCw, Palette, LightbulbIcon, CaseSensitive, TypeOutline, ArrowLeftRight, ArrowUpDown, AlignHorizontalSpaceAround, LockIcon } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface TextCustomizerProps {
    textSet: {
        id: number;
        text: string;
        fontFamily: string;
        top: number;
        left: number;
        color: string;
        fontSize: number;
        fontWeight: number;
        opacity: number;
        rotation: number;
        shadowColor: string;
        shadowSize: number;
        tiltX: number;
        tiltY: number;
        letterSpacing: number;
    };
    handleAttributeChange: (id: number, attribute: string, value: any) => void;
    removeTextSet: (id: number) => void;
    duplicateTextSet: (textSet: any) => void;
    userId: string;
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({ textSet, handleAttributeChange, removeTextSet, duplicateTextSet, userId }) => {
    const [activeControl, setActiveControl] = useState<string | null>(null);
    const [isPaidUser, setIsPaidUser] = useState(false);
    const supabaseClient = useSupabaseClient();

    useEffect(() => { 
        const checkUserStatus = async () => {
            try {
                const { data: profile, error } = await supabaseClient
                    .from('profiles')
                    .select('paid')
                    .eq('id', userId)
                    .single();

                if (error) throw error;
                setIsPaidUser(profile?.paid || false);
            } catch (error) {
                console.error('Error checking user status:', error);
            }
        };

        checkUserStatus();
    }, [userId, supabaseClient]);

    const controls = [
        { id: 'text', icon: <CaseSensitive size={20} />, label: 'Text' },
        { id: 'fontFamily', icon: <TypeOutline size={20} />, label: 'Font' },
        { id: 'color', icon: <Palette size={20} />, label: 'Color' },
        { id: 'position', icon: <Move size={20} />, label: 'Position' },
        { id: 'fontSize', icon: <Text size={20} />, label: 'Size' },
        { id: 'fontWeight', icon: <Bold size={20} />, label: 'Weight' },
        { id: 'letterSpacing', icon: <AlignHorizontalSpaceAround size={20} />, label: 'Letter spacing', premium: true },
        { id: 'opacity', icon: <LightbulbIcon size={20} />, label: 'Opacity' },
        { id: 'rotation', icon: <RotateCw size={20} />, label: 'Rotate' },
        { id: 'tiltX', icon: <ArrowLeftRight size={20} />, label: 'Tilt X (3D effect)', premium: true },
        { id: 'tiltY', icon: <ArrowUpDown size={20} />, label: 'Tilt Y (3D effect)', premium: true },
    ];  

    const handlePremiumAttributeChange = (attribute: string, value: any) => {
        if (isPaidUser || (attribute !== 'letterSpacing' && attribute !== 'tiltX' && attribute !== 'tiltY')) {
            handleAttributeChange(textSet.id, attribute, value);
        }
    };

    return (
        <AccordionItem value={`item-${textSet.id}`}>
            <AccordionTrigger>{textSet.text}</AccordionTrigger>
            <AccordionContent>
                {/* Mobile Controls */}
                <div className="md:hidden">
                    <ScrollArea className="w-full">
                        <div className="flex w-max gap-1 mb-2 p-1">
                            {controls.map((control) => (
                                <button
                                    key={control.id}
                                    onClick={() => setActiveControl(activeControl === control.id ? null : control.id)}
                                    className={`flex flex-col items-center justify-center min-w-[4.2rem] h-[4.2rem] rounded-lg ${
                                        activeControl === control.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                    } ${control.premium && !isPaidUser ? 'opacity-70' : ''}`}
                                >
                                    {control.premium && !isPaidUser && <LockIcon size={12} className="absolute top-1 right-1" />}
                                    {control.icon}
                                    <span className="text-xs mt-1">{control.label}</span>
                                </button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    <div>
                        {activeControl === 'text' && (
                            <InputField
                                attribute="text"
                                label="Text"
                                currentValue={textSet.text}
                                handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            />
                        )}

                        {activeControl === 'fontFamily' && (
                            <FontFamilyPicker
                                attribute="fontFamily"
                                currentFont={textSet.fontFamily}
                                handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                userId={userId}
                            />
                        )}

                        {activeControl === 'color' && (
                            <ColorPicker
                                attribute="color"
                                label="Text Color"
                                currentColor={textSet.color}
                                handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            />
                        )}

                        {activeControl === 'position' && (
                            <div className="space-y-4">
                                <SliderField
                                    attribute="left"
                                    label="X Position"
                                    min={-200}
                                    max={200}
                                    step={1}
                                    currentValue={textSet.left}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                                <SliderField
                                    attribute="top"
                                    label="Y Position"
                                    min={-100}
                                    max={100}
                                    step={1}
                                    currentValue={textSet.top}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                            </div>
                        )}

                        {activeControl === 'fontSize' && (
                            <SliderField
                                attribute="fontSize"
                                label="Text Size"
                                min={10}
                                max={800}
                                step={1}
                                currentValue={textSet.fontSize}
                                handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            />
                        )}

                        {activeControl === 'fontWeight' && (
                            <SliderField
                                attribute="fontWeight"
                                label="Font Weight"
                                min={100}
                                max={900}
                                step={100}
                                currentValue={textSet.fontWeight}
                                handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            />
                        )}
                        
                        {activeControl === 'letterSpacing' && (
                            <SliderField
                                attribute="letterSpacing"
                                label="Letter Spacing"
                                min={-20}
                                max={100}
                                step={1}
                                currentValue={textSet.letterSpacing}
                                handleAttributeChange={(attribute, value) => handlePremiumAttributeChange(attribute, value)}
                                disabled={!isPaidUser}
                                premiumFeature={!isPaidUser}
                            />
                        )}

                        {activeControl === 'opacity' && (
                            <SliderField
                                attribute="opacity"
                                label="Text Opacity"
                                min={0}
                                max={1}
                                step={0.01}
                                currentValue={textSet.opacity}
                                handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            />
                        )}

                        {activeControl === 'rotation' && (
                            <SliderField
                                attribute="rotation"
                                label="Rotation"
                                min={-360}
                                max={360}
                                step={1}
                                currentValue={textSet.rotation}
                                handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            />
                        )}

                        {activeControl === 'tiltX' && (
                            <SliderField
                                attribute="tiltX"
                                label="Horizontal Tilt"
                                min={-45}
                                max={45}
                                step={1}
                                currentValue={textSet.tiltX}
                                handleAttributeChange={(attribute, value) => handlePremiumAttributeChange(attribute, value)}
                                disabled={!isPaidUser}
                                premiumFeature={!isPaidUser}
                            />
                        )}

                        {activeControl === 'tiltY' && (
                            <SliderField
                                attribute="tiltY"
                                label="Vertical Tilt"
                                min={-45}
                                max={45}
                                step={1}
                                currentValue={textSet.tiltY}
                                handleAttributeChange={(attribute, value) => handlePremiumAttributeChange(attribute, value)}
                                disabled={!isPaidUser}
                                premiumFeature={!isPaidUser}
                            />
                        )}
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <InputField
                        attribute="text"
                        label="Text"
                        currentValue={textSet.text}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <div className='flex flex-row items-center gap-12 w-full'>
                        <FontFamilyPicker
                            attribute="fontFamily"
                            currentFont={textSet.fontFamily}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            userId={userId}
                        />
                        <ColorPicker
                            attribute="color"
                            label="Text Color"
                            currentColor={textSet.color}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                    </div>
                    <SliderField
                        attribute="left"
                        label="X Position"
                        min={-200}
                        max={200}
                        step={1}
                        currentValue={textSet.left}
                        hasTopPadding={false}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="top"
                        label="Y Position"
                        min={-100}
                        max={100}
                        step={1}
                        currentValue={textSet.top}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="fontSize"
                        label="Text Size"
                        min={10}
                        max={800}
                        step={1}
                        currentValue={textSet.fontSize}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="fontWeight"
                        label="Font Weight"
                        min={100}
                        max={900}
                        step={100}
                        currentValue={textSet.fontWeight}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="letterSpacing"
                        label="Letter Spacing"
                        min={-20}
                        max={100}
                        step={1}
                        currentValue={textSet.letterSpacing}
                        handleAttributeChange={(attribute, value) => handlePremiumAttributeChange(attribute, value)}
                        disabled={!isPaidUser}
                        premiumFeature={!isPaidUser}
                    />
                    <SliderField
                        attribute="opacity"
                        label="Text Opacity"
                        min={0}
                        max={1}
                        step={0.01}
                        currentValue={textSet.opacity}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="rotation"
                        label="Rotation"
                        min={-360}
                        max={360}
                        step={1}
                        currentValue={textSet.rotation}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="tiltX"
                        label="Horizontal Tilt (3D effect)"
                        min={-45}
                        max={45}
                        step={1}
                        currentValue={textSet.tiltX}
                        handleAttributeChange={(attribute, value) => handlePremiumAttributeChange(attribute, value)}
                        disabled={!isPaidUser}
                        premiumFeature={!isPaidUser}
                    />
                    <SliderField
                        attribute="tiltY"
                        label="Vertical Tilt (3D effect)"
                        min={-45}
                        max={45}
                        step={1}
                        currentValue={textSet.tiltY}
                        handleAttributeChange={(attribute, value) => handlePremiumAttributeChange(attribute, value)}
                        disabled={!isPaidUser}
                        premiumFeature={!isPaidUser}
                    />
                </div>

                <div className="flex flex-row gap-2 my-8">
                    <Button onClick={() => duplicateTextSet(textSet)}>Duplicate Text Set</Button>
                    <Button variant="destructive" onClick={() => removeTextSet(textSet.id)}>Remove Text Set</Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

export default TextCustomizer;