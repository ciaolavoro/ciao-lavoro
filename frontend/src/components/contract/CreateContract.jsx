import { useState } from "react";
import { useNavigate,useSearchParams  } from "react-router-dom";
import { createContractRequest } from "../../api/Contract.api";

export default function CreateContract() {
    const [description, setDescription] = useState('');
    const [initial_date, setInitial_date] = useState('');
    const [end_date, setEnd_date] = useState('');
    const [cost, setCost] = useState('');
    const [charCount, setCharCount] = useState(0);
    

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const serviceId = searchParams.get('service_id');

    const createContract = async (description, initial_date, end_date, cost) => {
        if (charCount > 500) {
            alert('La descripción no puede superar los 500 caracteres.');
            return;
        }
        try {
            const res = await createContractRequest(description, initial_date, end_date, cost,serviceId);
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
        createContract(description, initial_date, end_date, cost);
    };

    const handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        setDescription(newDescription);
        setCharCount(newDescription.length);
    };

    return (
        <form className="flex flex-col justify-center items-center gap-4 mt-4" onSubmit={handleSubmit}>
            <br></br>
            <h1 className="text-4xl font-bold">Creación del Contrato</h1>
            <br></br>
            <div className="flex items-center gap-2">
                <label>Descripción:</label>
                <textarea
                    name="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="px-2 py-1 border rounded resize-both"
                    rows="4"
                    maxLength="500"
                />
                <span>{charCount}/500</span>
            </div>
            <div className="flex items-center gap-2">
                <label>Fecha y hora de inicio:</label>
                <input
                    type="datetime-local"
                    name="initial_date"
                    value={initial_date}
                    onChange={(e) => setInitial_date(e.target.value)}
                    className="px-2 py-1 border rounded"
                    min={new Date().toISOString().slice(0, 16)}
                />
            </div>
            <div className="flex items-center gap-2">
                <label>Fecha y hora de finalización:</label>
                <input
                    type="datetime-local"
                    name="end_date"
                    value={end_date}
                    onChange={(e) => setEnd_date(e.target.value)}
                    className="px-2 py-1 border rounded"
                    min={initial_date}
                />
            </div>
            <div className="flex items-center gap-2">
                <label>Coste del trabajo:</label>
                <input
                    type="number"
                    name="cost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="px-2 py-1 border rounded"
                    min="0"
                />
            </div>
            <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">Crear Contrato</button>
        </form>
    )
}
