'use client'
import { useEffect, useState } from "react";
import { useData } from "../context"
import { minZeroRow, markMatrix, adjustMatrix, balance, resolver, solucion } from './algoritmo'



export default function Hungaro() {
    const { data, setData } = useData()
    const [legal, setLegal] = useState(false);
    const [info, setInfo] = useState({})
    const [nao, setNao] = useState(true)
    useEffect(() => {
        let condition = true;
        setLegal(true)
    }, [])

    useEffect(() => {
        let mm = true;
        data.submatriz.map((a, b) => {
            a.map((c, d) => {
                if (c == '') {
                    mm = false;
                }
            })
        })
        setNao(mm);
        if (nao && mm) {
            let sdata = structuredClone(data.submatriz)
            sdata = sdata.map((a, b) => {
                return a.map((c, d) => { return parseFloat(c) })

            })
            balance(sdata)
            let ansPos = resolver(structuredClone(sdata));
            let [ans, ansMat] = solucion(sdata, ansPos);
            console.log(`Costo minimo: ${ans}`);
            console.log("Matriz de asignaciones:");
            console.log(ansMat)
            let answers = []
            let allocations = []
            for (let i = 0; i < ansMat.length; i++) {
                for (let j = 0; j < ansMat[0].length; j++) {
                    if (ansMat[i][j] > 0) {
                        answers.push(ansMat[i][j])
                        allocations.push({ candidato: `Candidato: ${i + 1}`, tarea: `Tarea: ${j + 1}`, precio: ansMat[i][j] })
                    }
                }
            }
            let hey = {
                totalCost: ans,
                allocations: allocations,
                answer: answers
            }
            setInfo(hey)
        }
    }, [legal])

    return (<div className="mx-10 h-[calc(100vh-44px)] py-20 overflow-y-auto">
        <div className="min-h-64 grid place-items-start gap-3">
            <h1 className="font-bold text-5xl">Método Hungaro
            </h1>
            <h2 className="text-2xl font-bold">
                Descripión:
            </h2>
            <h3>
                El modelo de asignación es un caso especial del modelo de transporte, en el
                que los recursos se asignan a las actividades en términos de uno a uno,
                haciendo notar que la matriz correspondiente debe ser cuadrada. Así entonces
                cada recurso debe asignarse, de modo único a una actividad particular o
                asignación.
            </h3>
            <div>
                {
                    nao ?
                        <div className="grid gap-3">

                            <h3 className="text-2xl font-semibold">
                                Datos con resultado:
                            </h3>
                            <div>

                                <div className="rounded-md border-2  border-slate-600 bg-slate-600 p-[0.5px] w-full">
                                    <div className="flex">
                                        <span className="w-28"></span>
                                        {nao ? data.submatriz[0].map((row, rowIndex) => (
                                            <div key={rowIndex} className="flex">
                                                <span className={` grid place-items-center border-slate-500 w-28 p-2 overflow-auto`}> {`Tarea ${rowIndex + 1}`} </span>
                                            </div>
                                        ))
                                            : null
                                        }
                                    </div>
                                    <div>
                                        {typeof info.answer != 'undefined' ? data.submatriz.map((row, rowIndex) => (
                                            <div key={rowIndex} className="flex">
                                                <span className="grid place-items-center bg-cyan-950  text-[14px]   w-28 p-2 overflow-auto">{`Responsable ${rowIndex + 1}`}</span>
                                                {row.map((cell, cellIndex) => (
                                                    <span key={cellIndex} className={`${info.answer.includes(parseFloat(cell)) ? 'bg-cyan-300/40' : 'bg-slate-700'} grid place-items-center  border-slate-500 w-28 p-2 overflow-auto`}>{cell} </span>
                                                ))}
                                            </div>
                                        ))
                                            : null
                                        }
                                    </div>
                                </div>

                            </div>
                            <h3 className="text-2xl font-bold">
                                Solución:
                            </h3>
                            <div>
                                {nao ?
                                    <div>
                                        <h2>
                                            Costo mínimo: {info.totalCost && (info.totalCost)}
                                        </h2>
                                        <h2>
                                            Por lo tanto, la asignación óptima es:
                                        </h2>
                                        <div className="flex gap-6 mt-1">
                                            {
                                                info.totalCost && (
                                                    info.allocations.map((a, b) => (
                                                        <div key={b} className="border rounded p-2">
                                                            {a.candidato}
                                                            <br />
                                                            {a.tarea}
                                                            <br />
                                                            Costo: {a.precio}
                                                        </div>
                                                    ))
                                                )
                                            }
                                        </div>
                                    </div>
                                    : <div className="text-red-400 font-semibold">
                                        - Verifique que todos los datos están completos.
                                        <br />
                                        - Verifique que la oferta es igual a la demanda.
                                    </div>
                                }
                            </div>
                        </div>
                        : 
                        <h3 className="text-2xl font-bold text-rose-500 [text-shadow:4px_4px_8px_var(--tw-shadow-color)]  shadow-red-600">
                            Complete los datos.
                        </h3>
                }
            </div>
        </div>

    </div>
    )

}
