'use client'
import { createContext, useState } from "react";

const AppContext = createContext();

export default function AppWrapper({children}) {
    const [data, setData] = useState({})
    return (
        <AppContext.Provider value={{data, setData}}>
            {children}
        </AppContext.Provider>
    )
}