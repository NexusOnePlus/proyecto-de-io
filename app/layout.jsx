import Navbar from "@/components/Navbar"
import {Roboto} from 'next/font/google'
import "./global.css";
export const metadata = {
  title: 'Home',
  description: 'Proyecto web de Programacion Lineal y entera, además de problemas de transporte',
  keywords: 'proyecto, io, programacion, lineal, entera, transporte',
  applicationName: 'I.O.',
}

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['italic', 'normal'],
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Navbar/>
        {children}
      </body>
    </html>
  )
}
