'use client'

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface InputFieldProps {
  attribute: string;
  label: string;
  currentValue: string;
  handleAttributeChange: (attribute: string, value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  attribute,
  label,
  currentValue,
  handleAttributeChange
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    handleAttributeChange(attribute, value);
  };

  return (
    <>
      <div className="flex flex-col items-start">
        {/* <Label htmlFor={attribute}>{label}</Label> */}
        <Input
          type="text"
          placeholder='text'
          value={currentValue}
          onChange={handleInputChange}
          className='mt-2'
        />
      </div>
    </>
  );
};

export default InputField;