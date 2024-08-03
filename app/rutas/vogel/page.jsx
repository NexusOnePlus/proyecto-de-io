'use client'
import { useEffect, useState  } from "react";
import { useData } from "../context"


const solucion = (grid, supply, demand) => {
    console.log(grid);
    console.log(supply);
    console.log(demand);
    const INF = 10 ** 3;
    let n = grid.length;
    let m = grid[0].length;
    let ans = 0;

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

    return ans
};


export default function Vogel() {
    const {data, setData } = useData()
    const [legal, setLegal] = useState(false);
    const [info, setInfo] = useState({})

    useEffect(() => {
        let condition = true;
            setLegal(true)
    }, [])

    useEffect(() => {
       if(legal) {
        console.log(data.submatriz);
            let supply = []
        let demand = []
        let grid = data.submatriz.map((a,b) => {
            if (b == (data.submatriz.length-1)) {
                a.map((c) => {
                    if (c != null) {
                        demand.push(parseFloat(c));
                    }
                })
            } else {
                supply.push(parseFloat(a[a.length-1]))
                console.log(a)
                return (((a.slice(0,a.length-1)).map((a) =>  parseFloat(a))))
            }
        })
        grid.pop()
        setInfo({res: solucion(grid, supply, demand)})
       } 
    },[legal])

    return (<div className="mx-10 h-[calc(100vh-44px)] py-20 overflow-y-auto">
        <div className="min-h-64 grid place-items-start gap-3">
            <h1 className="font-bold text-5xl">Método Vogel
            </h1>
            <h2 className="text-2xl font-bold">
                Descripión:
            </h2>
            <h3 >
                Una solución que consiste en tratar a la funcion Z como si fuera una de las restricciones originales.
            </h3>
            <h3>
                La solución BF (solución básica factible) si y solo si todos los coeficientes de la fila 0 son negativos.
            </h3>
            <h3>
                Solución:
            </h3>
            <h2>
                La respuesta es: {info.res}
            </h2>
        </div>

    </div>
    )

}
