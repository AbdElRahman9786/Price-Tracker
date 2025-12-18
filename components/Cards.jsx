import React from 'react'
import { TrendingDown, Shield, Bell, Rabbit } from "lucide-react";
export const Cards = () => {
    const cards=[
        {id:1,    
        title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content", icon:Rabbit},
        {id:2,  
         title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",icon:Shield},
        {
            id:3,  title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",icon:Bell
        }
    ]
  return (
    <div className='grid grid-cols-3 justify-center items-center gap-4 mt-10 max-w-6xl mx-auto'>
        {cards.map((card)=>{
            return(
                <div key={card.id} className='bg-white/70 backdrop-blur-lg border border-white/30 shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 min-h-44'>
                    <card.icon className='mb-4 '/>
                    {card.title}
                    {card.description}

                </div>
            )
        })}
    </div>
  )
}
