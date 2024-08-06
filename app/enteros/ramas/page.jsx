'use client'
import { useState, useEffect, useCallback } from 'react';
import { granM } from './algorithms'
import { useData } from "../context"
import {
    ReactFlow, useReactFlow, ReactFlowProvider,
    Panel,
    useNodesState,
    useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Dagre from '@dagrejs/dagre';

const getLayoutedElements = (nodes, edges, options) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: options.direction });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) =>
        g.setNode(node.id, {
            ...node,
            width: node.measured?.width ?? 0,
            height: node.measured?.height ?? 0,
        }),
    );

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id);
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            const x = position.x - (node.measured?.width ?? 0) / 2;
            const y = position.y - (node.measured?.height ?? 0) / 2;

            return { ...node, position: { x, y } };
        }),
        edges,
    };
};


const destructurar = (a) => {
    let listas = []
    let z;
    Object.entries(a).map(([variable, value]) => {
        if (variable == 'Z') {
            z = value
        } else {
            listas.push(value)
        }
    })
    return [listas, z]
}

const ramas = (info, matrix, nuevosSigno) => {
    console.log("matriz: ", matrix);
    console.log("signos: ", nuevosSigno);
    let variables = []
    let z;
    let ind = 1
    let supremo = -Infinity;
    let respuesta = {};
    Object.entries(info).map(([variable, value]) => {
        if (variable == 'Z') {
            z = value
        } else {
            variables.push(value)
        }
    })
    let pasos = []
    let conexiones = []
    const bucle = (data, z, id, matriz, nuevosSignos, sen) => {
        // console.log('data: ', data, ' Z: ', z, ' id: ', id)


        if (!sen) {
            pasos.push(
                {
                    id: `${ind}`, position: { x: id * 10, y: id * 10 }, data: {
                        label: `Solucion no factible`
                    }, style: { color: 'white', background: 'black', borderColor: 'white' }
                },
            )
            conexiones.push(
                {
                    id: `${Math.random()}`, source: `${id}`, target: `${ind}`
                }
            )
            let mid = ind;
            ind++;
        } else {
            
            let k = 0;
            let noEs = true;
            while (noEs && (data.length != k)) {
                if (!Number.isInteger(data[k])) {
                    noEs = false;
                }
                k++;
            }
            if (noEs) {
                if (z > supremo) {
                    supremo = z;
                    data.forEach((i, l) => {
                            respuesta[`X${l+1}`] = i;
                    });
                    respuesta['Z'] = z;
                }
            }

            pasos.push(
                {
                    id: `${ind}`, position: { x: id * 10, y: id * 10 }, data: {
                        label: `${data.map((a, b) => {
                            return `X${b + 1}: ${a} `
                        })
                            } Z: ${z}`
                    }, style: { color: 'white', background: 'black', borderColor: 'white' }
                },
            )
            conexiones.push(
                {
                    id: `${Math.random()}`, source: `${id}`, target: `${ind}`
                }
            )
            let mid = ind;
            ind++;
            id++;
            let i = 0;
            let seguir = true
            while (seguir && data.length != i) {
                if (!Number.isInteger(data[i])) {
                    let temp = [...data]
                    let tempMin = structuredClone(matriz)
                    let tempMax = structuredClone(matriz)
                    let nuevosSignosMin = structuredClone(nuevosSignos)
                    nuevosSignosMin.push('<=')
                    let size = temp.length;
                    let menor = Math.floor(data[i])
                    let less = []
                    for (let j = 0; j < size; j++) {
                        if (i == j) {
                            less.push(1)
                        } else {
                            less.push(0)
                        }
                    }
                    less.push(menor)
                    tempMin.push(less)
                    console.log("anstempMin: ", temp)
                    console.log('tempmin: ', tempMin)
                    console.log('signtempmin: ', nuevosSignosMin)
                    let factMin = granM(tempMin, nuevosSignosMin, size, tempMin.length - 1)
                    if (factMin != false) {

                        console.log("nuevoMin: ", factMin)
                        let [listaMin, zMin] = destructurar(factMin)
                        zMin = parseFloat(zMin);
                        listaMin = listaMin.map((a) => parseFloat(a))
                        console.log("Lista Min: ", listaMin)
                        console.log("Z Min: ", zMin)
                        // temp[i] = Math.floor(data[i])   
                        bucle(listaMin, zMin, mid, tempMin, nuevosSignosMin, true)
                    } else {
                        bucle([0,0], 0, mid, [[0]], '!=', false)
                    }

                    // nuevosSignos.push('>=')
                    // temp[i] = Math.ceil(data[i])                
                    let nuevosSignosMax = structuredClone(nuevosSignos)
                    nuevosSignosMax.push('>=')
                    let mayor = Math.ceil(data[i])
                    let more = []
                    for (let j = 0; j < size; j++) {
                        if (i == j) {
                            more.push(1)
                        } else {
                            more.push(0)
                        }
                    }
                    more.push(mayor)
                    tempMax.push(more)
                    console.log("anstempMax: ", temp)
                    console.log('tempmax: ', tempMax)
                    console.log('signtempmax: ', nuevosSignosMax)
                    let factMax = granM(tempMax, nuevosSignosMax, size, tempMax.length - 1)
                    if (factMax != false) {
                        console.log("nuevoMin: ", factMax)
                        let [listaMax, zMax] = destructurar(factMax)
                        zMax = parseFloat(zMax);
                        listaMax = listaMax.map((a) => parseFloat(a))
                        console.log("Lista Max: ", listaMax)
                        console.log("Z Max: ", zMax)
                        bucle(listaMax, zMax, mid, tempMax, nuevosSignosMax, true)
                    } else {
                        bucle([0,0], 0, mid, [[0]], '!=', false)
                    }
                    seguir = false;
                }
                i++;
            }
        }
    }

    console.log("final: ", respuesta)
    bucle(variables, z, 0, matrix, nuevosSigno, true);
    return [pasos, conexiones, respuesta]
}


function Rama() {
    const { fitView } = useReactFlow();
    const { data, setData } = useData();
    const [info, setInfo] = useState({});
    const [res, setRes] = useState({});
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [renders, setRenders] = useState(false)
    const [factible, setFactible] = useState(false);
    const onLayout = useCallback(
        (direction) => {
            // console.log(nodes);
            const layouted = getLayoutedElements(nodes, edges, { direction });

            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);

            window.requestAnimationFrame(() => {
                fitView();
            });
        },
        [nodes, edges, setNodes, setEdges],
    );


    useEffect(() => {
        let temp = [...data.submatriz]
        temp = temp.map((a, b) => {
            return a.map((c, d) => {
                if (d != data.variables) {
                    return isNaN(parseInt(c)) == true ? '0' : c
                }
                return c
            })
        })
        // let log = simplex(temp);
        const nuevosSignos = [];

        let temporal = [];
        temp.forEach((fila, index) => {
            let nuevaFila = fila.slice(0, -2).concat(fila.slice(-1)).map(celda => {
                const parsed = parseInt(celda, 10);
                return isNaN(parsed) ? 0 : parsed;
            });
            if (index == 0) {
                nuevaFila = nuevaFila.map((a) => {
                    return -a;
                })
            }
            temporal.push(nuevaFila);
            if (index == 0) {
                nuevosSignos.push('=')
            } else {
                nuevosSignos.push(fila[fila.length - 2]);
            }
        });

        let notlog = granM(temporal, nuevosSignos, data.variables, data.restricciones);
        // console.log("m", notlog)
        if (notlog != false) {
            setInfo(notlog);
            // let [rama, ligas] = ramas(log);
            let [branch, lines, ans] = ramas(notlog, temporal, nuevosSignos)
            // console.log("branch", branch);
            setRes(ans)
            setNodes(branch)
            setEdges(lines)
            setRenders(true)
            setFactible(true)
        } else {
            setNodes([{
                id: '0', position: { x: 0, y: 0 }, data: {
                    label: 'No factible'
                }, style: { color: 'white', background: 'black', borderColor: 'white' }
            }])
            setRenders(true);
            setFactible(false);
        }
    }, []);

    useEffect(() => {
        if (renders) {
            onLayout('TB')
        }

    }, [renders])

    return (<div className="mx-10 h-[calc(100vh-44px)] py-20 overflow-y-auto">
        <div className="min-h-64 grid place-items-start gap-3">
            <h1 className="font-bold text-5xl">Método Ramificacion y Acotacion
            </h1>
            <h2 className="text-2xl font-bold">
                Descripión:
            </h2>
            <h3 >
                Una solución.
            </h3>
            {renders ? (
                <div>

                    <div>
                        <h2 className="text-2xl font-semibold"> Pre-solucion básica: </h2>
                        {factible
                            ?
                            <h3>Los resultados serían los siguientes:
                                {Object.entries(info).map(([variable, value]) => (
                                    <div key={variable}>
                                        {variable} = {value}
                                    </div>
                                ))}</h3>
                            :
                            <h3>Solución no factible</h3>
                        }
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold"> Solucion: </h2>
                        <div className='h-[800px] w-[800px] border border-dashed border-white rounded-md'>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                colorMode='light'
                                fitView
                            >
                                <Panel position="top-right grid">
                                    <button onClick={() => onLayout('TB')}>Vertical</button>
                                    <button onClick={() => onLayout('LR')}>Horizontal</button>
                                </Panel>
                            </ReactFlow>
                        </div>
                    </div>
                    <div>
                        {
                            factible ?
                                <div>
                                    <h2 className="text-2xl font-semibold"> Solucion óptima: </h2>
                                    <h3>Los resultados serían los siguientes:
                                        {Object.entries(res).map(([variable, value]) => (
                                            <div key={variable}>
                                                {variable} = {value}
                                            </div>
                                        ))}</h3>
                                </div>
                                : <h3>
                                    Solución no factible
                                </h3>
                        }
                    </div>
                </div>
            )
                : (
                    <h3 className='text-red-400 font-semibold'>
                        Complete los datos correctamente.
                    </h3>
                )
            }
        </div>
    </div>
    )
}


export default function Ramas() {
    return (
        <ReactFlowProvider>
            <Rama />
        </ReactFlowProvider>
    );
}