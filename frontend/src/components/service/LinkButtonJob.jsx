import { Link } from "react-router-dom";
import PlusIcon from "../icons/PlusIcon";
export default function LinkButtonJob({ url, title }) {
    return (
        <div className="flex justify-end items-center">
        <Link to={url}>
            <button className="flex items-center gap-x-2 p-2 border rounded-lg hover:bg-gray-200 transition">
            <PlusIcon />
            <span>{title}</span>
            </button>
        </Link></div>
    )
}