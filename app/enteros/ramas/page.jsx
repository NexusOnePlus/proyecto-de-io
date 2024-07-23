'use client'
import { useState, useEffect } from 'react';
import { simplex } from './algorithms'
import { useData } from "../context"

export default function Ramas() {
    const { data, setData } = useData();
    const [info, setInfo] = useState({});

    useEffect(() => {
        let temp = [...data.submatriz]
        temp = temp.map((a, b) => {
            return a.map((c, d) => {
                if (d != data.variables) {
                    return isNaN(parseInt(c)) == true ? '0' : c
                }
                return c
            })
        })
        setInfo(simplex(temp));
    }, []);
    return (<div className="mx-10 h-[calc(100vh-44px)] py-20 overflow-y-auto">
        <div className="min-h-64 grid place-items-start gap-3">
            <h1 className="font-bold text-5xl">Método Ramificacion y Acotacion
            </h1>
            <h2 className="text-2xl font-bold">
                Descripión:
            </h2>
            <h3 >
                Una solución.
            </h3>
            <div>
                <h2 className="text-2xl font-semibold"> Pre-solucion básica: </h2>
                <h3>Los resultados serían los siguientes:
                    {Object.entries(info).map(([variable, value]) => (
                        <div key={variable}>
                            {variable} = {value}
                        </div>
                    ))}</h3>
            </div>
            <div>
                <h2 className="text-2xl font-semibold"> Solucion: </h2>
                <div>
                    
                </div>


            </div>
        </div>
    </div>
    )
}
