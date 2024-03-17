import { getAllUsers } from "../../api/Contract.api";
import { useEffect, useState } from "react";

export function ContractCardClient({ contract }) {

    const [workerName, setWorkerName] = useState("");
    const [estado, setEstado] = useState("");

    useEffect(() => {
        if (contract.status === 1) {
            setEstado("En negociacion");
          } else if (contract.status === 2) {
            setEstado("Aceptado");
          } else if (contract.status === 3) {
            setEstado("En proceso");
          }else if (contract.status === 4) {
            setEstado("Finalizado");
          }else if (contract.status === 5) {
            setEstado("Cancelado");
          }else {
            setEstado("Pagado");
          }

        const getUsers = async () => {
            try {
                const users = await getAllUsers();
                if (users.status === 200) {
                    const data = await users.json();
                    //Hago esto porque contract.worker es un string con la url del usuario
                    const idWorker = parseInt(contract.worker.split('/')[4]);
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id === idWorker) {
                            setWorkerName(data[i].first_name);
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
    }, [contract.worker, contract.status]);


    return (
        <a href="#">
            <div className="max-w-md mx-auto my-6 bg-white border rounded-lg overflow-hidden p-6">
                <h2 className="text-2xl font-semibold text-center">Nombre del Trabajador:</h2>
                <p className="mb-2 mt-1 text-2xl text-center"><strong>{workerName}</strong></p>
                <p className="mb-2"><strong>Fecha de inicio:</strong> {contract.initial_date}</p>
                <p className="mb-2"><strong>Fecha fin:</strong> {contract.end_date}</p>
                <p className="mb-2"><strong>Estado:</strong> {estado}</p>
            </div>
        </a>
        

    );
}
