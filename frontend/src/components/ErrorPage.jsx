import { Link, useRouteError } from "react-router-dom"
import Background from "./Background";

export default function ErrorPage() {

    const error = useRouteError();
    console.error(error);

    return (
        <section className="relative flex flex-col gap-6 justify-center items-center h-screen">
            <Background />
            <h1 className="text-5xl font-bold">❌ Error</h1>
            <p className="text-xl font-semibold">Lo sentimos, ha ocurrido un error inesperado.</p>
            <p className="text-lg font-semibold">{error.statusText || error.message}</p>
            <Link to="/">
                <button className="bg-slate-300 rounded px-2 py-1 font-semibold">Volver al inicio</button>
            </Link>
        </section>
    )
}