import { useEffect, useState } from "react";
import { getWorkerContracts, getClientContracts } from "../../api/Contract.api";
import { ContractCard } from "./ContractCardClient";
import { useAuthContext } from "../auth/AuthContextProvider";


export default function ContractUser(){
    const [workerContracts, setWorkerContracts] = useState([]);
    const [clientContracts, setClientContracts] = useState([]);
    const {loggedUser} = useAuthContext();

    useEffect(() =>{
        const getClientContract = async () => {

            try{
                const res = await getClientContracts(loggedUser.token);
                console.log(res)
                if (res.status === 200){
                    const data = await res.json();
                    console.log(data)
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
                console.log(error);
            }
        }; 
        getClientContract();
        getWorkerContract();
    },[workerContracts, clientContracts,loggedUser]);
    return(
        <div>
            <section>
                <h1 className="text-4xl font-semibold text-center my-10">Todos son todos los contratos en los que has participado</h1>
            </section>
            <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-left justify-left gap-y-20 gap-x-14 mt-10 mb-5">

                {workerContracts.map(contract => (
                    <ContractCard key={contract.id} contract={contract} />
                ))}
            </section>
            <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-right justify-left gap-y-20 gap-x-14 mt-10 mb-5">

                {clientContracts.map(contract => (
                    <ContractCard key={contract.id} contract={contract} />
                ))}
            </section>
        </div>
    )
}