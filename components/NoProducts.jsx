import { TrendingDown } from 'lucide-react'
import React from 'react'

export const NoProducts = () => {
  return (
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
  )
}
