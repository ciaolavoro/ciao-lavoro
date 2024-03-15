export default function ServiceDetailsButton({ type, text, icon, onClick }) {
    return (
        <div className="flex justify-end">
            <button type={type} className="flex items-center gap-x-2 p-2 border rounded-lg hover:bg-gray-200 transition" onClick={onClick}>
                {icon}
                {text}
            </button>
        </div>

    )
}