import { useEffect, useState } from "react";
import { getAllContracts } from "../../api/Contract.api";
import { ContractCard } from './ContractCard'


export default function Contracts() {

    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        const getContracts = async () => {
            try {
                const res = await getAllContracts();
                console.log(res);
                if(res.status === 200){
                    const data = await res.json();
                    console.log(data);
                    setContracts(data.results);
                } else {
                    alert('Error al cargar los contratos');
                }
            } catch (error) {
                console.log(`Error al cargar los contratos: ${error}`);
            }
        };
        getContracts();
    }, []);

    return (
        <div>
            {contracts.map(contract => (
                <ContractCard key={contract.id} contract={contract} />
            ))}
        </div>
    )

}