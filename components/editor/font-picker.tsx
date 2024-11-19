'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { CaretSortIcon, CheckIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { FREE_FONTS, ALL_FONTS } from '@/constants/fonts';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface FontFamilyPickerProps { 
  attribute: string;
  currentFont: string;
  handleAttributeChange: (attribute: string, value: string) => void;
  userId: string;
}

const FontFamilyPicker: React.FC<FontFamilyPickerProps> = ({
  attribute,
  currentFont,
  handleAttributeChange,
  userId
}) => {
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

  return (
    <Popover>
      <div className='flex flex-col items-start justify-start my-8'>
        <Label>
          Font Family {!isPaidUser && <span className="text-xs text-muted-foreground ml-2">(6 free fonts available)</span>}
        </Label>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between mt-3 p-2",
              !currentFont && "text-muted-foreground"
            )}
          >
            {currentFont ? currentFont : "Select font family"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search font family..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No font family found.</CommandEmpty>
            {!isPaidUser && (
              <CommandGroup heading="Free Fonts">
                {FREE_FONTS.map((font) => (
                  <CommandItem
                    value={font}
                    key={font}
                    onSelect={() => handleAttributeChange(attribute, font)}
                    className='hover:cursor-pointer'
                    style={{ fontFamily: font }}
                  >
                    {font}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        font === currentFont ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandGroup heading={isPaidUser ? "All Fonts" : "Premium Fonts (Upgrade to Access)"}>
              {(isPaidUser ? ALL_FONTS : ALL_FONTS.filter(f => !FREE_FONTS.includes(f))).map((font) => (
                <CommandItem
                  value={font}
                  key={font}
                  onSelect={() => isPaidUser && handleAttributeChange(attribute, font)}
                  className={cn(
                    'hover:cursor-pointer',
                    !isPaidUser && 'opacity-50 hover:cursor-not-allowed'
                  )}
                  style={{ fontFamily: font }}
                >
                  {font}
                  {!isPaidUser && <LockClosedIcon className="ml-auto h-4 w-4" />}
                  {isPaidUser && (
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        font === currentFont ? "opacity-100" : "opacity-0"
                      )}
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default FontFamilyPicker;