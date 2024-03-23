import { useLoaderData, useParams } from "react-router-dom";
import { useState } from "react";
import { updateServiceRequest } from "../../api/Service.api";
import ServiceData from "./ServiceData";
import ServiceButton from "./ServiceButton";
import PencilIcon from "../icons/PencilIcon";
import CheckIcon from "../icons/CheckIcon";
import CrossIcon from "../icons/CrossIcon";
import { useAuthContext } from "../auth/AuthContextProvider";
import { checkIfEmpty, checkCityLength, checkExperienceNegative, errorMessages } from "../../utils/validation";
import Jobs from "./Jobs";

export default function ServiceDetails() {
    const service = useLoaderData();
    const { loggedUser } = useAuthContext();
    const [isEditing, setIsEditing] = useState(false);
    const [city, setCity] = useState(service.city);
    const [profession, setProfession] = useState(service.profession);
    const [experience, setExperience] = useState(service.experience);
    const [isActive, setIsActive] = useState(service.is_active);
    const [isPromoted, setIsPromoted] = useState(service.is_promoted);
    const { serviceId } = useParams();
    const professions = ["Lavandero", "Celador", "Albañil"];
    const [isRequiredCityError, setIsRequiredCityError] = useState(false);
    const [isRequiredExperienceError, setIsRequiredExperienceError] = useState(false);
    const [isCityError, setIsCityError] = useState(false);
    const [isExperienceError, setIsExperienceError] = useState(false);

    const resetServiceData = () => {
        setCity(service.city);
        setProfession(service.profession);
        setExperience(service.experience);
        setIsActive(service.is_active);
        setIsPromoted(service.is_promoted);
    }

    const updateService = async (serviceId, serviceData, token) => {
        try {
            const response = await updateServiceRequest(serviceId, serviceData, token);
            if (response.ok) {
                alert('Servicio actualizado correctamente');
                setIsEditing(false);
            } else {
                alert('Error al actualizar el servicio. Por favor, intente de nuevo.');
                resetServiceData();
            }
        } catch (error) {
            alert('Error al actualizar el servicio. Por favor, intente de nuevo.');
            resetServiceData();
        }
    }

    const resetErrors = () => {
        setIsRequiredCityError(false);
        setIsRequiredExperienceError(false);
        setIsCityError(false);
        setIsExperienceError(false);
    }

    const handleEdit = async (event) => {
        event.preventDefault();
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
        }
        resetErrors();
        setIsEditing(true);
        const position = getPosicionProfession(profession);
        const serviceData = {
            id: service.id,
            profession: position + 1,
            city: city,
            experience: experience,
            is_active: isActive,
            is_promoted: isPromoted,
            jobs: service.jobs,
            user: service.user,
        }

        if (window.confirm('¿Está seguro de guardar los cambios?')) {
            updateService(service.id, serviceData, loggedUser.token);
        }
    };

    const handleCancel = () => {
        resetServiceData();
        setIsEditing(false);
        resetErrors();
    };

    function getPosicionProfession(profession) {
        return professions.lastIndexOf(profession);
    }

    return (
        <form className="flex flex-col justify-center items-center gap-y-10 my-10 mx-10 bg-white border rounded-lg" onSubmit={handleEdit}>
            <div className="flex w-full m-10">
                <div className="border bg-white shadow-md rounded-xl m-8">
                    <div className="flex flex-col gap-y-6 px-16 py-8 w-65">
                        <h2 className="text-3xl font-bold mb-4">Detalles de servicio:</h2>
                        <img src={"https://images.unsplash.com/photo-1646753522408-077ef9839300?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NjZ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"} className="mx-auto size-80 object-cover rounded-lg" />
                    </div>
                    <div className="flex flex-col justify-center gap-y-6 px-8 py-3">
                        <ServiceData type={"text"} formName={"username"} labelText={"Usuario:"} inputValue={service.user.username ?? "Pablo"} isReadOnly={true} />

                        <div>
                            <label htmlFor="profession" className="flex flex-col gap-x-4 text-1.7xl font-semibold">Profesión:   </label>
                            <select
                                id="profession"
                                name="profession"
                                value={profession}
                                disabled={!isEditing}
                                onChange={(event) => setProfession(event.target.value)}
                                className="pl-2 border rounded w-full md:w-94"
                            >
                                {professions.map((profession, index) => (
                                    <option key={index} value={profession}>{profession}</option>
                                ))}
                            </select>
                        </div>
                        <ServiceData type={"text"} formName={"city"} labelText={"Ciudad:"} inputValue={city}
                            isReadOnly={!isEditing} onChange={(event) => setCity(event.target.value)} isError={isRequiredCityError || isCityError}
                            errorMessage={(isRequiredCityError && errorMessages.required) || (isCityError && errorMessages.cityLength)} />
                        <ServiceData type={"number"} formName={"experience"} labelText={"Experiencia:"} inputValue={experience}
                            isError={isRequiredExperienceError || isExperienceError}
                            errorMessage={(isRequiredExperienceError && errorMessages.required) || (isExperienceError && errorMessages.experienceNotValid)}
                            isReadOnly={!isEditing} onChange={(event) => setExperience(event.target.value)} />

                        <div className="grid grid-cols-2 gap-x-4 items-center w-full">
                            <p className="text-1.7xl font-semibold text-right"><strong>¿Activo?:</strong></p>
                            <p className="pl-2  w-full">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(event) => {
                                        if (loggedUser.user.username === service.user.username) {
                                            setIsActive(event.target.checked);
                                        } else {
                                            console.log("No tiene permisos para cambiar el estado del servicio.");
                                        }
                                    }}
                                    disabled={(loggedUser && service.user) ? loggedUser.user.username !== service.user.username : false}
                                /></p>

                        </div>
                        {isEditing ? (
                            <div className="flex justify-center gap-x-4">
                                <ServiceButton type={"submit"} text={"Guardar cambios"} icon={<CheckIcon />} />
                                <ServiceButton type={"button"} text={"Cancelar"} icon={<CrossIcon />} onClick={handleCancel} />
                            </div>
                        ) : (
                            loggedUser && loggedUser.user && loggedUser.user.username === service.user.username && (
                                <ServiceButton type={"button"} text={"Editar servicio"} icon={<PencilIcon />} onClick={() => setIsEditing(true)} />
                            )
                        )}
                    </div>
                </div>
                <Jobs jobs={service.jobs} serviceId={serviceId} />
            </div>
        </form>
    );
}