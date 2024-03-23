import { updateContractStatus } from "../../api/Contract.api";
import { useAuthContext } from "../auth/AuthContextProvider";

export function ContractCardWorker({ contract }) {

    const { loggedUser } = useAuthContext();

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

    const updateStatus = async (contractId, statusNum, token) => {
        try {
            const response = await updateContractStatus(contractId, statusNum, token);
            if (response.ok) {
                alert('Estado actualizado correctamente');
                window.location.reload();
            } else {
                alert('Error al actualizar el estado. Por favor, intente de nuevo.');
            }
        } catch (error) {
            alert('Error al actualizar el estado. Por favor, intente de nuevo.');
        }
    };

    // Recordatorio de los estados con su NUM:
    // (1, "Negociacion"),
    // (2, "Aceptado"),
    // (3, "En proceso"),
    // (4, "Finalizado"),
    // (5, "Cancelado"),
    // (6, "Pagado")

    return (
        <a href="#">
            <div className={`max-w-md mx-auto my-2 border rounded-lg overflow-hidden p-6 ${getStatusColor(contract.estatus)}`}>
                <h2 className="text-2xl text-center font-semibold">Nombre del Cliente:</h2>
                <p className="mb-2 mt-1 text-2xl text-center"><strong>{contract.client.username}</strong></p>
                <p className="mb-2"><strong>Fecha de inicio:</strong> {formatDate(contract.initial_date)}</p>
                <p className="mb-2"><strong>Fecha fin:</strong> {formatDate(contract.end_date)}</p>
                <p className={"mb-2"}><strong>Estado:</strong> <p className={`${getStatusColor(contract.estatus)}`}>{contract.estatus}</p></p>

                {contract.estatus === "Negociacion" && (
                    <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4 mr-3"
                        onClick={() => updateStatus(contract.id, 2, loggedUser.token)}>
                        Aceptar Contrato
                    </button>
                )}

                {contract.estatus === "Negociacion" && (
                    <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={() => updateStatus(contract.id, 5, loggedUser.token)}>
                        Denegar Contrato
                    </button>
                )}
                <div className="flex justify-center items-center">
                    {contract.estatus === "Pagado" && (
                        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4 self-center"
                            onClick={() => updateStatus(contract.id, 3, loggedUser.token)}>
                            Comenzar trabajo
                        </button>
                    )}
                </div>
            </div>
        </a>
    );
}
