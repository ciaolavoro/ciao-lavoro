import { getAllUsers } from "../../api/Contract.api";
import { useEffect, useState } from "react";

export function ContractCard({ contract }) {

    const [workerName, setWorkerName] = useState("");
    const [clientName, setClientName] = useState("");

    useEffect(() => {

        const getUsers = async () => {
            try {
                const users = await getAllUsers();
                if (users.status === 200) {
                    const data = await users.json();
                    for (let i = 0; i < data.results.length; i++) {
                        if (data.results[i].url === contract.worker) {
                            setWorkerName(data.results[i].first_name);
                        }
                        else if (data.results[i].url === contract.client) {
                            setClientName(data.results[i].first_name);
                        }
                    }
                } else {
                    alert('Error al cargar los usuarios');
                }
            } catch (error) {
                alert('Error al cargar los usuarios');
            }
        };
        getUsers();
    }, [contract.worker, contract.client]);


    return (
        <div className="max-w-md mx-auto my-6 bg-white border rounded-lg overflow-hidden p-6">
            <h2 className="text-2xl font-semibold mb-4">Detalles del Contrato</h2>
            <p className="mb-2 mt-4"><strong>Nombre del Trabajador:</strong> {workerName}</p>
            <p className="mb-2 mt-4"><strong>Nombre del Cliente:</strong> {clientName}</p>
            <p className="mb-2"><strong>Fecha de inicio:</strong> {contract.initial_date}</p>
            <p className="mb-2"><strong>Fecha fin:</strong> {contract.end_date}</p>
            <p className="mb-2"><strong>Estado:</strong> {contract.status}</p>
        </div>

    );
}
