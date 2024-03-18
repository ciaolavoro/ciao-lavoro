import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { createJobRequest } from "../../api/Job.api.js";
import { useAuthContext } from "../auth/AuthContextProvider";

export default function CreateService() {
    const [nameJob, setNameJob] = useState('');
    const [estimated_price, setEstimated_price] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const { loggedUser } = useAuthContext();
    const { serviceIdFromUrl } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const url = window.location.href;
        // Dividimos la URL por las barras
        const parts = url.split('/');
        // El ID está en la tercera parte (índice 2) de la URL
        if (parts.length >= 4) {
            const id = parts[4];
            // Actualizamos el estado con el ID
            setServiceId(id);
        }
        
    }, [serviceId]);

    const createJob = async (name,estimated_price,serviceId,token) => {
        try {
            const res = await createJobRequest(name,estimated_price,serviceId,token);
            if (res.status === 200) {
                navigate('/');
            } else {
                alert('Error al crear servicio. Por favor, intente de nuevo.');
            }
        } catch (error) {
            console.log(`Error al crear servicio: ${error}`);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        createJob(nameJob,estimated_price,serviceId,loggedUser.token);
    };

    return (
        <form className="flex flex-col justify-center items-center gap-4 mt-4" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold">Creación de la tarea</h1>
            <div className="flex items-center gap-2">
                <label>Nombre:</label>
                <input type="text" name="nameJob" value={nameJob} onChange={(e) => setNameJob(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Precio estimado:</label>
                <input type="number" name="estimated_price" value={estimated_price} onChange={(e) => setEstimated_price(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
            <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">Crear Tarea</button>
        </form>
    );
}