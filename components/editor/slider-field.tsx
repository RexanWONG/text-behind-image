'use client'

import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';     

interface SliderFieldProps {
  attribute: string;
  label: string;
  min: number;
  max: number;
  step: number;
  currentValue: number;
  handleAttributeChange: (attribute: string, value: number) => void;
}

const SliderField: React.FC<SliderFieldProps> = ({
    attribute,
    label,
    min,
    max,
    step,
    currentValue,
    handleAttributeChange
  }) => { 
    const handleSliderInputFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      handleAttributeChange(attribute, value);
    };
  
    return (
      <>
        <div className="flex items-center justify-between mt-8">
          <Label htmlFor={attribute}>{label}</Label>
          <Input
            type="text"
            value={currentValue}
            onChange={handleSliderInputFieldChange}
            className="w-12 rounded-md border border-transparent px-2 py-0.5 text-center text-sm text-muted-foreground hover:border-border hover:text-foreground hover:animate-pulse"
            min={min}
            max={max}
            step={step}
          />
        </div>
        <Slider
          id={attribute}
          min={min}
          max={max}
          value={[currentValue]}
          step={step}
          onValueChange={(value) => handleAttributeChange(attribute, value[0])}
          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 mt-2"
          aria-label={label}
        />
      </>
    );
};

export default SliderField