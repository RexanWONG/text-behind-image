import React, { useState } from 'react'
import { Button } from './ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
import { generateSlug } from "random-word-slugs";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react'

interface NewDesignButtonProps {
    userId: string;
}

const NewDesignButton:React.FC<NewDesignButtonProps> = ({ userId }) => {
    const router = useRouter()
    const supabase = useSupabaseClient()
    const { toast } = useToast()

    const [isCreatingNewDesign, setIsCreatingNewDesign] = useState<boolean>(false)

    const createNewDesign = async () => {
        try {
            setIsCreatingNewDesign(true)

            const { data: supabaseData, error: supabaseError } = await supabase
                 .from('designs')
                 .insert({
                     creator: userId,
                     name: generateSlug(),
                     created_at: new Date().toISOString()
                 })
                 .select()

            if (supabaseError) {
                toast({
                    title: "🔴 An error occured",
                    description: supabaseError.hint
                })
            } else {
                const id = supabaseData[0].id
                router.push(`/design/${id}`)
                toast({
                    title: "🎉 New design created!",
                })
            }

            setIsCreatingNewDesign(false)
        } catch (error) {
            toast({
                title: "🔴 An error occured",
                description: "Sorry about that, please try again"
            })

            setIsCreatingNewDesign(false)
        }
    }

    return (
        isCreatingNewDesign ? (
            <Button disabled>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Creating new design
            </Button>
        ) : (
            <Button variant={'secondary'} onClick={createNewDesign}>
                Create new design
            </Button>
        )
    )
}

export default NewDesignButton