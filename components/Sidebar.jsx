'use client'
import Link from "next/link"
import { usePathname } from 'next/navigation'

export default function Sidebar() {
    const pathname = usePathname()
    const test = {
        'si': 'text-black bg-white',
        'no':''
    }
    return (
        <div className="h-[calc(100vh-44px)] grid place-items-center backdrop-blur-3xl bg-black/80  border-r border-gray-900">
            <nav className="font-semibold text-xl h-auto">
                <h2 className="font-bold text-3xl mb-7 grid place-items-center bg-[#1d1b31] rounded h-14"> Métodos </h2>

                <ul className="grid gap-5">
                    <li className={`w-48 h-12 ${test[pathname == '/lineal' ? 'si' : 'no']} hover:bg-white hover:text-black rounded grid place-items-center active:text-cyan-40`}>
                        <Link href='/lineal/'> Introducción </Link>
                    </li>
                    <li className={`w-48 h-12 ${test[pathname == '/lineal/grafico' ? 'si' : 'no']} hover:bg-white hover:text-black rounded grid place-items-center`}>
                        <Link href='/lineal/grafico'> Gráfico </Link>
                    </li>
                    <li className={`w-48 h-12 ${test[pathname == '/lineal/simplex' ? 'si' : 'no']} hover:bg-white hover:text-black rounded grid place-items-center`}>
                        <Link href='/lineal/simplex'> Simplex </Link>
                    </li>
                    <li className={`w-48 h-12 ${test[pathname == '/lineal/dual' ? 'si' : 'no']} hover:bg-white hover:text-black rounded grid place-items-center`}>
                        <Link href='/lineal/dual'> Dual </Link>
                    </li>
                    <li className={`w-48 h-12 ${test[pathname == '/lineal/gran_m' ? 'si' : 'no']} hover:bg-white hover:text-black rounded grid place-items-center`}>
                        <Link href='/lineal/gran_m'> Gran M </Link>
                    </li>
                    <li className={`w-48 h-12 ${test[pathname == '/lineal/dos_fases' ? 'si' : 'no']} hover:bg-white hover:text-black rounded grid place-items-center`}>
                        <Link href='/lineal/dos_fases'> Dos fases </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}