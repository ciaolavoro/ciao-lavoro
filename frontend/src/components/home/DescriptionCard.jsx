export default function DescriptionCard({ icon, title, children }) {
    return (
        <div className="flex flex-col bg-white border border-gray-300 rounded p-6">
            <div className="flex flex-grow items-center gap-2">
                {icon}
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p>{children}</p>
        </div>
    )
}