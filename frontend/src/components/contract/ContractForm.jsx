import { useState, useEffect } from "react";
import { getAllUser, getAllServices } from "../../api/Contract.api";


const createContractURL = './api/contracts/create';

export default function ContractForm(){
    const [users, setUsers] = useState([]);
    const [services, setService] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await getAllUser();
                const serviceData = await getAllServices();
                setUsers(userData);
                setService(serviceData);
                console.log(users);
                console.log(services);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        
        }fetchData(); 
        
    }, []);
    
    
    
    

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
        service: '',
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
                <select name="worker" value={formData.worker} onChange={handleChange} className="px-2 py-1 border rounded">
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label>Cliente:</label>
                <select name="client" value={formData.client} onChange={handleChange} className="px-2 py-1 border rounded">
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
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
                    <option value="Ne">Negociacion</option> 
                    <option value="Ac">Aceptado</option>
                    <option value="En">En proceso</option>
                    <option value="Fi">Finalizado</option>
                    <option value="Ca">Cancelado</option>
                    <option value="Pa">Pagado</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label>Servicio:</label>
                <select name="service" value={formData.service} onChange={handleChange} className="px-2 py-1 border rounded">
                    {services.map(service => (
                        <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                </select>
            </div>
            <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">Crear Contrato</button>
        </form>
    )
}