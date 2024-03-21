import { useEffect, useState } from "react";
import { getContracts } from "../../api/Contract.api";
import { ContractCardClient } from "./ContractCardClient";
import { ContractCardWorker } from "./ContractCardWorker";
import { useAuthContext } from "../auth/AuthContextProvider";
import { Navigate } from "react-router-dom";


export default function ContractUser() {
    const [workerContracts, setWorkerContracts] = useState([]);
    const [clientContracts, setClientContracts] = useState([]);
    const [initial_date, setInitial_date] = useState("");
    const [end_date, setEnd_date] = useState("");
    const [status, setStatus] = useState("");
    const { loggedUser } = useAuthContext();

    

    useEffect(() => {

        if (!loggedUser) {
            return (<Navigate to="/" />);
        }
    
        const getContract = async () => {
            try {
                const res = await getContracts(loggedUser.token, end_date, initial_date, status);
                if (res.status === 200) {
                    const data = await res.json();
                    setClientContracts(data.client);
                    setWorkerContracts(data.worker);
                } else {
                    alert('Error al cargar los contratos');
                }

            } catch (error) {
                alert('Error al cargar los contratos', error.status);
            }
        };
        getContract();
    }, [loggedUser.token, end_date, initial_date, status]);

    return (
        <div>
            <section>
                <h1 className="text-4xl font-semibold text-center my-10">Todos tus contratos</h1>
            </section>
            <section>
                <form className="flex flex-col sm:flex-row justify-center gap-2 my-4">
                    <label className="text-lg sm:text-xl font-semibold">Fecha inicio</label>
                    <input
                        type="date"
                        name="initial_date"
                        value={initial_date}
                        onChange={(e) => setInitial_date(e.target.value)}
                        className="px-2 py-1 border rounded"
                        min={new Date().toISOString().slice(0, 16)}
                    />
                    <label className="text-lg sm:text-xl font-semibold">Fecha fin</label>
                    <input
                        type="date"
                        name="end_date"
                        value={end_date}
                        onChange={(e) => setEnd_date(e.target.value)}
                        className="px-2 py-1 border rounded"
                        min={initial_date}
                    />
                    <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-orange-200 sm:w-auto pl-2 border rounded-lg py-2 font-semibold">
                        <option value=""> Estado </option>
                        <option value="1">En negociacion</option>
                        <option value="2">Aceptado</option>
                        <option value="3">En proceso</option>
                        <option value="4">Finalizado</option>
                        <option value="5">Cancelado</option>
                        <option value="6">Pagado</option>
                    </select>
                </form>
            </section>


            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap 2 divide-x-4 mx-auto ">
                <div>
                    <section>
                        <h2 className="text-2xl font-semibold text-center my-10">Contratos en los que has trabajado</h2>
                    </section>

                    {workerContracts.length === 0 ? (
                        <p className="text-center">No tienes contratos en los que seas trabajador.</p>
                    ) : (
                        <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 justify-items-left justify-left gap-y-10 gap-x-14 mt-2 mb-2">

                            {workerContracts.map(contractWorker => (
                                <ContractCardWorker key={contractWorker.id} contract={contractWorker} />
                            ))}
                        </section>
                    )}


                </div>

                <div>
                    <section>
                        <h2 className="text-2xl font-semibold text-center my-10">Contratos en los que eres cliente</h2>
                    </section>

                    {clientContracts.length === 0 ? (
                        <p className="text-center">No tienes contratos en los que seas cliente.</p>
                    ) : (
                        <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 justify-items-right justify-left gap-y-10 gap-x-14 mt-2 mb-2">

                            {clientContracts.map(contractClient => (
                                <ContractCardClient key={contractClient.id} contract={contractClient} />
                            ))}
                        </section>
                    )}
                </div>

            </div>




        </div>
    )
}