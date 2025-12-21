
import { getProducts } from '@/lib/action';
import { createClient } from '@/utils/supabase/server';
import { TrendingDown } from 'lucide-react'
import React from 'react'
import ProductCard from './ProductCard';

export const Products = async () => {
  const Supabase=await createClient(); 
  const {data:{user}}=await Supabase.auth.getUser();
  let products = [];
  // If no user is logged in, don't show products section
  

  try {
    products = await getProducts();
    
  } catch (error) {
    
    products = [];
  }




  return (
    <>
    {!user || products.length === 0 ? (
  <section className="max-w-2xl mx-auto px-4 pb-20 text-center mt-20">
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12">
            <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-600">
              Add your first product above to start tracking prices!
            </p>
          </div>
        </section>
    ):(
     
      <div className='grid grid-cols-3 gap-3 my-10 px-5 max-sm:grid-cols-1 max-md:grid-cols-2'>
      {products.map((product)=>
        
        
       <ProductCard key={product.id} product={product} />
       
       
      )}
      </div>
    )}
    </>
  )
}