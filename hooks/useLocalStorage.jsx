'use client'
import { useEffect, useState } from "react"
export const useLocalStorage = (key, initialState) => {
  const [state, setState] = useState(() => {
    if(typeof window !== "undefined"){
      const item = localStorage.getItem(key)
      const data = JSON.parse(item)
      if (data) {
        return data;
      }}
      return initialState
  })
  useEffect(() => {
    setState(JSON.parse(localStorage.getItem(key)))
  }, [])
    useEffect(() => {
          localStorage.setItem(key, JSON.stringify(state))
    }, [state])
    return [state, setState]
}
