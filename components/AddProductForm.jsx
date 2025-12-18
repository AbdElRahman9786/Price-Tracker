import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

export const AddProductForm = () => {
  return (
    <form className='my-20 text-center'>
        <div className="flex w-[50%] mx-auto items-center">
        <Input type="url" placeholder="Enter product URL" className=" mx-auto block rounded-l-xl border border-gray-300 p-5 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"/>
        <Button type="submit" className=" bg-[#f3701c] text-white rounded-r-xl px-6 py-5 shadow-lg hover:bg-orange-500 transition-colors duration-300">Track Price</Button>
        </div>
    </form>
  )
}
