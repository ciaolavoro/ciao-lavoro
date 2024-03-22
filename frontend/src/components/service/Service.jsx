import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { updateServiceRequest } from "../../api/Service.api";
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
    const [reviews,] = useState(service.reviews);

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
            id: service.id,
            profession: profession,
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
        
    };
console.log(service)
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
                        <ServiceData type={"number"} formName={"profession"} labelText={"Profesión:"} inputValue={profession} isReadOnly={!isEditing} onChange={(event) => setProfession(event.target.value)} />
                        <ServiceData type={"text"} formName={"city"} labelText={"Ciudad:"} inputValue={city} isReadOnly={!isEditing} onChange={(event) => setCity(event.target.value)} />
                        <ServiceData type={"number"} formName={"experience"} labelText={"Experiencia:"} inputValue={experience} isReadOnly={!isEditing} onChange={(event) => setExperience(event.target.value)} />

                        <div className="grid grid-cols-2 gap-x-4 items-center w-full">
                            <p className="text-1.7xl font-semibold text-right"><strong>¿Activo?:</strong></p>
                            <p className="pl-2 w-full">
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
                                    disabled={loggedUser.user.username !== service.user.username}
                                />
                            </p>
                        </div>
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
                                <JobData type={"text"} formName={`nameJob-${job.id}`} labelText={"Nombre:"} inputValue={job.name} isReadOnly={true} />
                                <JobData type={"number"} formName={`estimatedJobPrice-${job.id}`} labelText={"Precio estimado:"} inputValue={job.estimated_price} isReadOnly={true} />
                            </div>
                        </div>
                    ))}

{/* Sección de Valoraciones */}
<h2 className="text-3xl font-bold mb-4">Opiniones de otros usuarios</h2>
{reviews.map((review) => (
    <div key={review.id} className="w-90 border bg-white shadow-md rounded-xl m-8">
        <div className="px-10 py-6">
            <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col">
                    <label className="block text-lg font-medium mb-1">Nombre de usuario:</label>
                    <div className="border p-2 rounded-md mb-4">{review.user.username}</div>
                </div>
                {/* Hecho con IA */}
                <div className="flex flex-col items-end">
                    <label className="block text-lg font-medium mb-1"></label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <span key={value} className={`text-4xl ${review.rating >= value ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                        ))}
                    </div>
                </div>
            </div>
            {/* Hasta aquí */}
            <div className="flex flex-col w-full">
                <label className="block text-lg font-medium mb-1">Descripción:</label>
                <div className="border p-2 rounded-md">{review.description}</div>
            </div>
        </div>
    </div>
))}



                </div>
            </div>
        </form>
    );
}

