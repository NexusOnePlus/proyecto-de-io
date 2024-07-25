'use client'
import { useState, useEffect, useCallback } from 'react';
import { simplex } from './algorithms'
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


const ramas = (info) => {
    let variables = []
    let z;
    let ind = 1
    Object.entries(info).map(([variable, value]) => {
        if (variable == 'Z') {
            z = value
        } else {
            variables.push(value)
        }
    })
    let pasos = []
    let conexiones = []
    const bucle = (data, z, id) => {
        console.log('data: ', data, ' Z: ', z, ' id: ', id)
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
                temp[i] = Math.floor(data[i])
                bucle(temp, z, mid)
                temp[i] = Math.ceil(data[i])
                bucle(temp, z, mid)
                seguir = false;
            }
            i++;
        }
    }

    console.log(variables)
    bucle(variables, z, 0);
    return [pasos, conexiones]
}


function Ramas() {
    const { fitView } = useReactFlow();
    const { data, setData } = useData();
    const [info, setInfo] = useState({});
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [renders, setRenders] = useState(false)
    const onLayout = useCallback(
        (direction) => {
            console.log(nodes);
            const layouted = getLayoutedElements(nodes, edges, { direction });

            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);

            window.requestAnimationFrame(() => {
                fitView();
            });
        },
        [nodes, edges],
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
        let log = simplex(temp);
        setInfo(log);

        let [rama, ligas] = ramas(log);
        console.log(rama);
        setNodes(rama)
        setEdges(ligas)
        setRenders(true)
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
            <div>
                <h2 className="text-2xl font-semibold"> Pre-solucion básica: </h2>
                <h3>Los resultados serían los siguientes:
                    {Object.entries(info).map(([variable, value]) => (
                        <div key={variable}>
                            {variable} = {value}
                        </div>
                    ))}</h3>
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
                <h2 className="text-2xl font-semibold"> Solucion óptima: </h2>
                <h3>Los resultados serían los siguientes:
                    {Object.entries(info).map(([variable, value]) => (
                        <div key={variable}>
                            {variable} = {value}
                        </div>
                    ))}</h3>
            </div>
        </div>
    </div>
    )
}

export default function () {
    return (
        <ReactFlowProvider>
            <Ramas />
        </ReactFlowProvider>
    );
}