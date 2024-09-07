'use client'

import React from 'react';
import { removeBackground } from "@imgly/background-removal"; 
import Navbar from '@/components/navbar';
import { Separator } from '@/components/ui/separator';
import Authenticate from '@/components/authenticate';

const page = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar />
            <Separator />

            <Authenticate />
        </div>
    );
}

export default page;  