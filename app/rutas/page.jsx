'use client'

import Boton from "@/components/Boton"
import { useData } from "./context"
import { useEffect } from "react"

export default function Rutas() {
    const { data, setData } = useData()
    useEffect(() => {
        if (data.submatriz.length !== data.restricciones+1 || data.submatriz[0].length !== data.variables+1) {
            setData({ ...data, submatriz: Array.from({ length: data.restricciones+1 }, () => Array.from({ length: data.variables+1 } )) })
        }
    }, [data.variables, data.restricciones])

    const handleChange = (row, col, e) => {
        const temp = [...data.submatriz]
        temp[row][col] = e.target.value
        setData({...data, submatriz: temp})
    }

    return <div className="mx-10 h-[calc(100vh-44px)]  overflow-y-auto">
        <div className="min-h-64 grid place-items-center">
            <h1 className="font-bold text-5xl">Transporte
            </h1>
        </div>
        <div className="grid grid-cols-[1fr_1fr] place-items-start p-2">
            <div className="grid grid-cols-2 place-items-center w-full h-full">
                <div>
                    <h2 className="text-2xl font-semibold"> Destinos </h2>
                    <h2 className="text-5xl"> {data.variables} </h2>
                </div>
                <div className="grid grid-cols-2 place-items-center gap-5">
                    <div className="cursor-pointer select-none bg-white grid py-2 px-3 rounded-xl place-items-center h-14 w-14" onClick={() => setData({ ...data, variables: data.variables + 1 })}>
                        <h1 className="font-bold text-[30px] text-black">+</h1>
                    </div>
                    <div className="cursor-pointer select-none bg-white grid py-2 px-3 rounded-xl place-items-center h-14 w-14" onClick={() => setData({ ...data, variables: data.variables > 2 ? data.variables - 1 : data.variables })}>
                        <h1 className="font-bold text-[30px] text-black">-</h1>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 place-items-center w-full h-full">
                <div>
                    <h2 className="text-2xl font-semibold"> Fuentes </h2>
                    <h2 className="text-5xl"> {data.restricciones} </h2>
                </div>
                <div className="grid grid-cols-2 place-items-center gap-5">
                    <div className="cursor-pointer select-none bg-white grid py-2 px-3 rounded-xl place-items-center h-14 w-14" onClick={() => setData({ ...data, restricciones: data.restricciones + 1 })}>
                        <h1 className="font-bold text-[30px] text-black">+</h1>
                    </div>
                    <div className="cursor-pointer select-none bg-white grid py-2 px-3 rounded-xl place-items-center h-14 w-14" onClick={() => setData({ ...data, restricciones: data.restricciones > 2 ? data.restricciones - 1 : data.restricciones })}>
                        <h1 className="font-bold text-[30px] text-black">-</h1>
                    </div>
                </div>
            </div>
        </div>
        <div className="my-3 p-2">
            <h2 className="text-2xl font-semibold pb-2"> Costos </h2>
            <div className="grid place-items-start rounded w-[calc(80vh-80)] h-full overflow-x-auto">
                <div className={`flex content-center p-2 gap-2 `}>
                    <div className="w-[100px] grid place-items-center"> D/F</div>
                    {[...Array(data.variables+1)].map((e, i) => (
                        <h3 key={i} className="bg-neutral-900 grid place-items-center min-w-20 h-8 border-2 border-white rounded">{i != data.variables ? `Destino ${i + 1}` : `Oferta`}</h3>
                    ))
                    }
                </div>
                <div className="grid place-items-start p-2 gap-y-2">
                    {
                        data.submatriz.map((a, b) => (
                            <div className="text-white flex gap-2 content-center" key={b}>
                                <div className="w-[100px] border-2 border-white rounded grid place-items-center"> {b != data.restricciones ? `Fuente ${b+1}` : `Demanda`} </div>
                                {
                                    a.map((d, i) => { 
                                        return b == data.restricciones && i == data.variables  ? null
                                        : (
                                        <div key={i} className={`bg-neutral-900 grid place-items-center w-20 h-8 border-2 ${i == data.variables || b == data.restricciones? 'border-cyan-400' : 'border-white'} rounded`}>
                                            <input type="text" value={d} className="appearance-none w-full bg-transparent rounded px-3 focus:outline-none" onChange={(e) => handleChange(b, i, e)}/>
                                        </div>
                                    )
                                })
                                }</div>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
}