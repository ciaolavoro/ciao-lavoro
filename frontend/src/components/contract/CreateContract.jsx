import { useState, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import { getAllUsers } from "../../api/Contract.api";
import { getAllServices } from "../../api/Contract.api";
import { createContractRequest } from "../../api/Contract.api";

export default function CreateContract(){
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [worker, setWorker] = useState('');
    const [client, setClient] = useState('');
    const [accept_worker, setAccept_worker] = useState(false);
    const [accept_client, setAccept_client] = useState(false);
    const [description, setDescription] = useState('');
    const [initial_date, setInitial_date] = useState('');
    const [end_date, setEnd_date] = useState('');
    const [cost, setCost] = useState('');
    const [status, setStatus] = useState('');
    const [service, setService] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const userRes = await getAllUsers();
                const userData = await userRes.json();
                const serviceRes = await getAllServices();
                const serviceData = await serviceRes.json();
                setUsers(userData.results);
                setServices(serviceData);
                console.log(userData.results);
                console.log(serviceData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        
        }fetchData(); 
        
    }, []);

    const createContract = async (worker, client, accept_worker, accept_client, description, initial_date, end_date, cost, status, service) => {
        try {
            const res = await createContractRequest(worker, client, accept_worker, accept_client, description, initial_date, end_date, cost, status, service);
            console.log(res)
            if (res.status === 200) {
                navigate('/');
            } else {
                alert('Error al crear el contrato. Por favor, intente de nuevo.');
            }
        } catch (error) {
            alert('Error al crear el contrato. Por favor, intente de nuevo.', console.log(error));
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        createContract(worker, client, accept_worker, accept_client, description, initial_date, end_date, cost, status, service);
    };

    

    return(
        <form className="flex flex-col justify-center items-center gap-4 mt-4" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold">Creación del Contrato</h1>
            <label>Trabajador:</label>
            <select name="worker" value={worker} onChange={(e) => setWorker(e.target.value)} className="px-2 py-1 border rounded">
                {users.map(user => (
                    <option key={user.id} value={`/user/${user.id}/`}>{user.username}</option>
                ))}
            </select>
            <div className="flex items-center gap-2">
                <label>Cliente:</label>
                <select name="client" value={client} onChange={(e) => setClient(e.target.value)} className="px-2 py-1 border rounded">
                    {users.map(user => (
                        <option key={user.id} value={`/user/${user.id}/`}>{user.username}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                    <label htmlFor="accept_worker">Permiso trabajador:</label>
                    <input
                        type="checkbox"
                        name="accept_worker"
                        checked={accept_worker}
                        onChange={(e) => setAccept_worker(e.target.value)}
                        className="mr-2"
                    />
                </div>
                <div className="flex gap-2">
                    <label htmlFor="accept_client">Permiso cliente:</label>
                    <input
                        type="checkbox"
                        name="accept_client"
                        checked={accept_client}
                        onChange={(e) => setAccept_client(e.target.value)}
                        className="mr-2"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <label>Descripción:</label>
                <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Fecha de inicio:</label>
                <input type="date" name="initial_date" value={initial_date} onChange={(e) => setInitial_date(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Fecha de finalización:</label>
                <input type="date" name="end_date" value={end_date} onChange={(e) => setEnd_date(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Coste del trabajo:</label>
                <input type="number" name="cost" value={cost} onChange={(e) => setCost(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Estado:</label>
                <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} className="px-2 py-1 border rounded">
                    <option value="Ne">Negociacion</option>
                    <option value="Ac">Aceptado</option>
                    <option value="En">En proceso</option>
                    <option value="Fi">Finalizado</option>
                    <option value="Ca">Cancelado</option>
                    <option value="Pa">Pagado</option>
                </select>
                <div className="flex items-center gap-2">
                    <label>Servicio:</label>
                    <select name="service" value={service} onChange={(e) => setService(e.target.value)} className="px-2 py-1 border rounded">
                        {services.map(service => (
                            <option key={service.id} value={`/service/${service.id}/`}>{service.profession}</option>
                        ))}
                    </select>
                </div>
            </div>
            <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">Crear Contrato</button>
        </form>
    )
}