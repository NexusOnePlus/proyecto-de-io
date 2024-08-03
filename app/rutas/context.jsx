'use client'
import { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
export const AppContext = createContext();

export const useData = () => {
    const data = useContext(AppContext)
    if (!data) throw new Error('useData no tiene provider')
    return data
}

export const AppWrapper = ({ children }) => {
    const initial = {
        variables: 2,
        restricciones: 2,
        submatriz: []
    }
    const [data, setData] = useLocalStorage('info', initial)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])
    if(!isClient){
        return null
    }
    return (
        <AppContext.Provider value={{ data, setData }}>
            {children}
        </AppContext.Provider>
    )
}