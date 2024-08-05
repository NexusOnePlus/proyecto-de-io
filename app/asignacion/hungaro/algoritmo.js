export function minZeroRow(zeroMat, markZero) { // Encontrar la fila con la menor cantidad de ceros
    let minRow = [Infinity, -1];

    for (let rowNum = 0; rowNum < zeroMat.length; rowNum++) {
        let rowSum = zeroMat[rowNum].reduce((acc, val) => acc + (val ? 1 : 0), 0);
        if (rowSum > 0 && minRow[0] > rowSum) {
            minRow = [rowSum, rowNum];
        }
    }
    // Marcar la fila y columna específica como false
    let zeroIndex = zeroMat[minRow[1]].indexOf(true);
    markZero.push([minRow[1], zeroIndex]);
    for (let i = 0; i < zeroMat.length; i++) {
        zeroMat[minRow[1]][i] = false;
        zeroMat[i][zeroIndex] = false;
    }
}

export function markMatrix(mat) {// Encontrar las posibles soluciones para el problema 

    // Transformar a matriz booleana 
    let zeroBoolMat = mat.map(row => row.map(val => val === 0));
    let zeroBoolMatCopy = JSON.parse(JSON.stringify(zeroBoolMat));

    // Registrar posiciones de respuesta posibles marcadas con 0
    let markedZero = [];
    while (zeroBoolMatCopy.some(row => row.includes(true))) {
        minZeroRow(zeroBoolMatCopy, markedZero);
    }

    // Registrar las posiciones de fila y columna por separado
    let markedZeroRow = [];
    let markedZeroCol = [];
    for (let [row, col] of markedZero) {
        markedZeroRow.push(row);
        markedZeroCol.push(col);
    }

    let nonMarkedRow = [...Array(mat.length).keys()].filter(i => !markedZeroRow.includes(i));

    let markedCols = [];
    let checkSwitch = true;
    // marcar filas y columnas que contengan ceros 
    while (checkSwitch) {
        checkSwitch = false;
        for (let rowNum of nonMarkedRow) {
            let rowArray = zeroBoolMat[rowNum];
            for (let j = 0; j < rowArray.length; j++) {
                if (rowArray[j] && !markedCols.includes(j)) {
                    markedCols.push(j);
                    checkSwitch = true;
                }
            }
        }

        for (let [rowNum, colNum] of markedZero) {
            if (!nonMarkedRow.includes(rowNum) && markedCols.includes(colNum)) {
                nonMarkedRow.push(rowNum);
                checkSwitch = true;
            }
        }
    }

    let markedRows = [...Array(mat.length).keys()].filter(i => !nonMarkedRow.includes(i));

    return [markedZero, markedRows, markedCols];
}

export function adjustMatrix(mat, coverRows, coverCols) {
    //Encontrar el valor mínimo de los elementos no marcados
    let nonZeroElement = [];
    for (let row = 0; row < mat.length; row++) {
        if (!coverRows.includes(row)) {
            for (let i = 0; i < mat[row].length; i++) {
                if (!coverCols.includes(i)) {
                    nonZeroElement.push(mat[row][i]);
                }
            }
        }
    }
    let minNum = Math.min(...nonZeroElement);

    // Restar a los elementos no marcados
    for (let row = 0; row < mat.length; row++) {
        if (!coverRows.includes(row)) {
            for (let i = 0; i < mat[row].length; i++) {
                if (!coverCols.includes(i)) {
                    mat[row][i] -= minNum;
                }
            }
        }
    }

    // Sumar a los elementos en intersecciones
    for (let row of coverRows) {
        for (let col of coverCols) {
            mat[row][col] += minNum;
        }
    }
    return mat;
}

export function balance(mat) {
    let filas = mat.length;
    let columnas = mat[0].length;
    let max = Math.max(filas, columnas); 
    // Añadir filas ficticias
    while (mat.length < max) {
        mat.push(new Array(columnas).fill(0));
    }
    // Añadir columnas ficticias
    for (let i = 0; i < filas; i++) {
        while (mat[i].length < max) {
            mat[i].push(0);
        }
    }
}

export function resolver(mat) {
    const dim = mat.length; 
    // Restar el valor mínimo de cada fila y columna
    for (let row = 0; row < dim; row++) {
        let minVal = Math.min(...mat[row]);
        for (let col = 0; col < mat[row].length; col++) {
            mat[row][col] -= minVal;
        }
    }

    for (let col = 0; col < dim; col++) {
        let colVals = mat.map(row => row[col]);
        let minVal = Math.min(...colVals);
        for (let row = 0; row < mat.length; row++) {
            mat[row][col] -= minVal;
        }
    }

    let zeroCount = 0;
    while (zeroCount < dim) { // Encontrar la matriz solucion optima
        let [ansPos, markedRows, markedCols] = markMatrix(mat);
        zeroCount = markedRows.length + markedCols.length;
        if (zeroCount < dim) {
            mat = adjustMatrix(mat, markedRows, markedCols);
        } else {
            return ansPos;
        }
    }
}

export function solucion(mat, pos) { // calcular el valor optimo
    let total = 0;
    let ansMat = Array.from({ length: mat.length }, () => Array(mat[0].length).fill(0));
    for (let [row, col] of pos) {
        total += mat[row][col];
        ansMat[row][col] = mat[row][col];
    }
    return [total, ansMat];
}

// let costMatrix = [
//     [11800, 15000,20000],
//     [12500,13000,14400],
//     [20000,18000,23000],
//     [18000,17000,16000]
// ];
// balance(costMatrix);
// let ansPos = resolver(structuredClone(costMatrix)); 
// let [ans, ansMat] = solucion(costMatrix, ansPos); 



// console.log(`Costo minimo: ${ans}`);
// console.log("Matriz de asignaciones:");
// console.log(ansMat);
