import { useEffect, useState } from "react";
import { getAllContracts } from "../../api/Contract.api";
import { ContractCard } from './ContractCard'


export default function Contracts() {

    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        const getContracts = async () => {
            try {
                const res = await getAllContracts();
                if(res.status === 200){
                    const data = await res.json();
                    setContracts(data.results);
                } else {
                    alert('Error al cargar los contratos');
                }
            } catch (error) {
                alert('Error al cargar los contratos');
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