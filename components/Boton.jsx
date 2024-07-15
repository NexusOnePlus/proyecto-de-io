export default function Boton( props ) {
    return (
        <div className="bg-white grid py-2 px-3 rounded-xl place-items-center">
                <h1 className="font-bold text-[15px] text-black">{props.name}</h1>
        </div>
    )
}