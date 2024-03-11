export default function UserProfileButton({ type, text, icon, onClick }) {
    return (
        <button type={type} className="flex items-center gap-x-2 p-2 border rounded-lg hover:bg-gray-200 transition" onClick={onClick}>
            {icon}
            {text}
        </button>
    )
}