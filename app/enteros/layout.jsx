import Sidebar from "@/components/Sidebar2";
import {AppWrapper} from './context.jsx'
export const metadata = {
  title: 'Programacion Lineal',
  description: 'Metodo Entero usando las metodos de aproximacion de Vogel y otros',
  keywords: 'proyecto, io, programacion, entera, vogel, otros',
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
