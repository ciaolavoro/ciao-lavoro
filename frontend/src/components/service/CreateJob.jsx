import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createJobRequest } from "../../api/Job.api.js";
import { useAuthContext } from "../auth/AuthContextProvider";

export default function CreateService() {
    const [nameJob, setNameJob] = useState('');
    const [estimated_price, setEstimated_price] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const { loggedUser } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        const url = window.location.href;
        const parts = url.split('/');
        if (parts.length >= 4) {
            const id = parts[4];
            setServiceId(id);
        }
        
    }, [serviceId]);

    const createJob = async (name,estimated_price,serviceId,token) => {
        try {
            const res = await createJobRequest(name,estimated_price,serviceId,token);
            if (res.status === 200) {
                navigate('/services/user');
            } else {
                alert('Error al crear servicio. Por favor, intente de nuevo.');
            }
        } catch (error) {
            alert(`Error al crear servicio: ${error}`);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        createJob(nameJob,estimated_price,serviceId,loggedUser.token);
    };

    return (
        <form className="flex flex-col justify-center items-center gap-4 mt-4" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold">Creación del trabajo</h1>
            <div className="flex items-center gap-2">
                <label>Nombre:</label>
                <input type="text" name="nameJob" value={nameJob} onChange={(e) => setNameJob(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Precio estimado:</label>
                <input type="number" name="estimated_price" value={estimated_price} onChange={(e) => setEstimated_price(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
            <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">Crear Trabajo</button>
        </form>
    );
}