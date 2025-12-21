'use client'
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { addProduct } from '@/lib/action'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Terminal, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export const AddProductForm =  () => {
  const [url,setUrl]=useState('')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null) // { type: 'success' | 'error', title: string, message: string }

  async function handleSubmit(e){
    e.preventDefault();
    setAlert(null); // Clear previous alert
    
    if (!url) {
      setAlert({
        type: 'error',
        title: 'Heads up!',
        message: 'Please enter a product URL.'
      });
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if(!user){
      setAlert({
        type: 'error',
        title: 'Heads up!',
        message: 'Please sign in to add a product.'
      });
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('url', url);
      const result = await addProduct(formData);

      if(result?.success){
        setUrl('');
        setAlert({
          type: 'success',
          title: 'Success!',
          message: 'Product added successfully.'
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to add product. Please check the URL and try again.'
      });
    } finally {
      setLoading(false);
    }
  }

  function handelChange(e){
    setUrl(e.target.value)
  }
  

  return (
    <form className='my-20 text-center' onSubmit={(e)=>handleSubmit(e)}>
      {alert && (
        <div className="w-[50%] mx-auto mb-4 max-sm:w-full max-sm:px-5">
          <Alert variant= 'destructive' >
            {alert.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
        <div className="flex w-[50%] mx-auto items-center max-sm:w-full max-sm:px-5">
        <Input type="url" placeholder="Enter product URL" value={url} className=" mx-auto block rounded-l-xl border border-gray-300 p-5 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400" onChange={(e)=>handelChange(e)} />
        <Button type="submit" disabled={loading} className=" bg-[#f3701c] text-white rounded-r-xl px-6 py-5 shadow-lg hover:bg-orange-500 transition-colors duration-300 disabled:opacity-50">
          {loading ? "Tracking..." : "Track Price"}
        </Button>
        </div>
    </form>
  )
}
