export default function DescriptionCard({ icon, title, children }) {
    return (
        <div className="bg-white border border-gray-300 rounded p-6">
            <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p>{children}</p>
        </div>
    )
}