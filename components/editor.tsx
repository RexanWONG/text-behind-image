import React from 'react'
import { Design } from '@/types'
import Image from 'next/image'

interface EditorProps {
    design: Design[]
}

const Editor: React.FC<EditorProps> = ({ design }) => {
  return (
    <div className='flex flex-row items-start justify-start'>
        <div className="min-h-[400px] w-[80%] p-4 md:min-h-[700px] lg:min-h-[700px] border border-border rounded-lg relative overflow-hidden">
            <Image
                src={design[0].image}
                alt={design[0].name}
                layout="fill"
                objectFit="contain" 
                objectPosition="center" 
                className="rounded-lg"
            />
        </div>
        <div className='flex flex-col w-[20%] p-4'>
            Hello
        </div>
    </div>
  )
}

export default Editor