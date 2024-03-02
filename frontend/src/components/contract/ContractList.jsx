import {useEffect, useState} from "react";
import { getAllContracts } from "../../api/Contract.api";
import { ContractCard } from './ContractCard'


export function ContractList(){

    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        async function loadContracts() {
            const res = await getAllContracts();
            setContracts(res.data.results);
            console.log(res)

        }
        loadContracts();
    }, []);
    return <div>
            {contracts.map(contract => (
                <ContractCard key={contract.id} contract={contract}/>
        ))}</div>
    
}