import {useEffect, useState} from "react";
import { getAllContracts } from "../../api/Contract.api";


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
            <div key={contract.id}>
                <h1>{contract.worker}</h1>
                <p>{contract.description}</p>
            </div>
        ))}</div>
    
}