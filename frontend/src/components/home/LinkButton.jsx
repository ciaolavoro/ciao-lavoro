import { Link } from "react-router-dom";

export default function LinkButton({ url, title }) {
    return (
        <Link to={url}>
            <button className="bg-orange-400 px-3 py-1 rounded">{title}</button>
        </Link>
    )
}