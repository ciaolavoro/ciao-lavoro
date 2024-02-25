export default function WorkerCard({ worker }) {
    return (
        <li className="flex bg-white border border-gray-300 rounded">
            <img src={worker.profileImg} alt="Imagen de un trabajador" className="w-[128px] object-cover" />
            <div className="flex flex-col justify-center gap-y-4 p-4">
                <h4 className="text-lg font-semibold">{worker.name}</h4>
                <p>{worker.profession}</p>
                <p>{worker.salaryPerHour} €/h</p>
            </div>
        </li>
    )
}