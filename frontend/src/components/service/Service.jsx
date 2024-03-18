import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { updateServiceRequest } from "../../api/Service.api";
import defaultUserImage from "../../assets/service/talonflame.jpg";
import ServiceData from "./ServiceData";
import JobData from "./JobData";
import ServiceButton from "./ServiceButton";
import PencilIcon from "../icons/PencilIcon";
import CheckIcon from "../icons/CheckIcon";
import CrossIcon from "../icons/CrossIcon";
import { useAuthContext } from "../auth/AuthContextProvider";

export default function ServiceDetails() {
    const service = useLoaderData();
    const { loggedUser } = useAuthContext();

    const [isEditing, setIsEditing] = useState(false);
    const [city, setCity] = useState(service.city);
    const [profession, setProfession] = useState(service.profession);
    const [experience, setExperience] = useState(service.experience);
    const [isActive, setIsActive] = useState(service.is_active);
    const [isPromoted, setIsPromoted] = useState(service.is_promoted);
    const [jobs,] = useState(service.jobs);

    const userImageUrl = `${import.meta.env.VITE_BACKEND_API_URL}${service.user.image}`;

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

    const handleEdit = (event) => {
        event.preventDefault();
        setIsEditing(true);

        const serviceData = {
            profession: profession,
            city: city,
            experience: experience,
            is_active: isActive,
            is_promoted: isPromoted,
        }

        if (window.confirm('¿Está seguro de guardar los cambios?')) {
            updateService(service.url.charAt(service.url.length - 2), serviceData, loggedUser.token);
        }
    };

    const handleCancel = () => {
        resetServiceData();
        setIsEditing(false);
    };

    return (
        <form className="flex flex-col justify-center items-center gap-y-10 my-10 mx-10 bg-white border rounded-lg" onSubmit={handleEdit}>
            <div className="flex w-full m-10">
                <div className="border bg-white shadow-md rounded-xl m-8">
                    <div className="flex flex-col gap-y-6 px-16 py-8 w-65">
                        <h2 className="text-3xl font-bold mb-4">Detalles de servicio:</h2>
                        <img src={userImageUrl ?? defaultUserImage} alt={`Foto del usuario ${service.user.username}`} className="mx-auto size-80 object-cover rounded-lg" />
                    </div>
                    <div className="flex flex-col justify-center gap-y-6 px-8 py-3">
                        <ServiceData type={"text"} formName={"username"} labelText={"Usuario:"} inputValue={service.user.username ?? "Pablo"} isReadOnly={true} />
                        <ServiceData type={"number"} formName={"profession"} labelText={"Profesión:"} inputValue={profession}
                            isReadOnly={!isEditing} onChange={(event) => setProfession(event.target.value)} />
                        <ServiceData type={"text"} formName={"city"} labelText={"Ciudad:"} inputValue={city}
                            isReadOnly={!isEditing} onChange={(event) => setCity(event.target.value)} />
                        <ServiceData type={"number"} formName={"experience"} labelText={"Experiencia:"} inputValue={experience}
                            isReadOnly={!isEditing} onChange={(event) => setExperience(event.target.value)} />
                        {isEditing ? (
                            <div className="flex justify-center gap-x-4">
                                <ServiceButton type={"submit"} text={"Guardar cambios"} icon={<CheckIcon />} />
                                <ServiceButton type={"button"} text={"Cancelar"} icon={<CrossIcon />} onClick={handleCancel} />
                            </div>
                        ) : (
                            <ServiceButton type={"button"} text={"Editar servicio"} icon={<PencilIcon />} onClick={() => setIsEditing(true)} />
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-y-6 px-10 py-6">
                    <h2 className="text-3xl font-bold mb-4">Trabajos:</h2>
                    {jobs.map((job) => (
                        <div key={job.id} className="w-90 border bg-white shadow-md rounded-xl m-8">
                            <div className="flex flex-col gap-y-6 px-10 py-6">
                                <JobData type={"text"} formName={`nameJob-${job.id}`} labelText={"Nombre:"}
                                    inputValue={job.name} isReadOnly={true} />
                                <JobData type={"number"} formName={`estimatedJobPrice-${job.id}`} labelText={"Precio estimado:"}
                                    inputValue={job.estimated_price} isReadOnly={true} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </form>        
    );
}