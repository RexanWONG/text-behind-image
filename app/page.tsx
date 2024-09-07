'use client'

import React from 'react';
import { useUser } from '@/hooks/useUser';
import { useSessionContext } from '@supabase/auth-helpers-react';

import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/navbar';
import Authenticate from '@/components/authenticate';

const page = () => {
    const { user } = useUser()
    const { session } = useSessionContext()

    return (
        <>
            {user && session && session.user ? (
                <div className='flex flex-col min-h-screen'>
                    <Navbar />
                    <Separator /> 
                </div>
            ) : (
                <Authenticate />
            )}
            
        </>
    );
}

export default page;    