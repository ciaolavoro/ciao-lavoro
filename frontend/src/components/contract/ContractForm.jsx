import { useState } from "react";

const createContractURL = '/api/service/create';

export default function ContractForm(){
    

    const [formData, setFormData] = useState({
        worker : '',
        client: '',
        acceptWorker: false,
        acceptClient: false,
        description: '',
        initial_date: Date.now(),
        fin_date: Date.now(),
        cost : 1,
        state : '',
    });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        };

        try {
            await fetch(createContractURL, options);
            alert('Contrato creado exitosamente!');
        } catch (error) {
            console.error('Error al crear contrato:', error);
        }
    };

    return(
        <form className="flex flex-col justify-center items-center gap-4 mt-4" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold">Creación del Contrato</h1>
            <div className="flex items-center gap-2">
                <label>Trabajador:</label>
                <input type="text" name="worker" value={formData.worker} onChange={handleChange} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Cliente:</label>
                <input type="text" name="client" value={formData.client} onChange={handleChange} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                    <label htmlFor="accept_worker">Permiso trabajador:</label>
                    <input type="checkbox" name="accept_worker" checked={formData.acceptWorker} onChange={() => setFormData({ ...formData, acceptWorker: !formData.acceptWorker })} className="mr-2" />
                </div>
                <div className="flex gap-2">
                    <label htmlFor="accept_client">Permiso cliente:</label>
                    <input type="checkbox" name="accept_client" checked={formData.acceptClient} onChange={() => setFormData({ ...formData, acceptClient: !formData.acceptClient })} className="mr-2" />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <label>Descripción:</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Fecha de inicio:</label>
                <input type="date" name="initial_date" value={formData.initial_date} onChange={handleChange} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Fecha de finalización:</label>
                <input type="date" name="fin_date" value={formData.fin_date} onChange={handleChange} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Coste del trabajo:</label>
                <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="px-2 py-1 border rounded" />
            </div>
            
            <div className="flex items-center gap-2">
                <label>Estado:</label>
                <select name="state" value={formData.state} onChange={handleChange} className="px-2 py-1 border rounded">
                    <option value="Negociacion">Negociacion</option>
                    <option value="Aceptado">Aceptado</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Pagado">Pagado</option>
                </select>
            </div>
            <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">Crear Contrato</button>
        </form>
    )
}