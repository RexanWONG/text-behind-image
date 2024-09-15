import React from 'react';
import InputField from './input-field';
import SliderField from './slider-field';
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
        top: number;
        left: number;
        color: string;
        fontSize: number;
        fontWeight: number;
    };
    handleAttributeChange: (id: number, attribute: string, value: any) => void;
    removeTextSet: (id: number) => void;
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({ textSet, handleAttributeChange, removeTextSet }) => {
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
                <SliderField
                    attribute="fontSize"
                    label="Font Size"
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
                <Button onClick={() => removeTextSet(textSet.id)} variant="destructive" className='mt-8'>Remove Text Set</Button>
            </AccordionContent>
        </AccordionItem>
    );
};

export default TextCustomizer;