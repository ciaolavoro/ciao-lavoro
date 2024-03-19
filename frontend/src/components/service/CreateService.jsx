import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createServiceRequest } from "../../api/Service.api";
import { useAuthContext } from "../auth/AuthContextProvider";
import { getServiceByUser } from "../../api/Service.api";
import { checkProfessionDuplicated, checkIfEmpty, checkCityLength, checkExperienceNegative, errorMessages } from "../../utils/validation";

export default function CreateService() {
    const { loggedUser } = useAuthContext();
    const [email] = useState(loggedUser.user.email);
    const [profession, setProfession] = useState(null);
    const professions = ["Lavandero", "Celador", "Albañil"];
    const [city, setCity] = useState('');
    const [experience, setExperience] = useState('');
    const [isRequiredCityError, setIsRequiredCityError] = useState(false);
    const [isRequiredExperienceError, setIsRequiredExperienceError] = useState(false);
    const [isCityError, setIsCityError] = useState(false);
    const [isProfessionDuplicated, setProfessionDuplicated] = useState(false);
    const [isExperienceError, setIsExperienceError] = useState(false);
    const navigate = useNavigate();
    const { loggedUser } = useAuthContext();

    const createService = async (email, professionNumber, city, experience) => {
        try {
            const listprofession = await getProfessionsByUser(loggedUser.user.id)
            if (checkIfEmpty(city)) {
                setIsRequiredCityError(true);
                return;
            } else if (checkIfEmpty(experience.toString())) {
                resetErrors();
                setIsRequiredExperienceError(true);
                return;
            } else if (checkExperienceNegative(experience)) {
                resetErrors();
                setIsExperienceError(true);
                return;
            } else if (checkCityLength(city)) {
                resetErrors();
                setIsCityError(true);
                return;
            } else if (checkProfessionDuplicated(professions[professionNumber - 1], listprofession)) {
                resetErrors();
                setProfessionDuplicated(true);
                return;
            }
            resetErrors();
            const res = await createServiceRequest(email, professionNumber, city, experience, loggedUser.token);
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

    const getProfessionsByUser = async (userId) => {
        try {
            // Obtener los servicios del usuario
            const serviceResponse = await getServiceByUser(userId);
            const services = await serviceResponse.json();
            // Extraer los tipos de profesión de los servicios
            const professionTypes = services.map(service => service.profession);
            // Filtrar los tipos únicos de profesión
            const uniqueProfessions = [...new Set(professionTypes)];
            return uniqueProfessions;
        } catch (error) {
            console.error('Error fetching professions:', error);
            return [];
        }
    };



    const resetErrors = () => {
        setIsRequiredCityError(false);
        setIsRequiredExperienceError(false);
        setIsCityError(false);
        setIsExperienceError(false);
        setProfessionDuplicated(false);
    }



    const handleSubmit = (event) => {
        event.preventDefault();
        createService(email, Number(profession), city, experience, profession);
    };

    return (
        <form className="flex flex-col justify-center items-center gap-y-10 mt-10 mx-44 py-14 bg-white border rounded-lg" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold">Creación del servicio</h1>
            <div className="flex items-center gap-2">
                <label>Profesión:</label>
                <select name="profession" value={profession} onChange={(e) => setProfession(e.target.value)} className="px-2 py-1 border rounded">
                    <option value="1">Lavandero</option>
                    <option value="2">Celador</option>
                    <option value="3">Albañil</option>
                </select>
                {isProfessionDuplicated && (
                    <p className="text-red-500">
                        {errorMessages.professionDuplicate}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2">
                <label>Ciudad:</label>
                <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} className="px-2 py-1 border rounded" />
                {(isRequiredCityError || isCityError) && (
                    <p className="text-red-500">
                        {isRequiredCityError ? errorMessages.required : isCityError && errorMessages.cityLength}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2">
                <label>Experiencia:</label>
                <input type="number" name="experience" value={experience} onChange={(e) => setExperience(e.target.value)} className="px-2 py-1 border rounded" />
                {(isRequiredExperienceError || isExperienceError) && (
                    <p className="text-red-500">
                        {isRequiredExperienceError ? errorMessages.required : isExperienceError && errorMessages.experienceNotValid}
                    </p>
                )}
            </div>
            <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">Crear Servicio</button>
        </form>
    );
}