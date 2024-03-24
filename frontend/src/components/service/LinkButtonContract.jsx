import { Link } from "react-router-dom";

export default function LinkButtonContract({ url, title }) {
    return (
        <div className="flex justify-start">
        <Link to={url}>
            <button className="flex items-center gap-x-2 p-2 border rounded-lg hover:bg-gray-200 transition">
            {title}
            </button>
        </Link></div>
    )
}