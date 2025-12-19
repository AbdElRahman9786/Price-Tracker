'use client'

import React, { createContext, useState } from 'react';




export const TogleContext = createContext(false);

function TogleProvider({children}) {
    const [isOpen, setOpen] = useState(false);
    return (
        <TogleContext.Provider value={{isOpen, setOpen}}>
            {children}
        </TogleContext.Provider>
    )
}

export default TogleProvider;
