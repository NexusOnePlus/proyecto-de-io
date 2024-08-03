'use client'

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
    variableValues['Z'] = matrix[1][matrix[1].length-1]
    return variableValues;
};


export const simplex = (matriz) => {
    var lado, barra;
    const formateo = (matriz, columna, filas) => {
        let variables = matriz[0].length - matriz.length;
        let a = 1, b = 1, c = 1;

        if (barra == undefined) {
            barra = Array.from({ length: matriz[0].length + 1 }, (i, j) => {
                return j < variables ? `X${a++}` : (j == matriz[0].length - 1 ? '=' : (j == matriz[0].length ? 'R' : `S${b++}`));
            })
            barra.unshift(' ')
        }
        if (lado == undefined) { lado = Array.from({ length: matriz.length }, (i, j) => { return j == 0 ? "Z" : `S${c++}` }) }

        if (filas != undefined) {
            lado[filas] = barra[columna + 1]
        }
        
    }
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
                formateo(tabla, pivotCol, pivotFil)
                realpivot = [...tabla[pivotFil]];
                let sumaresta = tabla[0][pivotCol] * -1;
                for (let i = 0; i < tabla[0].length; i++) {
                    tabla[0][i] = tabla[0][i] + (realpivot[i] * sumaresta);
                }
                formateo(tabla, pivotCol, pivotFil)

                for (let i = 1; i < tabla.length; i++) {
                    let a = tabla[i][pivotCol];
                    if (i != pivotFil && tabla[i][pivotCol] != 0) {
                        for (let j = 0; j < tabla[0].length; j++) {
                            tabla[i][j] = tabla[i][j] - (realpivot[j] * a)
                        }
                    }
                }

                formateo(tabla, pivotCol, pivotFil)
            } else {
                negativos = false;
            }
        }
    }
    if (typeof lado == 'undefined') {
        return false
    }
    let log = structuredClone(tabla)
        log = log.map((fila, i) => {
            let colita = fila[fila.length - 1];
            let nuevafila = fila.slice(0, -1);
            nuevafila = nuevafila.concat('=');
            nuevafila.push(colita)
            nuevafila.unshift(lado[i])
            return nuevafila;
        })
        log.unshift(barra)
    return getVariableValues(log)
}


export const m = (matriz) => {
    
}