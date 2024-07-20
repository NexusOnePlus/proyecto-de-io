export default function Boton( props ) {
    return (
        <div className={`${props.activo == true ? 'bg-white text-black' : ''} grid py-2 px-3 border rounded-xl border-white place-items-center cursor-pointer select-none`}>
                <h1 className="font-bold text-[15px]">{props.name}</h1>
        </div>
    )
}