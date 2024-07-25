import Sidebar from "@/components/Sidebar3";
import {AppWrapper} from './context.jsx'
export const metadata = {
  title: 'Transpote',
  description: 'Problemas de transporte usando algoritmos aprox de Vogel, entre otros',
  keywords: 'proyecto, io, programacion, transporte, vogel, otros',
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
