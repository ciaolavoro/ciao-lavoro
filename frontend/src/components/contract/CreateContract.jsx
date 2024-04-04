import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createContractRequest, checkWorkerAssociation  } from "../../api/Contract.api";
import { useAuthContext } from "../auth/AuthContextProvider";

export default function CreateContract() {
 const [description, setDescription] = useState('');
 const [initial_date, setInitial_date] = useState('');
 const [end_date, setEnd_date] = useState('');
 const [cost, setCost] = useState('');
 const [charCount, setCharCount] = useState(0);

 const navigate = useNavigate();
 const [searchParams] = useSearchParams();
 const service_Id = searchParams.get('service_id');
 const { loggedUser } = useAuthContext();

    const createContract = async (token) => {
        try {

            const res = await createContractRequest(description, initial_date, end_date, cost, service_Id, token);
            if (res.status === 200) {
                navigate('/');
            } else {
                alert('Error al crear el contrato. Por favor, inténtelo de nuevo.');
            }
        } catch (error) {
            alert('Error al crear el contrato. Por favor, inténtelo de nuevo.', console.error(error));
        }
    };


 const handleSubmit = async (event) => {
    event.preventDefault();
    const token = loggedUser.token;
    const isNotAssociated = await checkWorkerAssociation(service_Id); //La funcion a llamar, si esta asociado devuelve false
    
    if(isNotAssociated){
        if (!description.trim()) {
            alert('La descripción no puede estar vacía.');
            return;
        }
        if (charCount > 500) {
            alert('La descripción no puede superar los 500 caracteres.');
            return;
        }
        const now = new Date();
        const startDate = new Date(initial_date);
        const endDate = new Date(end_date);
        if (startDate <= now) {
            alert('La fecha y hora de inicio debe ser posterior a la hora actual.');
            return;
        }
        if (endDate <= startDate) {
            alert('La fecha y hora de fin debe ser posterior a la fecha y hora de inicio.');
            return;
        }
        if (cost < 0) {
            alert('El coste no puede ser negativo.');
            return;
        }
        await createContract(token);    
    }else{
        alert('No puedes contratar un servicio del que eres trabajador');
    }
};

 const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    setCharCount(newDescription.length);
 };

 return (
    <form className="flex flex-col justify-center items-center gap-y-4 mt-10 mx-auto w-3/4 md:w-1/2 lg:w-1/3 py-10 bg-white border rounded-lg" onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold">Creación del Contrato</h1>
      <div className="flex flex-col gap-y-4 w-full px-4">
        <label>Descripción:</label>
        <textarea
          name="description"
          value={description}
          onChange={handleDescriptionChange}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
          rows="3"
          maxLength="500"
        />
        <span>{charCount}/500</span>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
          <div className="flex flex-col gap-y-4">
            <label>Fecha y hora de inicio:</label>
            <input
              type="datetime-local"
              name="initial_date"
              value={initial_date}
              onChange={(e) => setInitial_date(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <label>Fecha y hora de finalización:</label>
            <input
              type="datetime-local"
              name="end_date"
              value={end_date}
              onChange={(e) => setEnd_date(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              min={initial_date}
              required
            />
          </div>
        </div>
        <label>Coste del trabajo:</label>
        <input
          type="number"
          name="cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
          min="0"
          required
        />
      </div>
      <button type="submit" className="bg-orange-300 hover:bg-orange-400 text-white rounded px-4 py-2 font-semibold">Crear Contrato</button>
    </form>
 );
}

