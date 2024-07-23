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
                    <li className={`w-48 h-12 ${test[pathname == '/enteros' ? 'si' : 'no']} hover:bg-white hover:text-black rounded grid place-items-center active:text-cyan-40`}>
                        <Link href='/enteros/'> Introducción </Link>
                    </li>
                    <li className={`w-48 grid h-16 ${test[pathname == '/enteros/ramas' ? 'si' : 'no']} hover:bg-white hover:text-black rounded grid place-items-center`}>
                        <Link href='/enteros/ramas' > Ramificacion <br />y acotamiento</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}