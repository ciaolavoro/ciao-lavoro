import { useEffect, useState } from "react";
import { getWorkerContracts, getClientContracts } from "../../api/Contract.api";
import { ContractCardClient } from "./ContractCardClient";
import { ContractCardWorker } from "./ContractCardWorker";
import { useAuthContext } from "../auth/AuthContextProvider";


export default function ContractUser(){
    const [workerContracts, setWorkerContracts] = useState([]);
    const [clientContracts, setClientContracts] = useState([]);
    const {loggedUser} = useAuthContext();

    useEffect(() =>{
        const getClientContract = async () => {

            try{
                const res = await getClientContracts(loggedUser.token);
                if (res.status === 200){
                    const data = await res.json();
                    setClientContracts(data);
                }else{
                    alert('Error al cargar los contratos');
                }

            }catch(error){
                alert('Error al cargar los contratos', error.status);
            }
        }; 
        const getWorkerContract = async () => {
            try{
                const res = await getWorkerContracts(loggedUser.token);
                if (res.status === 200){
                    const data = await res.json();
                    setWorkerContracts(data);
                }else{
                    alert('Error al cargar los contratos');
                }

            }catch(error){
                alert('Error al cargar los contratos', error.status);
            }
        }; 
        getClientContract();
        getWorkerContract();
    },[loggedUser.token]);

    return(
        <div>
            <section>
                <h1 className="text-4xl font-semibold text-center my-10">Todos tus contratos</h1>
            </section>
            <section>
                <h2 className="text-2xl font-semibold text-center my-10">Contratos en los que has trabajado</h2>
            </section>
            <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-left justify-left gap-y-20 gap-x-14 mt-10 mb-5">

                {workerContracts.map(contractWorker => (
                    <ContractCardWorker key={contractWorker.id} contract={contractWorker} />
                ))}
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-center my-10">Contratos en los que eres cliente</h2>
            </section>
            <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-right justify-left gap-y-20 gap-x-14 mt-10 mb-5">

                {clientContracts.map(contractClient => (
                    <ContractCardClient key={contractClient.id} contract={contractClient} />
                ))}
            </section>
        </div>
    )
}