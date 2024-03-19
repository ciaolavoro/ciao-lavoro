import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createServiceRequest } from "../../api/Service.api";
import { useAuthContext } from "../auth/AuthContextProvider";

export default function CreateService() {
    const [email, setEmail] = useState('');
    const [profession, setProfession] = useState(null);
    const [city, setCity] = useState('');
    const [experience, setExperience] = useState('');
    const navigate = useNavigate();
    const { loggedUser } = useAuthContext();

    const createService = async (email, profession, city, experience) => {
        try {
            console.log(profession);
            const res = await createServiceRequest(email, profession, city, experience, loggedUser.token);
            if (res.status === 200) {
                alert('El servicio se ha creado correctamente')
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
        createService(email, Number(profession), city, experience);
    };

    return (
        <form className="flex flex-col justify-center items-center gap-4 mt-4" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold">Creación del servicio</h1>
            <div className="flex items-center gap-2">
                <label>Email:</label>
                <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Profesión:</label>
                <select name="profession" value={profession} onChange={(e) => setProfession(e.target.value)} className="px-2 py-1 border rounded">
                    <option value="1">Lavandero</option>
                    <option value="2">Celador</option>
                    <option value="3">Albañil</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label>Ciudad:</label>
                <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
                <label>Experiencia:</label>
                <input type="number" name="experience" value={experience} onChange={(e) => setExperience(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
            <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">Crear Servicio</button>
        </form>
    );
}