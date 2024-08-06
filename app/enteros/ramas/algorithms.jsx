'use client'

export const getVariableValues = (matrix, variables) => {
    const headers = matrix[0];
    const variableValues = {};
    headers.forEach((header) => {
        if (header.startsWith('X')) {
            variableValues[header] = 0;
        }
    });
    
    let  noFactible = false;
    matrix.forEach(row => {
        const variable = row[0];
        // console.log('variables ', row)
        if (variable.startsWith('X')) {
            let i = 0;
            for (let c = 1; c <= variables; c++) {
                if (row[c] >= 1) {
                    i++;
                }
            }
            if (i>1) {
                noFactible = true;
                console.log('no factible')
            }
            variableValues[variable] = row[row.length - 1];
        }
    });
    if (matrix[1][matrix[1].length-1] <= 0) {
        noFactible = true;
    }
    variableValues['Z'] = matrix[1][matrix[1].length-1]
    if (noFactible) {
        return false;
    }
    return variableValues;
};


export const simplex = (matriz) => {    
    var lado, barra;
    var variables;
    const formateo = (matriz, columna, filas) => {
        variables = matriz[0].length - matriz.length;
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
    return getVariableValues(log,variables)
}

export const granM = (nuevo, signos, variables, restricciones) => {
    var lado, barra;
    // console.log("signos: ", signos)
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
        // console.log(...log);
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
        // console.log("pasos", pasos);

    return getVariableValues(pasos[pasos.length-1], variables);
};