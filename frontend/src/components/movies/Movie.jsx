import { useLoaderData } from "react-router-dom";

export default function Movie() {

    const movie = useLoaderData();
    console.log(movie);

    return (
        <>
            <h1>{movie.results.titleText.text}</h1>
        </>
    )
}