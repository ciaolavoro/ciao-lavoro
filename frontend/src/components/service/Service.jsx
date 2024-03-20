import { useLoaderData, Link, useParams } from "react-router-dom";
import { useState } from "react";
import { updateServiceRequest } from "../../api/Service.api";
import { updateJobRequest } from "../../api/Job.api";
import defaultUserImage from "../../assets/service/talonflame.jpg";
import ServiceData from "./ServiceData";
import JobData from "./JobData";
import ServiceButton from "./ServiceButton";
import PencilIcon from "../icons/PencilIcon";
import CheckIcon from "../icons/CheckIcon";
import CrossIcon from "../icons/CrossIcon";
import { useAuthContext } from "../auth/AuthContextProvider";
import PlusIcon from "../icons/PlusIcon";
import { checkIfEmpty, checkCityLength, checkExperienceNegative,errorMessages } from "../../utils/validation";


export default function ServiceDetails() {
    const service = useLoaderData();
    const { loggedUser } = useAuthContext();

    const [isEditing, setIsEditing] = useState(false);
    const [city, setCity] = useState(service.city);
    const [profession, setProfession] = useState(service.profession);
    const [experience, setExperience] = useState(service.experience);
    const [isActive, setIsActive] = useState(service.is_active);
    const [isPromoted, setIsPromoted] = useState(service.is_promoted);
    const [jobs, setJobs] = useState(service.jobs);
    const [editingJobId, setEditingJobId] = useState(false);
    const { serviceId } = useParams();
    const [nameJob, setNameJob] = useState("");
    const [estimated_price, setEstimated_price] = useState("");
    const [job, setJob] = useState("");
    const professions = ["Lavandero", "Celador", "Albañil"];
    const [isRequiredCityError, setIsRequiredCityError] = useState(false);
    const [isRequiredExperienceError, setIsRequiredExperienceError] = useState(false);
    const [isCityError, setIsCityError] = useState(false);
    const [isExperienceError, setIsExperienceError] = useState(false);
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
    const updateJob = async (jobData, token) => {
        try {
            const response = await updateJobRequest(jobData.id, jobData, token);
            if (response.ok) {
                alert('Tarea actualizado correctamente');
                setEditingJobId(false);
                setJobs(service.jobs)
            } else {
                alert('Error al actualizar la tarea. Por favor, intente de nuevo.');
                resetJobData();
            }
        } catch (error) {
            alert('Error al actualizar la tarea. Por favor, intente de nuevo.');
            resetJobData();
        }
    }
    const resetJobData = () => {
        async function fetchJobDetails() {
            try {
                setJobs(service.jobs)
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        }


        fetchJobDetails();
        setNameJob(job.name);
        setEstimated_price(job.estimated_price);

    }
    const handleEditJob = (jobId) => {
        setEditingJobId(jobId);
    };
    const handleCancelJob = () => {
        resetJobData();
        setIsEditing(false);
        setEditingJobId(false);

    };


    const handleJobInputChangeEstimatedPrice = (event, index) => {
        const updatedJobList = [...jobs];
        updatedJobList[index - 1] = {
            ...updatedJobList[index - 1],
            estimated_price: event
        }
        setJobs(updatedJobList)
    };

    const handleJobInputChangeName = (value, index) => {
        const updatedJobList = [...jobs];
        updatedJobList[index - 1] = {
            ...updatedJobList[index - 1],
            name: value
        }
        setJobs(updatedJobList)

    };
    const handleSaveJob = (jobId) => {
        //event.preventDefault();
        setJobs(service.jobs)
        const JobData = {
            id: jobId + 1,
            name: jobs[jobId].name,
            estimated_price: jobs[jobId].estimated_price,
        }

        if (window.confirm('¿Está seguro de guardar los cambios?')) {
            console.log("jobs : " + jobs[jobId])

            console.log(JobData.id)
            console.log(JobData.name)
            console.log(JobData.estimated_price)
            console.log("token : " + loggedUser.token)
            console.log("username : " + loggedUser.user.username)
            console.log("username 2 : " + service.user.username)
            updateJob(JobData, loggedUser.token);
        }
    };

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
        }else if (checkCityLength(city)) {
            resetErrors();
            setIsCityError(true);
            return;
        }
        resetErrors();    
        setIsEditing(true);
        const position = getPosicionProfession(profession);
        const serviceData = {
            id: service.id,
            profession: position+1,
            city: city,
            experience: experience,
            is_active: isActive,
            is_promoted: isPromoted,
            jobs: service.jobs,
            user: service.user,
        }

        if (window.confirm('¿Está seguro de guardar los cambios?')) {
            console.log("profession:" + profession)
            console.log("city:" + city)
            console.log("position:" + position+1)
            console.log("isAct:" +serviceData.is_active)
            console.log("exper:" + serviceData.experience)
            console.log("toke:" + loggedUser.token)
            updateService(service.id, serviceData, loggedUser.token);
        }
    };

    const handleCancel = () => {
        resetServiceData();
        setIsEditing(false);
        resetErrors();
    };

    function getPosicionProfession(profession){
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
                            <label htmlFor="profession" className="text-1.7xl font-semibold text-right">Profesión:   </label>
                            {/* Usar un menú desplegable */}
                            <select
                                id="profession"
                                name="profession"
                                value={profession}
                                disabled={!isEditing} // Deshabilitar si no se está editando
                                onChange={(event) => setProfession(event.target.value)}
                                className="pl-2 border rounded w-full md:w-64"
                            >
                                {/* Mapear las opciones de profesión */}
                                {professions.map((profession, index) => (
                                    <option key={index} value={profession}>{profession}</option>
                                ))}
                            </select>
                        </div>
                        <ServiceData type={"text"} formName={"city"} labelText={"Ciudad:"} inputValue={city}
                            isReadOnly={!isEditing} onChange={(event) => setCity(event.target.value)} isError={isRequiredCityError || isCityError}
                            errorMessage={(isRequiredCityError && errorMessages.required) || (isCityError && errorMessages.cityLength)}/>
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
                                        // Verificar si el usuario logueado es el mismo que el usuario asociado al servicio
                                        if (loggedUser.user.username === service.user.username) {
                                            setIsActive(event.target.checked);
                                        } else {
                                            // Mostrar algún tipo de mensaje de error o no realizar ninguna acción
                                            console.log("No tiene permisos para cambiar el estado del servicio.");
                                        }
                                    }}
                                    disabled={loggedUser.user.username !== service.user.username} // Deshabilitar el botón si el usuario logueado no es el mismo que el usuario asociado al servicio
                                /></p>

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
                                <JobData type={"text"} formName={`nameJob-${job.id}`} labelText={"Nombre:"}
                                    inputValue={job.name} isReadOnly={!setEditingJobId}
                                    onChange={(event) => handleJobInputChangeName(event.target.value, job.id)} />
                                <JobData type={"number"} formName={`estimatedJobPrice-${job.id}`} labelText={"Precio estimado:"}
                                    inputValue={job.estimated_price} isReadOnly={!setEditingJobId}
                                    onChange={(event) => handleJobInputChangeEstimatedPrice(event.target.value, job.id)} />
                            </div>
                            {editingJobId === job.id ? (
                                <div className="flex gap-x-4">
                                    <ServiceButton type={"button"} text={"Guardar cambios"} icon={<CheckIcon />} onClick={() => handleSaveJob(editingJobId - 1)} />
                                    <ServiceButton type={"button"} text={"Cancelar"} icon={<CrossIcon />} onClick={() => handleCancelJob()} />
                                </div>
                            ) : (
                                <ServiceButton type={"button"} text={"Editar Tarea"} icon={<PencilIcon />} onClick={() => handleEditJob(job.id)} />
                            )}
                        </div>
                    ))}
                    <Link to={`/services/${serviceId}/job/create`} className="link-button">
                        <PlusIcon /> Crear tarea
                    </Link>
                </div>
            </div>
        </form>
    );
}