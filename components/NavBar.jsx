'use client'
import Image from 'next/image'
import React, { useContext, useState, useEffect } from 'react'
import { Button } from './ui/button'
import { LogInIcon, LogOut } from 'lucide-react'
import { SignInDialog } from './SignInDialog'
import { TogleContext } from '@/context/togleContext'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'



export const NavBar = () => {
  const {isOpen,setOpen} = useContext(TogleContext);
  const [user,setUser]=useState(null);
  const supabase = createClient();

  useEffect(() => {
    // Get user on mount
    supabase.auth.getUser().then(({data})=>{
      setUser(data.user);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  function handleSignOut(){
    supabase.auth.signOut().then(({error})=>{
      if(!error){
        setUser(null);
        redirect('/');
      }
    })
  }

  return (
   <nav className="mx-auto block mt-5  top-5 z-50 w-[95%] max-w-6xl">
    <div className='flex justify-between items-center px-6 py-3 rounded-2xl bg-transparent backdrop-blur-xl border border-white/30 shadow-xl'>
        <Image src="/deal-drop-logo-removebg-preview.png" alt="Deal Tracker Logo" width={600} height={200} className="w-24"/>
      
            {user?(
              <Button variant="" className="rounded-xl bg-[#f3701c] text-white" onClick={handleSignOut} >
            <LogOut/>
            Sign Out</Button>
            ):(
  <Button variant="" className="rounded-xl bg-[#f3701c] text-white" onClick={()=>setOpen(true)} >
            <LogInIcon/>
            Sign In</Button>
            )}
    </div>
   </nav>
  )
}
