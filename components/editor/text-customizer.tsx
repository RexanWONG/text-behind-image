import React, { useState } from 'react';
import InputField from './input-field';
import SliderField from './slider-field';
import ColorPicker from './color-picker';
import FontFamilyPicker from './font-picker'; 
import { Button } from '../ui/button';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Move, Text, Bold, RotateCw, Palette, LightbulbIcon, CaseSensitive, TypeOutline, ArrowLeftRight, ArrowUpDown } from 'lucide-react';
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
    };
    handleAttributeChange: (id: number, attribute: string, value: any) => void;
    removeTextSet: (id: number) => void;
    duplicateTextSet: (textSet: any) => void;
    userId: string;
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({ textSet, handleAttributeChange, removeTextSet, duplicateTextSet, userId }) => {
    const [activeControl, setActiveControl] = useState<string | null>(null);

    const controls = [
        { id: 'text', icon: <CaseSensitive size={20} />, label: 'Text' },
        { id: 'fontFamily', icon: <TypeOutline size={20} />, label: 'Font' },
        { id: 'color', icon: <Palette size={20} />, label: 'Color' },
        { id: 'position', icon: <Move size={20} />, label: 'Position' },
        { id: 'fontSize', icon: <Text size={20} />, label: 'Size' },
        { id: 'fontWeight', icon: <Bold size={20} />, label: 'Weight' },
        { id: 'opacity', icon: <LightbulbIcon size={20} />, label: 'Opacity' },
        { id: 'rotation', icon: <RotateCw size={20} />, label: 'Rotate' },
        { id: 'tiltX', icon: <ArrowLeftRight size={20} />, label: 'Tilt X' },
        { id: 'tiltY', icon: <ArrowUpDown size={20} />, label: 'Tilt Y' },
    ];

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
                                    }`}
                                >
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
                                handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
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
                                handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
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
                    <FontFamilyPicker
                        attribute="fontFamily"
                        currentFont={textSet.fontFamily}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        userId={userId}
                    />
                    <div className='flex flex-row items-start justify-start gap-10 w-full'>
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
                        label="Horizontal Tilt"
                        min={-45}
                        max={45}
                        step={1}
                        currentValue={textSet.tiltX}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="tiltY"
                        label="Vertical Tilt"
                        min={-45}
                        max={45}
                        step={1}
                        currentValue={textSet.tiltY}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                </div>

                <div className="flex flex-row gap-2 my-8">
                    <Button onClick={() => duplicateTextSet(textSet)}>Duplicate Text Set</Button>
                    <Button onClick={() => removeTextSet(textSet.id)} variant="destructive">Remove Text Set</Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

export default TextCustomizer;