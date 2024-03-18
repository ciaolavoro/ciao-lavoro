

export function ContractCardClient({ contract }) {

    return (
        <a href="#">
            <div className="max-w-md mx-auto my-6 bg-white border rounded-lg overflow-hidden p-6">
                <h2 className="text-2xl font-semibold text-center">Nombre del Trabajador:</h2>
                <p className="mb-2 mt-1 text-2xl text-center"><strong>{contract.worker.username}</strong></p>
                <p className="mb-2"><strong>Fecha de inicio:</strong> {contract.initial_date}</p>
                <p className="mb-2"><strong>Fecha fin:</strong> {contract.end_date}</p>
                <p className="mb-2"><strong>Estado:</strong> {contract.estatus}</p>
            </div>
        </a>
        

    );
}
