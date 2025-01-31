import Sidebar from "@/components/Sidebar2";
import {AppWrapper} from './context.jsx'
export const metadata = {
  title: 'Programacion Lineal Entera',
  description: 'Metodo Entero usando las metodos de ramificacion y acotacion',
  keywords: 'proyecto, io, programacion, entera, ramificacion, acotacion, otros',
  applicationName: 'I.O.',
}

export default function RootLayout({ children }) {
  return <div className="grid grid-cols-[1fr_4fr]">
            <Sidebar/>
            <AppWrapper>
            {children}
            </AppWrapper>
        </div>
}
