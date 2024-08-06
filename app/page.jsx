'use client'
import Tarjeta from '@/components/Tarjeta';
import { GeistSans } from 'geist/font/sans';

export default function HomePage() {
    return (
        <div className="min-h-32 grid place-items-center bg-black h-[calc(100vh-44px)]">
            <div className={`grid place-items-center mt-7 gap-5 ${GeistSans.variable}`}>
                <h2 className='text-[40px] text-gray-200'> Proyecto</h2>
                <h1 className='text-[68px] font-bold'>
                    Investigación Operativa
                </h1>
                <h3 className=' text-neutral-500 text-[20px]'>Programación Lineal, Programación entera, problemas de transporte y asignación.</h3>
                <h2 className='mt-4'>Hecho con Next.js y TailwindCSS </h2>
                <h2 className='mt-10'>Integrantes del grupo </h2>
                <div className='flex gap-7'>
                    <Tarjeta name='Samuel Aquima'/>
                    <Tarjeta name='William Vargas'/>
                    <Tarjeta name='Ericks Barreda'/>
                    <Tarjeta name='Jhon Mamani'/>
                </div>
            </div>
        </div>
    )
}