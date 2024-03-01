import { getAllUser } from "../../api/Contract.api";
import {useEffect, useState} from "react";

export function ContractCard({ contract }) {

    const [workerName, setWorkerName] = useState("");
    const [clientName, setClientName] = useState("");

    //el useEffect lo he hecho con ayuda de ChatGPT
    useEffect(() => {
        async function loadUsers() {
            const users = await getAllUser();
            for(let i = 0; i < users.data.results.length; i++){

                if(users.data.results[i].id === contract.worker){
                    setWorkerName(users.data.results[i].name);
                }
                if(users.data.results[i].id === contract.client){
                    console.log(users.data.results[i].name);
                    setClientName(users.data.results[i].name);
                }
            }
            console.log(users.data.results);

        } loadUsers();

    }, [contract.worker, contract.client]);


    return (
        <div className="max-w-md mx-auto my-6 bg-white border rounded-lg overflow-hidden p-6">
            <h2 className="text-2xl font-semibold mb-4">Detalles del Contrato</h2>
            <p className="mb-2 mt-4"><strong>Nombre del Trabajador:</strong> {workerName}</p>
            <p className="mb-2 mt-4"><strong>Nombre del Cliente:</strong> {clientName}</p>

            <p className="mb-2"><strong>Descripción:</strong> {contract.description}</p>
            <p className="mb-2"><strong>Fecha de inicio:</strong> {contract.initial_date}</p>
            <p className="mb-2"><strong>Fecha fin:</strong> {contract.fin_date}</p>
            <p className="mb-2"><strong>Coste:</strong> {contract.cost} €</p>
            <p className="mb-2"><strong>Estado:</strong> {contract.state}</p>
        </div>

    );
}
