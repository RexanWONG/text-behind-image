'use client'

import React from 'react'
import { useUser } from '@/hooks/useUser';
import { useSessionContext } from '@supabase/auth-helpers-react';

import { Separator } from '@/components/ui/separator';
import NavbarDesign from '@/components/navbar-design';
import Authenticate from '@/components/authenticate';

interface IParams {
  id: number;
} 

const page = ({ params }: { params: IParams }) => {
  const { user } = useUser()
  const { session } = useSessionContext()

  return (
    <>
      {user && session && session.user ? (
          <div className='flex flex-col min-h-screen'>
              <NavbarDesign designId={params.id}/>
              <Separator /> 
          </div>
        ) : (
            <Authenticate />
        )}
      </>
  )
}

export default page  
