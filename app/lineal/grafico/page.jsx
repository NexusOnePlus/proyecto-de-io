'use client'
import { useEffect, useState } from "react";
import { useData } from "../context"
import { JSXGraph, toFixed } from 'jsxgraph';


const interseccion = (line1, line2) => {
  line1 = line1.map(element => {
    return element = parseFloat(element)
  });
  line2 = line2.map(element => {
    return element = parseFloat(element)
  });
  
  const [a1, b1, c1] = line1;
  const [a2, b2, c2] = line2;
  
  
  const determinant = a1 * b2 - a2 * b1
  if (determinant === 0) {
    return null
  }
  const x = (b2 * c1 - b1 * c2) / determinant;
  const y = (a1 * c2 - a2 * c1) / determinant;
  return [parseFloat(Math.abs(x).toFixed(2)), parseFloat(Math.abs(y).toFixed(2))];
}

const Graficar = (matriz) => {
  let pasos = {
    intersectos: [],
    respuesta: 0
  }
  let puntosx = Infinity
  let puntosy = Infinity

  const containerId = 'here';
  var board = JSXGraph.initBoard(containerId, {
    boundingbox: [-1, 5, 5, -1],
    axis: true
  });
  const colors = ['red', 'blue', 'green', 'purple', 'orange', 'cyan', 'magenta', 'yellow'];
  const temp = matriz.slice(1).map((a) => { return a.filter(exp => isNaN(parseInt(exp)) !== true) })
  const puntosIntersect = []
  let pointy = null;
  let pointx = null;

  temp.forEach((element, index) => {
    element = [-parseFloat(element[2]), parseFloat(element[0]), parseFloat(element[1])]
    const line = board.create('line', element, { strokeColor: colors[index % colors.length] })

    const [c, a, b] = element;
    if (b != 0) {
      const yIntercept = -c / b;
      if (yIntercept >= 0) {
        const yPoint = board.create('point', [0, yIntercept], { color: colors[index % colors.length], size: 2 })
        if (puntosy > yIntercept) {
          puntosy = Math.floor(yIntercept * 100) / 100;
          pointy = yPoint;
        }
      }
    }
    if (a !== 0) {
      const xIntercept = -c / a;
      if (xIntercept >= 0) {
        const xPoint = board.create('point', [xIntercept, 0], { color: colors[index % colors.length], size: 2 })
        if (puntosx > xIntercept) {
          puntosx = Math.floor(xIntercept * 100) / 100;
          pointx = xPoint;
        }
      }
    }
    
  });
    

    for (let i = 0; i < temp.length; i++) {
      for (let j = i + 1; j < temp.length; j++) {
        const intersecto = interseccion(temp[i], temp[j]);
        if (intersecto && intersecto[0] >= 0 && intersecto[0] <= puntosx + 0.5 && intersecto[1] >= 0 && intersecto[1] <= puntosy + 0.1) {
          const point = board.create('point', intersecto, { color: colors[(i + j) % colors.length], size: 3, name: `(${intersecto[0].toFixed(2)}, ${intersecto[1].toFixed(2)})` });
          puntosIntersect.push(point);
          pasos.intersectos.push(intersecto)
        }
      }
    }


    let mayor = -Infinity;
    let elindmayor = [];
    for (let j = 0; j < pasos.intersectos.length; j++) {
      let a = parseFloat(matriz[0][0]) * pasos.intersectos[j][0] + parseFloat(matriz[0][1] * pasos.intersectos[j][1]);
      if (a > mayor) {
        mayor = a;
        elindmayor = [pasos.intersectos[j][0], pasos.intersectos[j][1]]
      }
    }
    {
      let a = parseFloat(matriz[0][0]) * 0 + parseFloat(matriz[0][1]) * puntosy;
      let b = parseFloat(matriz[0][1]) * 0 + parseFloat(matriz[0][0]) * puntosx;
      if (a > mayor) {
        mayor = a;
        elindmayor = [0, puntosy]
      }
      if (b > mayor) {
        mayor = b;
        elindmayor = [puntosx, 0]
      }
    }

    let feasiblePoints = [];
    feasiblePoints.push(board.create('point', [0, 0], { visible: true, size: 3, color: 'black', name: '(0,0)' }))
    if (pointx) feasiblePoints.push(pointx);
    if (elindmayor[0] != undefined) {
      feasiblePoints.push(board.create('point', elindmayor, { visible: true, size: 3, color: 'cyan', name: '' }))
    }
    if (pointy) feasiblePoints.push(pointy);
    pasos.intersectos.push([0, puntosy])
    pasos.intersectos.push([puntosx, 0])
    pasos.intersectos.push([0, 0]);
    if (feasiblePoints.length > 0) {
      board.create('polygon', feasiblePoints, { borders: { strokeColor: 'black' }, fillColor: 'rgba(255, 255, 0, 0.5)' })
    }
  pasos.respuesta = mayor;
  pasos.intersectos.forEach(paso => {
    paso.forEach ((paso2) => {
      paso2 = parseFloat(paso2.toFixed(2))
    })
  })

  return pasos;
};


export default function Grafico() {
  const { data, setData } = useData();
  const [legal, setLegal] = useState(false);
  const [info, setInfo] = useState({})
  useEffect(() => {
    if (data.variables <= 2) {
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
      setInfo(Graficar(data.submatriz))    
    }
  }, [legal])
  return (
    <div className="mx-10 h-[calc(100vh-44px)] py-20 overflow-y-auto">
      <div className="min-h-64 grid place-items-start gap-3">
        <h1 className="font-bold text-5xl">Método Gráfico
        </h1>
        <h2 className="text-2xl font-bold">
          Descripión:
        </h2>
        <h3 >
          Una solución que consiste en la búsqueda de combinación de valores para las variables de decisión.
          <br />
          Se busca optimizar el valor de función objetivo, si es que dicha combinación existe.
        </h3>
        <div>
          <h2 className="text-2xl font-semibold"> Disponibilidad: </h2>
          {legal == false
            ? (<h2 className="text-rose-500 font-bold"> El método gráfico solo esta disponible para funciones objetivo de 2 variables. </h2>)
            : (<h2 className="text-emerald-400 font-semibold"> Compatible </h2>)
          }
        </div>
        <div>
          {legal == false
            ? null
            : (
              <div>
                <h2 className="text-2xl font-semibold">Resolución: </h2>
                <div id="here" style={{ width: '500px', height: '400px', background: 'white' }}>
                </div>
              </div>
            )
          }
        </div>
        <div>
          {
            legal == false
            ? null
            : (
              <div>
                <h2 className="text-2xl font-semibold"> Resultados </h2>
                {info.intersectos &&
                  info.intersectos.map((i, index) => {
                    let ans = info.respuesta.toFixed(2) == (parseFloat(data.submatriz[0][0]) * parseFloat(i[0].toFixed(2)) + parseFloat(data.submatriz[0][1]) * parseFloat(i[1].toFixed(2))).toFixed(2)    
                    return (
                          <h2 key={index} className={`${ans ? 'text-cyan-300' : ''}`}> {`${index+1}. (${parseFloat(i[0].toFixed(2))}, ${parseFloat(i[1].toFixed(2))}) 
                          = ${data.submatriz[0][0]}(${parseFloat(i[0].toFixed(2))}) + ${data.submatriz[0][1]}(${parseFloat(i[1].toFixed(2))}) 
                          = ${(parseFloat(data.submatriz[0][0]) * parseFloat(i[0].toFixed(2)) + parseFloat(data.submatriz[0][1]) * parseFloat(i[1].toFixed(2))).toFixed(2)}`}</h2>
                        )
                  })
                }
              </div>
            )
          }
        </div>
      </div>

    </div>
  )
}
