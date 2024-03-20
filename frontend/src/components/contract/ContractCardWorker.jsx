
export function ContractCardWorker({ contract }) {

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    function getStatusColor(estatus) {
        switch (estatus) {
            case "Negociacion":
                return "bg-sky-50"; 
            case "Aceptado":
                return "bg-green-50"; 
            case "En proceso":
                return "bg-yellow-50"; 
            case "Finalizado":
                return "bg-white"; 
            case "Cancelado":
                return "bg-rose-100"; 
            case "Pagado":
                return "bg-violet-100"; 
            default:
                return ""; 
        }
    }

    
    return (
        <a href="#">
            <div className={`max-w-md mx-auto my-2 border rounded-lg overflow-hidden p-6 ${getStatusColor(contract.estatus)}`}>
                <h2 className="text-2xl text-center font-semibold">Nombre del Cliente:</h2>
                <p className="mb-2 mt-1 text-2xl text-center"><strong>{contract.client.username}</strong></p>
                <p className="mb-2"><strong>Fecha de inicio:</strong> {formatDate(contract.initial_date)}</p>
                <p className="mb-2"><strong>Fecha fin:</strong> {formatDate(contract.end_date)}</p>
                <p className={"mb-2"}><strong>Estado:</strong> <p className={`${getStatusColor(contract.estatus)}`}>{contract.estatus}</p></p>
            </div>
        </a>


    );
}
