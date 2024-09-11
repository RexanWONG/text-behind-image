'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser';
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Design } from '@/types';
import NavbarDesign from '@/components/navbar-design';
import Authenticate from '@/components/authenticate';
import Editor from '@/components/editor';

interface IParams {
  id: number;
} 

const page = ({ params }: { params: IParams }) => {
  const { user } = useUser()
  const { session } = useSessionContext()
  const { toast } = useToast()

  const supabase = useSupabaseClient()

  const [design, setDesign] = useState<Design[]>()

  const getDesignById = async () => {
    try {
      let { data: design } = await supabase
        .from('designs')
        .select("*")
        .eq('id', params.id)

      setDesign(design || [])

    } catch (error) {
      toast({
        title: "🔴 An error occurred",
        description: "Sorry about that, please try again"
      })
    }
  }

  useEffect(() => {
    getDesignById()
  }, [design, setDesign])
  

  return (
    <>
      {user && session && session.user ? (
          <div className='flex flex-col min-h-screen'>
              <NavbarDesign designId={params.id}/>
              <Separator /> 

              {design ? (
                <div className='p-5 px-10'>
                  <Editor design={design} />
                </div>
              ) : (
                <></>
              )}
          </div>
        ) : (
            <Authenticate />
        )}
      </>
  )
}

export default page  
