import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <div className='flex flex-row items-center justify-between p-5 px-10'>
        <h2 className="text-2xl font-semibold tracking-tight">
            Text behind image
        </h2>

        <div>
            <Button>
                Upload image
            </Button>
        </div>
    </div>
  )
}

export default Navbar