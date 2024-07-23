'use client'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/icon_io.svg'
export default function Navbar() {
  return (
    <nav className='min-h-11 grid grid-cols-[1fr_2fr_1fr] place-items-center bg-black text-gray-300 border-b-[1px] border-gray-900'>
      <Link href='/'>
        <Image
          src={logo}
          height={40}
          width={40}
          alt='logo'
        />
      </Link>
      <ul className='flex flex-nowrap gap-10 justify-center'>
        <li>
          <Link href='/lineal'> Programacion lineal </Link>
        </li>
        <li>
          <Link href='/enteros'> Programacion entera </Link>
        </li>
        <li>
          <Link href='/rutas'> Transporte </Link>
        </li>
        <li>
          <Link href='/grafos'> Grafos </Link>
        </li>
      </ul>
      <h1>Acerca</h1>
    </nav>
  )
}