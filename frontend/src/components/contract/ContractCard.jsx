export function ContractCard({ contract }) {
  return (
        <div className="max-w-md mx-auto my-6 bg-white border rounded-lg overflow-hidden p-6">
            <h2 className="text-2xl font-semibold mb-4">Detalles del Contrato</h2>
            <p className="mb-2 mt-4"><strong>Nombre del Trabajador:</strong> {contract.worker}</p>
            <p className="mb-2 mt-4"><strong>Nombre del Cliente:</strong> {contract.client}</p>

            <p className="mb-2"><strong>Descripción:</strong> {contract.description}</p>
            <p className="mb-2"><strong>Fecha de inicio:</strong> {contract.initial_date}</p>
            <p className="mb-2"><strong>Fecha fin:</strong> {contract.fin_date}</p>
            <p className="mb-2"><strong>Coste:</strong> {contract.cost} €</p>
            <p className="mb-2"><strong>Estado:</strong> {contract.state}</p>
        </div>

  );
}
