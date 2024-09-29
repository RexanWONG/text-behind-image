import React from 'react';
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
    };
    handleAttributeChange: (id: number, attribute: string, value: any) => void;
    removeTextSet: (id: number) => void;
    duplicateTextSet: (textSet: any) => void; // Add this line
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({ textSet, handleAttributeChange, removeTextSet, duplicateTextSet }) => {
    return (
        <AccordionItem value={`item-${textSet.id}`}>
            <AccordionTrigger>{textSet.text}</AccordionTrigger>
            <AccordionContent className='p-1'>
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
                <div className="flex flex-row gap-2 my-8">
                    <Button onClick={() => duplicateTextSet(textSet)}>Duplicate Text Set</Button>
                    <Button onClick={() => removeTextSet(textSet.id)} variant="destructive">Remove Text Set</Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

export default TextCustomizer;