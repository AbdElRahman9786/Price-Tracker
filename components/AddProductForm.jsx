'use client'
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { addProduct } from '@/lib/action'

export const AddProductForm = () => {
  const [url,setUrl]=useState('')
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(e){
    e.preventDefault();
    if (!url) {
      alert("Please enter a URL");
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('url', url);
      const result = await addProduct(formData);

      if(result?.success){
        alert("Product added successfully!");
        setUrl('');
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add product. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handelChange(e){
    setUrl(e.target.value)
  }
  

  return (
    <form className='my-20 text-center' onSubmit={(e)=>handleSubmit(e)}>
        <div className="flex w-[50%] mx-auto items-center max-sm:w-full max-sm:px-5">
        <Input type="url" placeholder="Enter product URL" value={url} className=" mx-auto block rounded-l-xl border border-gray-300 p-5 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400" onChange={(e)=>handelChange(e)} />
        <Button type="submit" disabled={loading} className=" bg-[#f3701c] text-white rounded-r-xl px-6 py-5 shadow-lg hover:bg-orange-500 transition-colors duration-300 disabled:opacity-50">
          {loading ? "Tracking..." : "Track Price"}
        </Button>
        </div>
    </form>
  )
}
