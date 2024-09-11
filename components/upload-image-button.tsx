import React, { useState, useRef } from 'react'
import { Button } from './ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { generateHash } from '@/lib/utils';

interface UploadImageButtonProps {
  designId: number;
}

const UploadImageButton: React.FC<UploadImageButtonProps> = ({ designId }) => {
  const supabase = useSupabaseClient()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false)

  const handleUploadImage = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploadingImage(true)
      let newFileName = generateHash(file.name)

      // upload image into bucket
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(newFileName, file, {
            cacheControl: '3600',
            upsert: false
      });

      if (uploadError) {
          toast({
              title: "🔴 An error occurred",
              description: uploadError.message
          })
          throw uploadError;
      }

      const returnedUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${newFileName}`;   

      // update image column
      const { error: updateError } = await supabase
        .from('designs')
        .update({
            image: returnedUrl
        })
      .eq('id', designId);

      if (updateError) {
          toast({
              title: "🔴 An error occurred",
              description: updateError.message
          })
          throw updateError;
      }

      toast({
        title: "🎉 Image uploaded successfully",
      })

      setIsUploadingImage(false)
    } catch (error) {
      console.log(error)
      toast({
        title: "🔴 An error occurred",
        description: "Sorry about that, please try again"
      })

      setIsUploadingImage(false)
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />
      {isUploadingImage ? (
        <Button disabled>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Uploading image
        </Button>
      ) : (
        <Button onClick={handleUploadImage}>
          Upload image
        </Button>
      )}
    </>
  )
}

export default UploadImageButton