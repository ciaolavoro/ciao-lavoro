import { ContractCard } from './ContractCard'
import { useGetBackendData } from "../../utils/useGetBackendData";

export default function Contracts() {
    const { data } = useGetBackendData('/contracts');
    const contracts = data?.results;

    return (
        <>
            {contracts?.map((contract, index) => (
                <ContractCard key={index} contract={contract} />
            ))}
        </>
    )
}