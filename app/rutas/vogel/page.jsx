'use client'
import { useEffect, useState } from "react";
import { useData } from "../context"


const solucion = (grid, supply, demand) => {
    console.log(grid);
    console.log(supply);
    console.log(demand);
    const INF = 10 ** 3;
    let n = grid.length;
    let m = grid[0].length;
    let ans = 0;
    let allocations = []; // Lista para guardar las asignaciones

    // Función auxiliar para encontrar la diferencia de filas y columnas
    function findDiff(grid) {
        let rowDiff = [];
        let colDiff = [];
        for (let i = 0; i < grid.length; i++) {
            let arr = [...grid[i]];
            arr.sort((a, b) => a - b);
            rowDiff.push(arr[1] - arr[0]);
        }

        for (let col = 0; col < grid[0].length; col++) {
            let arr = [];
            for (let i = 0; i < grid.length; i++) {
                arr.push(grid[i][col]);
            }
            arr.sort((a, b) => a - b);
            colDiff.push(arr[1] - arr[0]);
        }

        return [rowDiff, colDiff];
    }

    // Bucle que se ejecuta hasta que tanto la demanda como la oferta se agoten
    while (Math.max(...supply) !== 0 || Math.max(...demand) !== 0) {
        // Encontrar la diferencia de filas y columnas
        let [row, col] = findDiff(grid);

        // Encontrar el elemento máximo en el arreglo de diferencias de filas
        let maxi1 = Math.max(...row);

        // Encontrar el elemento máximo en el arreglo de diferencias de columnas
        let maxi2 = Math.max(...col);

        // Si el elemento máximo de la diferencia de filas es mayor o igual al de columnas
        if (maxi1 >= maxi2) {
            for (let ind = 0; ind < row.length; ind++) {
                if (row[ind] === maxi1) {
                    let mini1 = Math.min(...grid[ind]);
                    for (let ind2 = 0; ind2 < grid[ind].length; ind2++) {
                        if (grid[ind][ind2] === mini1) {
                            let mini2 = Math.min(supply[ind], demand[ind2]);
                            ans += mini2 * mini1;
                            supply[ind] -= mini2;
                            demand[ind2] -= mini2;
                            // Guardar la asignación
                            allocations.push({ supply: ind, demand: ind2, amount: mini2, cost: mini1 });

                            if (demand[ind2] === 0) {
                                for (let r = 0; r < n; r++) {
                                    grid[r][ind2] = INF;
                                }
                            } else {
                                grid[ind] = new Array(m).fill(INF);
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        } else {
            for (let ind = 0; ind < col.length; ind++) {
                if (col[ind] === maxi2) {
                    let mini1 = INF;
                    for (let j = 0; j < n; j++) {
                        mini1 = Math.min(mini1, grid[j][ind]);
                    }

                    for (let ind2 = 0; ind2 < n; ind2++) {
                        if (grid[ind2][ind] === mini1) {
                            let mini2 = Math.min(supply[ind2], demand[ind]);
                            ans += mini2 * mini1;
                            supply[ind2] -= mini2;
                            demand[ind] -= mini2;
                            // Guardar la asignación
                            allocations.push({ supply: ind2, demand: ind, amount: mini2, cost: mini1 });

                            if (demand[ind] === 0) {
                                for (let r = 0; r < n; r++) {
                                    grid[r][ind] = INF;
                                }
                            } else {
                                grid[ind2] = new Array(m).fill(INF);
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }
    console.log(ans);
    console.log(allocations)
    return {
        totalCost: ans,
        allocations: allocations
    };
};



export default function Vogel() {
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
        let row = 0, col = 0;
        data.submatriz.map((a,b) => {
            a.map((c,d) => {
                if(c == ''){
                    if (b != (data.submatriz.length-1)) {
                        mm = false;
                    } else if (d != (a.length-1)) {
                        mm = false;
                    }
                }
                if (d == a.length-1) {
                    row = row + (c == '' ? 0 : parseFloat(c));
                }
                if (b == data.submatriz.length-1) {
                    col = col + (c == '' ? 0 : parseFloat(c));
                }
            })
        })
        if (row != col) {
            mm = false;
        }
        setNao(mm);
        if (legal && mm) {
            let supply = []
            let demand = []
            let grid = data.submatriz.map((a, b) => {
                if (b == (data.submatriz.length - 1)) {
                    a.map((c) => {
                        if (c != '') {
                            demand.push(parseFloat(c));
                        }
                    })
                } else {
                    supply.push(parseFloat(a[a.length - 1]))
                    console.log(a)
                    return (((a.slice(0, a.length - 1)).map((a) => parseFloat(a))))
                }
            })
            grid.pop()
            let hey = solucion(grid, supply, demand)
            setInfo(hey)
        }
    }, [legal])

    return (<div className="mx-10 h-[calc(100vh-44px)] py-20 overflow-y-auto">
        <div className="min-h-64 grid place-items-start gap-3">
            <h1 className="font-bold text-5xl">Método Vogel
            </h1>
            <h2 className="text-2xl font-bold">
                Descripión:
            </h2>
            <h3 >
                El método de aproximación de Vogel es un método heurístico de resolucion de problemas de transporte
            </h3>
            <h3>
                Capaz de alcanzar una solucion basica no artificial de
                inicio, este modelo requiere de la realizacion de un
                numero generalmente mayor de iteraciones que los
                demas metodos heurísticos existentes.
                <br />
                Sin embargo produce mejores resultados iniciales que los
                mismos.
            </h3>
            <h3 className="text-2xl font-bold">
                Datos:
            </h3>
            <div>

                <div className="rounded-md border-2  border-slate-600 bg-slate-600 p-[0.5px] w-full">
                    <div className="flex">
                        <span className="w-24"></span>
                        {data.submatriz[0].map((row, rowIndex) => (
                            <div key={rowIndex} className="flex">
                                <span className={` grid place-items-center border-slate-500 w-24 p-2 overflow-auto`}> {rowIndex == data.submatriz[0].length - 1 ? 'Oferta' : `Destino ${rowIndex + 1}`} </span>
                            </div>
                        ))}
                    </div>
                    <div>
                        {data.submatriz.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex">
                                <span className="grid place-items-center bg-cyan-950     w-24 p-2 overflow-auto">{rowIndex == data.submatriz.length - 1 ? 'Demanda' : `Origen ${rowIndex + 1}`}</span>
                                {row.map((cell, cellIndex) => (
                                    <span key={cellIndex} className={`bg-slate-700 grid place-items-center border-slate-500 w-24 p-2 overflow-auto`}>{cell} </span>
                                ))}
                            </div>
                        ))}
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
                            Costo total: {info.totalCost && (info.totalCost)}
                        </h2>
                        <div className="flex gap-6">
                            {
                                info.totalCost && (
                                    info.allocations.map((a, b) => (
                                        <div key={b} className="border rounded p-2">
                                            Cantidad = {a.amount}
                                            <br />
                                            Costo = {a.cost}
                                            <br />
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

    </div>
    )

}
