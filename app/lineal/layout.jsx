import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: 'Programacion Lineal',
  description: 'Metodo lineal usando las metodos simplex, dual, grafico, gran M y dos fases',
  keywords: 'proyecto, io, programacion, lineal, simplex, dual, grafico, granM, dosfases',
  applicationName: 'I.O.',
}

export default function RootLayout({ children }) {
  return <div className="grid grid-cols-[1fr_4fr]">
            <Sidebar/>
            {children}
        </div>
}
