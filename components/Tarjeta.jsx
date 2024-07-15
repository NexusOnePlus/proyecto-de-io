export default function Tarjeta (props) {
    return (
        <div className=" grid py-5 px-3 border-2 border-s border-white  border-dashed rounded place-items-center">
            <h1 className="min-w-full">{props.name}</h1>
        </div>
    )
}