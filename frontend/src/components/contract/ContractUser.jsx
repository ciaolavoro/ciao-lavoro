import { useEffect, useState } from "react";
import { getContractsClients, getContractsWorkers } from "../../api/Contract.api";
import { ContractCardClient } from "./ContractCardClient";
import { ContractCardWorker } from "./ContractCardWorker";
import { useAuthContext } from "../auth/AuthContextProvider";
import { Navigate } from "react-router-dom";
import Accordion from "./Accordion";


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
                const resClient = await getContractsClients(loggedUser.token, end_date, initial_date, status);
                const resWorker = await getContractsWorkers(loggedUser.token, end_date, initial_date, status);
                if (resClient.status === 200 && resWorker.status === 200) {
                    const dataClient = await resClient.json();
                    const dataWorker = await resWorker.json();
                    setClientContracts(dataClient);
                    setWorkerContracts(dataWorker);
                } else {
                    alert('Error al cargar los contratos');
                }

            } catch (error) {
                alert('Error al cargar los contratos', error.status);
            }
        };
        getContract();
    }, [loggedUser, end_date, initial_date, status]);

    // (1, "Negociacion"),
    // (2, "Aceptado"),
    // (3, "En proceso"),
    // (4, "Finalizado"),
    // (5, "Cancelado"),
    // (6, "Pagado")
    return (
        <div>
            <section className="px-5">
                <h1 className="text-4xl font-semibold text-center my-10">Todos tus contratos</h1>
            </section>

            <section className="px-5 lg:px-80 md:px-30 sm:px-20 py-6 ">
                <div className="p-4 bg-white rounded-lg divide-y-2">
                    <Accordion
                        title=
                        '¿Cuántos estados hay?'
                        answer=
                        {`
                        En total hay 6 estados:

                        - Negociación: el contrato se ha creado, y esta pendiente de que el trabajador lo acepte o deniegue.
                        - Aceptado: el contrato ha sido aceptado por el trabajador y el cliente debe realizar el pago.
                        - Cancelado: El contrato ha sido cancelado por el trabajador. 
                        - Pagado: el pago ha sido realizado. Solo falta esperar a que llegue el momento de realizar el trabajo.
                        - En proceso: el trabajador debe indicar que ya ha comenzado a realizar el trabajo para el cual se le habia contactado.
                        - Finalizado: una vez el trabajo ha sido acabado, el cliente debe marcar como finalizado el contrato.`}
                    />

                    <Accordion
                        title=
                        '¿Que significan los colores?'
                        answer=
                        {`
                        Dependiendo del estado en el que se encuentre el contrato, aparecerá como un color u otro para que sea más fácil de 
                        reconocer:

                        - Negociación: azul.
                        - Aceptado: verde.
                        - Cancelado: rojo. 
                        - Pagado: violeta.
                        - En proceso: amarillo.
                        - Finalizado: blanco.`}
                    />

                    <Accordion
                        title=
                        '¿Como funcionan los botones?'
                        answer=
                        {`
                        Teniendo en cuenta la explicación que damos sobre los estados en el primer apartado, hay que tener en 
                        cuenta las siguientes cosas:
                        
                        - Negociación: si esta en estado de negociación, solo el trabajador podra aceptaro o denegarlo.
                        - Aceptado: una vez aceptado, aparecera un boton para pagar al cliente. Hasta que no se pague no se pondrá en 
                        marcha el trabajo llegado el día.
                        - Pagado: si se encuentra en estado de pagado, cuando llegue el dia, el trabajador deberá marcar que se ha comenzado 
                        el trabajo para que pase a estar en proceso. 
                        - En proceso: si el contrato no se encuentra en estado de En proceso, no se podrá finalizar. 
                        - Finalizado: solo el cliente podrá finalizar una vez esté el trabajo terminado.`}
                    />
                </div>
            </section>

            <section className="px-5 lg:px-80 md:px-30 sm:px-20 py-6 ">
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


            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap 2 lg:divide-x-4 md:divide-x-2 mx-auto px-5">
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