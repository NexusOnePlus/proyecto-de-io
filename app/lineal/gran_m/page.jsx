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

const getVariablesValues = (matrix) => {
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
const operacionesGranM = (nuevo, signos, variables, restricciones) => {
    var lado, barra;

    const formateo = (matriz, columna, filas) => {
        let a = 1, b = 1, c = 1, d = 1;

        if (barra == undefined) {
            barra = Array.from({ length: matriz[0].length+1 }, (_, j) => {
                if (j < variables) {
                    return `X${a++}`;
                } else if (j < variables + restricciones) {
                    return `S${b++}`;
                } else if (matriz[0].length-1 == j) {
                    return '=';
                } else if (matriz[0].length == j){
                    return 'R'
                } else {
                    return `A${d++}`;
                }
            });
            barra.unshift(' ');
        }

        if (lado == undefined) {
            lado = Array.from({ length: restricciones + 1 }, (_, j) => j == 0 ? "Z" : `S${c++}`);
        }

        if (filas != undefined) {
            lado[filas] = barra[columna + 1];
        }

        let log = structuredClone(matriz);
        log = log.map((fila, i) => {
            let colita = fila[fila.length - 1];
            let nuevafila = fila.slice(0, -1).concat('=').concat(colita);
            nuevafila.unshift(lado[i]);
            return nuevafila;
        });

        log.unshift(barra);
        console.log(...log);
        return log;
    };

    let pasos = [];
    const M = 1000;
    const ismax = true;
    let numFilas = nuevo.length;
    let numSignosIgual = 0;
    let numSignosMayor = 0;

    signos.slice(1).forEach((signo) => {
        if (signo === '=') numSignosIgual++;
        if (signo === '>=') numSignosMayor++;
    });

    let matVHolgura = Array.from({ length: numFilas }, (_, i) =>
        Array.from({ length: numFilas - 1 - numSignosIgual }, (_, j) => {
            if (i === 0) return 0;
            if (i - 1 === j && signos[i] == '<=') return 1;
            if (i - 1 === j && signos[i] == '>=') return -1;
            return 0;
        })
    );

    let matVArtificial = Array(numFilas).fill().map(() => Array(numSignosIgual + numSignosMayor).fill(0));
    let indexVA = 0;
    for (let i = 1; i <= numFilas - 1; i++) {
        if (signos[i] == ">=" || signos[i] == "=") {
            matVArtificial[0][indexVA] = ismax ? M : -M;
            matVArtificial[i][indexVA] = 1;
            indexVA++;
        }
    }

    let matriz = nuevo.map((fila, i) => {
        let colita = fila[fila.length - 1];
        let nuevafila = fila.slice(0, -1).concat(matVHolgura[i]).concat(matVArtificial[i]).concat(colita);
        return nuevafila;
    });
    pasos.push(structuredClone(formateo(matriz)));

    if (matVArtificial[0].length != 0) {
        let f = -1 * matVArtificial[0][0];
        for (let i = 1; i < numFilas; i++) {
            if (matVArtificial[i].some((e) => e === 1)) {
                for (let j = 0; j < matriz[0].length; j++) {
                    matriz[0][j] += matriz[i][j] * f;
                }
            }
        }
        pasos.push(structuredClone(formateo(matriz)));
    }

    let optimo, c = 0;
    while (true) {
        let negativos = matriz[0].slice(0, -1).some(coeficienteZ => coeficienteZ < 0);
        let positivos = matriz[0].slice(0, -1).some(coeficienteZ => coeficienteZ > 0);
        optimo = ismax ? !negativos : !positivos;
        if (optimo) break;

        let pivoteX, pivoteY;
        let valor = matriz[0][0];
        pivoteX = 0;
        for (let j = 0; j < matriz[0].length - 1; j++) {
            if (ismax && matriz[0][j] < valor && matriz[0][j] < 0) {
                valor = matriz[0][j];
                pivoteX = j;
            }
            else if (!ismax && matriz[0][j] > valor && matriz[0][j] > 0) {
                valor = matriz[0][j];
                pivoteX = j;
            }
        }

        valor = Infinity;
        for (let i = 1; i < matriz.length; i++) {
            if (matriz[i][pivoteX] > 0) {
                let razon = matriz[i][matriz[i].length - 1] / matriz[i][pivoteX];
                if (razon < valor) {
                    valor = razon;
                    pivoteY = i;
                }
            }
        }
        if (pivoteY == undefined) break;

        let pivoteValor = matriz[pivoteY][pivoteX];
        for (let j = 0; j < matriz[pivoteY].length; j++) {
            matriz[pivoteY][j] /= pivoteValor;
        }
        pasos.push(structuredClone(formateo(matriz, pivoteX, pivoteY)));

        for (let i = 0; i < numFilas; i++) {
            if (i != pivoteY) {
                let f = -1 * matriz[i][pivoteX];
                for (let j = 0; j < matriz[i].length; j++) {
                    matriz[i][j] += f * matriz[pivoteY][j];
                }
            }
        }
        pasos.push(structuredClone(formateo(matriz, pivoteX, pivoteY)));
    }

    pasos = pasos.map(mat => 
        mat.map(fila => 
            fila.map(e => 
                !isNaN(parseFloat(e)) && isFinite(e) ? parseFloat(e).toFixed(2) : e
            )
        )
    );
        console.log(pasos);
    return pasos;
};



export default function Gran() {
    const { data, setData } = useData();
    const [legal, setLegal] = useState(false);
    const [info, setInfo] = useState({})

    useEffect(() => {
        setLegal(true)
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
            modificarMatriz(temp)
        }
    }, [legal])
    const modificarMatriz = (matrix) => {
        const nuevaMatriz = [];
        const nuevosSignos = [];

        matrix.forEach((fila, index) => {
            let nuevaFila = fila.slice(0, -2).concat(fila.slice(-1)).map(celda => {
                const parsed = parseInt(celda, 10);
                return isNaN(parsed) ? 0 : parsed;
            });
            if (index == 0) {
                nuevaFila = nuevaFila.map((a) => {
                    return -a;
                })
            }
            nuevaMatriz.push(nuevaFila);
            if (index == 0) {
                nuevosSignos.push('=')
            } else {
                nuevosSignos.push(fila[fila.length - 2]);
            }
        });
        console.log(nuevosSignos)
        let hey = {
            pasos: operacionesGranM(nuevaMatriz, nuevosSignos, data.variables, data.restricciones)
        }
        setInfo(hey)
    };

    return (<div className="mx-10 h-[calc(100vh-44px)] py-20 overflow-y-auto">
        <div className="min-h-64 grid place-items-start gap-3">
            <h1 className="font-bold text-5xl">Método de la Gran M
            </h1>
            <h2 className="text-2xl font-bold">
                Descripión:
            </h2>
            <h3 >
                El método de la M grande es una forma derivada del
                método simplex, usado
                <br /> para resolver problemas donde el
                origen no forma parte de la región factible de un
                problema de programación lineal.
                <br />
            </h3>
            <h3>
                Para realizar este algoritmo, se siguen los mismos pasos
                que en el método simplex, pero antes tenemos que
                cambiar la función objetivo para que incluya a las variables
                artificiales. 
                <br />Estas variables tendrán que estar multiplicadas
                por un numero suficientemente grande para que no se
                elimine a través de la operaciones, llamado M y
                que además deberá irse solamente cuando se sume o
                reste con otra M.            </h3>
            <div>
                {/* <h2 className="text-2xl font-semibold"> Disponibilidad: </h2>
                {legal == false
                    ? (<h2 className="text-rose-500 font-bold"> El método gráfico solo esta disponible para funciones objetivo de maximización, así como restricciones {'<='}. </h2>)
                    : (<h2 className="text-emerald-400 font-semibold"> Compatible </h2>)
                } */}
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
                                        {Object.entries(getVariablesValues(info.pasos[info.pasos.length - 1])).map(([variable, value]) => (
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