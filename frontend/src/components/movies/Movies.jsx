import { Link, Outlet, useLoaderData } from "react-router-dom"

export default function Movies() {

    const movies = useLoaderData();
    console.log(movies);

    return (
        <div className="flex justify-center items-center">
            <ul>
                {movies.results.map((movie) => {
                    return (
                        <li key={movie._id}>
                            <Link to={`/movies/${movie.id}`}>{movie.titleText.text}</Link>
                        </li>
                    )
                })}
            </ul>
            <Outlet />
        </div>
    )
}