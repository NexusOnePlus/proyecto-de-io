'use client'
import { useEffect, useState } from "react";
import { useData } from "../context"
const Tablitas = ({ matrix }) => {
    const formatNumber = (num) => {
        let signos = ['<=', '<', '>', '>=', '=']
        if (signos.includes(num)) { return num }
        const number = parseFloat(num);
        if (Number.isInteger(number)) {
            return number;
        } else {
            return number.toFixed(2);
        }
    };

    return (
        <div className="rounded-md border-2  border-slate-600 bg-slate-600 p-[0.5px] w-full">
            {matrix.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {row.map((cell, cellIndex) => (
                        <span key={cellIndex} className={` ${rowIndex == 0 ? 'bg-slate-600' : (cellIndex == 0 ? 'bg-cyan-950' : 'bg-slate-700')} grid place-items-center border-slate-500 w-12 p-2 overflow-auto`}>{cellIndex == 0 || rowIndex == 0 ? cell : formatNumber(cell)} </span>
                    ))}
                </div>
            ))}
        </div>
    );
};

const getVariableValues = (matrix) => {
    const headers = matrix[0];
    const variableValues = {};

    headers.forEach((header) => {
        if (header.startsWith('X')) {
            variableValues[header] = 0;
        }
    });

    matrix.forEach(row => {
        const variable = row[0];
        if (variable.startsWith('X')) {
            variableValues[variable] = row[row.length - 1];
        }
    });
    console.log(variableValues)
    return variableValues;
};




const resolver = (matriz) => {
    var lado, barra;
        const formateo = (matriz, columna, filas) => {
            // console.log("matriz ", ...matriz, "columa: ", columna, "fila: ", filas)
            let variables = matriz[0].length - matriz.length;
            let a = 1, b = 1, c = 1;
            
            if (barra == undefined) {barra = Array.from({ length: matriz[0].length + 1 }, (i, j) => {
                return j < variables ? `X${a++}` : (j == matriz[0].length - 1 ? '=' : (j == matriz[0].length ? 'R' : `S${b++}`));
            })
            barra.unshift(' ')
        }
            if (lado == undefined) {lado = Array.from({ length: matriz.length }, (i, j) => { return j == 0 ? "Z" : `S${c++}` })}
        
            if (filas != undefined) {
                lado[filas] = barra[columna + 1]
            }
        
            let log = structuredClone(matriz)
            log = log.map((fila, i) => {
                let colita = fila[fila.length - 1];
                let nuevafila = fila.slice(0, -1);
                nuevafila = nuevafila.concat('=');
                nuevafila.push(colita)
                nuevafila.unshift(lado[i])
                return nuevafila;
            })
            log.unshift(barra)
            console.log(...log)
            return log
        }
    let textos = [];
    let pasos = [];
    const temp = matriz.map((a, c) => {
        const b = a.filter(exp => isNaN(parseInt(exp)) !== true)

        return b.map((e) => {
            if (c == 0) {
                return -parseFloat(e);
            }
            return parseFloat(e);
        })
    })
    let holguras = temp.length;
    let identidad = Array.from({ length: holguras }, (_, i) =>
        Array.from({ length: holguras - 1 }, (_, j) => i === 0 ? 0 : (i - 1 === j ? 1 : 0))
    );
    let tabla = temp.map((fila, i) => {
        let colita = fila[fila.length - 1];
        let nuevafila = fila.slice(0, -1);
        nuevafila = nuevafila.concat(identidad[i]);
        nuevafila.push(colita)
        return nuevafila;
    })
    let negativos = true;
    while (negativos) {
        let pivotCol, pivotFil;

        for (let i = 0, j = 0, valor = Infinity; j < tabla.length; j++) {
            if (tabla[i][j] < valor && tabla[i][j] < 0) {
                valor = tabla[i][j]
                pivotCol = j;
            }
        }
        if (pivotCol == undefined) {
            break;
        } else {
            for (let i = 1, j = pivotCol, valor = Infinity; i < tabla.length; i++) {
                if ((tabla[i][tabla[i].length - 1] / tabla[i][j]) < valor && tabla[i][j] > 0) {
                    valor = (tabla[i][tabla[i].length - 1] / tabla[i][j]);
                    valor = parseFloat(valor.toFixed(2));
                    pivotFil = i;
                }
            }
            if (pivotFil != undefined) {
                let realpivot = [...tabla[pivotFil]]
                if (realpivot[pivotCol] != 1) {
                    for (let i = 0; i < tabla[pivotFil].length; i++) {
                        tabla[pivotFil][i] = (tabla[pivotFil][i] / realpivot[pivotCol]);
                        tabla[pivotFil][i] = parseFloat(tabla[pivotFil][i].toFixed(2));
                    }
                }
                pasos.push(structuredClone(formateo(tabla, pivotCol, pivotFil)))
                realpivot = [...tabla[pivotFil]];
                let sumaresta = tabla[0][pivotCol] * -1;
                for (let i = 0; i < tabla[0].length; i++) {
                    tabla[0][i] = tabla[0][i] + (realpivot[i] * sumaresta);
                }
                pasos.push(structuredClone(formateo(tabla, pivotCol, pivotFil)))

                for (let i = 1; i < tabla.length; i++) {
                    let a = tabla[i][pivotCol];
                    if (i != pivotFil && tabla[i][pivotCol] != 0) {
                        for (let j = 0; j < tabla[0].length; j++) {
                            tabla[i][j] = tabla[i][j] - (realpivot[j] * a)
                        }
                    }
                }

                pasos.push(structuredClone(formateo(tabla, pivotCol, pivotFil)))
            } else {
                negativos = false;
            }
        }
    }

    return { pasos, textos }
}



export default function Simplex() {
    const { data, setData } = useData();
    const [legal, setLegal] = useState(false);
    const [info, setInfo] = useState({})

    useEffect(() => {
        let condition = true;
        data.submatriz.map((a, b) => {
            a.map((c, d) => {
                if (d == a.length - 2 && c != '<=' && b != 0) {
                    condition = false;
                }
            })
        })
        if (condition) {
            setLegal(true)
        }
    }, [])

    useEffect(() => {
        if (legal) {
            let temp = [...data.submatriz]
            temp = temp.map((a, b) => {
                return a.map((c, d) => {
                    if (d != data.variables) {
                        return isNaN(parseInt(c)) == true ? '0' : c
                    }
                    return c
                })
            })
            setData({ ...data, submatriz: temp })
            setInfo(resolver(data.submatriz))
        }
    }, [legal])


    return (<div className="mx-10 h-[calc(100vh-44px)] py-20 overflow-y-auto">
        <div className="min-h-64 grid place-items-start gap-3">
            <h1 className="font-bold text-5xl">Método Simplex
            </h1>
            <h2 className="text-2xl font-bold">
                Descripión:
            </h2>
            <h3 >
                Una solución que consiste en tratar a la funcion Z como si fuera una de las restricciones originales.
                <br />
                Se reescribe la funcion objetivo en funcion a 0.
                <br />
                Como se encuentra en forma de igualdad no necesita variables de holgura, pero se agrega Z con la finalidad de obtener su valor.
                <br />
            </h3>
            <h3>
                La solución BF (solución básica factible) si y solo si todos los coeficientes de la fila 0 son negativos.
            </h3>
            <div>
                <h2 className="text-2xl font-semibold"> Disponibilidad: </h2>
                {legal == false
                    ? (<h2 className="text-rose-500 font-bold"> El método gráfico solo esta disponible para funciones objetivo de maximización, así como restricciones {'<='}. </h2>)
                    : (<h2 className="text-emerald-400 font-semibold"> Compatible </h2>)
                }
            </div>
            <div>
                {legal == false
                    ? null
                    : (
                        <div>
                            <h2 className="text-2xl font-semibold">Resolución: </h2>
                            <div >
                                {info.pasos && (
                                    info.pasos.map((a, b) => {
                                        return (
                                            <div key={b} className="grid my-2">
                                                <h3 className="text-cyan-300">Paso {b + 1}: </h3>
                                                <Tablitas matrix={a} />
                                            </div>
                                        )
                                    })
                                )
                                }
                            </div>
                            <h2 className="text-cyan-300"> Interpretación </h2>
                            <div>
                                {
                                    info.pasos && (<>
                                        <br /> Los resultados serían los siguientes:
                                        <br /> <br /> Z = {info.pasos[info.pasos.length - 1][1][info.pasos[0][1].length - 1]}
                                        {Object.entries(getVariableValues(info.pasos[info.pasos.length - 1])).map(([variable, value]) => (
                                            <div key={variable}>
                                                {variable} = {value}
                                            </div>
                                        ))}
                                    </>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>

    </div>
    )
}