'use client'

import Boton from "@/components/Boton"

export default function Lineal() {
    return <div className="mx-10">
        <div className="min-h-64 grid place-items-center">
            <h1 className="font-bold text-5xl">Programación Lineal
            </h1>
        </div>
        <div className="grid grid-cols-[2fr_3fr_3fr] place-items-start p-2">
            <div>
                <h2 className="text-2xl font-semibold"> Funcion </h2>
                <h3> Tipo de funcion </h3>
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <Boton name='Maximizar' />
                    <Boton name='Minimizar' />
                </div>
            </div>
            <div className="grid grid-cols-2 place-items-center w-full h-full">
                <div>
                    <h2 className="text-2xl font-semibold"> Variables</h2>
                    <h2 className="text-5xl"> 0 </h2>
                </div>
                <div className="grid grid-cols-2 place-items-center gap-5">
                    <div className="bg-white grid py-2 px-3 rounded-xl place-items-center h-14 w-14">
                        <h1 className="font-bold text-[30px] text-black">+</h1>
                    </div>
                    <div className="bg-white grid py-2 px-3 rounded-xl place-items-center h-14 w-14">
                        <h1 className="font-bold text-[30px] text-black">-</h1>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 place-items-center w-full h-full">
                <div>
                    <h2 className="text-2xl font-semibold"> Restricciones </h2>
                    <h2 className="text-5xl"> 0 </h2>
                </div>
                <div className="grid grid-cols-2 place-items-center gap-5">
                    <div className="bg-white grid py-2 px-3 rounded-xl place-items-center h-14 w-14">
                        <h1 className="font-bold text-[30px] text-black">+</h1>
                    </div>
                    <div className="bg-white grid py-2 px-3 rounded-xl place-items-center h-14 w-14">
                        <h1 className="font-bold text-[30px] text-black">-</h1>
                    </div>
                </div>
            </div>
        </div>
        <div className="my-3 p-2">
            <h2 className="text-2xl font-semibold"> Restricciones </h2>
        </div>
    </div>
}