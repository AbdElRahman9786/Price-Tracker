import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { LogInIcon } from 'lucide-react'



export const NavBar = () => {
  return (
   <nav className="mx-auto block mt-5  top-5 z-50 w-[95%] max-w-6xl">
    <div className='flex justify-between items-center px-6 py-3 rounded-2xl bg-transparent backdrop-blur-xl border border-white/30 shadow-xl'>
        <Image src="/deal-drop-logo-removebg-preview.png" alt="Deal Tracker Logo" width={600} height={200} className="w-24"/>
        <Button variant="" className="rounded-xl bg-[#f3701c] text-white">
            <LogInIcon/>
            Sign In</Button>
    </div>
   </nav>
  )
}
