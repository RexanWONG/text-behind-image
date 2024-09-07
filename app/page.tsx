'use client'

import Image from 'next/image';
import React from 'react';
import { removeBackground } from "@imgly/background-removal"; // Updated import

const Page = () => {
    const [removedBackgroundImage, setRemovedBackgroundImage] = React.useState<string>('');
    const [isRunning, setIsRunning] = React.useState<boolean>(false);
    const [caption, setCaption] = React.useState<string>('Click to remove background');

    const config = {
        debug: false,
        output: {
            quality: 1,
            format: 'image/png'
        }
    };

    const setup = async () => {
        setIsRunning(true);
        setCaption('Processing...');

        try {
            const imageUrl = 'https://images.unsplash.com/photo-1724454920878-a4cba430db4c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D';
            const imageBlob = await removeBackground(imageUrl);
            const url = URL.createObjectURL(imageBlob);
            setRemovedBackgroundImage(url);
            setCaption('Background removed!');
        } catch (error) {
            console.error(error);
            setCaption('Error removing background');
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div>
            <Image 
                src='https://images.unsplash.com/photo-1724454920878-a4cba430db4c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMjN8fHxlbnwwfHx8fHw%3D' 
                alt='Original Image'
                width={200}
                height={200}
            />

            <button onClick={setup} disabled={isRunning}>
                {isRunning ? 'Processing...' : 'Remove Background'}
            </button>

            {removedBackgroundImage && (
                <Image 
                    src={removedBackgroundImage}
                    alt='Removed Background Image'
                    width={200}
                    height={200}
                />
            )}

            <p>{caption}</p>
        </div>
    );
}

export default Page;