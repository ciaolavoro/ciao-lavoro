export function ContractCardWorker({ contract }) {

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false  };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <a href="#">
            <div className="max-w-md mx-auto my-6 bg-white border rounded-lg overflow-hidden p-6">
                <h2 className="text-2xl text-center font-semibold">Nombre del Cliente:</h2>
                <p className="mb-2 mt-1 text-2xl text-center"><strong>{contract.client.username}</strong></p>
                <p className="mb-2"><strong>Fecha de inicio:</strong> {formatDate(contract.initial_date)}</p>
                <p className="mb-2"><strong>Fecha fin:</strong> {formatDate(contract.end_date)}</p>
                <p className="mb-2"><strong>Estado:</strong> {contract.estatus}</p>
            </div>
        </a>
        

    );
}
