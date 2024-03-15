import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getServiceDetailsById, getUserById, getJobDetails, updateServiceRequest } from "../../api/Service.api";
import defaultServiceImage from "../../assets/service/talonflame.jpg";
import ServiceDetailsData from "./ServiceDetailData";
import JobDetailsData from "./JobDetailData";
import ServiceDetailsButton from "./ServiceDetailButton";
import PencilIcon from "../icons/PencilIcon";
import CheckIcon from "../icons/CheckIcon";
import CrossIcon from "../icons/CrossIcon";
import { useAuthContext } from "../auth/AuthContextProvider";

export default function ServiceDetails() {
    const { serviceId } = useParams();
    const [service, setService] = useState("");
    const [user, setUser] = useState("");
    const [job, setJob] = useState("");
    const [jobList, setJobList] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [city, setCity] = useState("");
    const [profession, setProfession] = useState("");
    const [experience, setExperience] = useState("");
    const [is_active, setIs_active] = useState("");
    const [is_promoted, setIs_promoted] = useState("");
    const { loggedUser } = useAuthContext();

    useEffect(() => {
        async function fetchServiceDetails() {
            try {
                const serviceDetails = await getServiceDetailsById(serviceId);
                setService(serviceDetails);
                const re = /\b(\d+)\b/g;
                const cadena2 = "" + serviceDetails.user + "";
                const valoresNumericos2 = cadena2.match(re);
                const ultimoValor2 = valoresNumericos2[valoresNumericos2.length - 1];
                const res = await getUserById(parseInt(ultimoValor2));
                const data = await res.json();
                setUser(data);
                setFirstName(data.first_name)
                setCity(service.city)
                setExperience(service.experience)
                setProfession(service.profession)
                setIs_active(service.is_active)
                setIs_promoted(service.is_promoted)

                const jobList = await getJobDetails();
                setJobList(jobList);


            } catch (error) {
                console.error("Error fetching service details:", error);
            }
        }

        fetchServiceDetails();
    }, [job.estimated_price, service.city, service.experience, service.is_active, service.is_promoted, service.profession, serviceId, user.firstName]);

    if (!service) {
        return <div>Loading...</div>;
    }
    if (!user) {
        return <div>Loading 2...</div>;
    }

    const resetServiceData = () => {
        async function fetchServiceDetails() {
            try {
                const serviceDetails = await getServiceDetailsById(serviceId);
                setService(serviceDetails);
                const re = /\b(\d+)\b/g;
                const cadena2 = "" + serviceDetails.user + "";
                const valoresNumericos2 = cadena2.match(re);
                const ultimoValor2 = valoresNumericos2[valoresNumericos2.length - 1];
                const res = await getUserById(parseInt(ultimoValor2));
                const data = await res.json();
                setUser(data);
                const jobList = await getJobDetails();
                setJobList(jobList);

            } catch (error) {
                console.error("Error fetching service details:", error);
            }
        }


        fetchServiceDetails();
        setFirstName(user.first_name);
        setCity(service.city);
        setExperience(service.experience);
        setProfession(service.profession);

        
    }
    const updateService = async (serviceId, serviceData, token) => {
        try {
            const response = await updateServiceRequest(serviceId, serviceData, token);
            console.log("response : " + response.ok)
            console.log("token : " + token)
            if (response.ok) {
                alert('Servicio actualizado correctamente');
                setIsEditing(false);

            } else {
                alert('Error al actualizar el servicio. Por favor, intente de nuevo.');
            }
        } catch (error) {
            alert('Error al actualizar el servicio. Por favor, intente de nuevo.');
        }
    }

    
    const handleEdit = (event) => {
        event.preventDefault();
        setIsEditing(true);
        const serviceData = {
            id: serviceId,
            profession: profession,
            city: city,
            experience: experience,
            is_active: is_active,
            is_promoted: is_promoted,
            user: user.id,
        }
        if (window.confirm('¿Está seguro de guardar los cambios?.')) {
            updateService(serviceId, serviceData, loggedUser.token);
        }
    };

    const handleCancel = () => {
        resetServiceData();
        setIsEditing(false);
    };



    return (
        <form className="flex flex-col justify-center items-center gap-y-10 mt-10 mx-10  bg-white border rounded-lg" onSubmit={handleEdit}>
            <div className="w-full m-10 flex justify-between items-start">
                {/* Detalles de servicio */}
                <div className="w-100 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl m-8">

                    <div className="flex flex-col gap-y-6 px-16 py-8 w-65">
                        <h2 className="text-3xl font-bold mb-4">Detalles de servicio:</h2>
                        <img
                            src={service.image ?? defaultServiceImage}
                            alt={`Foto del servicio ${service.name}`}
                            className="mx-auto size-80 object-cover rounded-lg"
                        />
                        {isEditing ? (
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={(event) => setService({ ...service, image: URL.createObjectURL(event.target.files[0]) })}
                                className="block w-60 text-sm file:font-sans"
                            />
                        ) : null}
                    </div>
                    <div className="flex flex-col gap-y-6 px-8 py-3 w-72">
                        <ServiceDetailsData type={"text"} formName={"first_name"}
                            labelText={"Nombre: "} inputValue={firstName}
                            isReadOnly={!isEditing} onChange={(event) => setFirstName(event.target.value)}
                        />
                        <ServiceDetailsData type={"number"} formName={"profession"}
                            labelText={"Profesión: "} inputValue={profession}
                            isReadOnly={!isEditing} onChange={(event) => setProfession(event.target.value)}
                        />
                        <ServiceDetailsData type={"text"} formName={"city"}
                            labelText={"Ciudad: "} inputValue={city}
                            isReadOnly={!isEditing} onChange={(event) => setCity(event.target.value)}
                        />
                        <ServiceDetailsData type={"number"} formName={"experience"}
                            labelText={"Experiencia: "} inputValue={experience}
                            isReadOnly={!isEditing} onChange={(event) => setExperience(event.target.value)}
                        />
                        {isEditing ? (
                            <div className="flex gap-x-4">
                                <ServiceDetailsButton type={"submit"} text={"Guardar cambios"} icon={<CheckIcon />} />
                                <ServiceDetailsButton type={"button"} text={"Cancelar"} icon={<CrossIcon />} onClick={handleCancel} />
                            </div>
                        ) : (
                            <ServiceDetailsButton type={"button"} text={"Editar servicio"} icon={<PencilIcon />} onClick={() => setIsEditing(true)} />

                        )}
                    </div>
                </div>
                {/* Tarjetas de trabajo */}
                <div className="flex flex-col gap-y-6 px-10 py-6">
                    <h2 className="text-3xl font-bold mb-4">Trabajos:</h2>
                    {jobList.map((job, index) => (
                        <div key={index} className="w-90 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl m-8">
                            <div className="flex flex-col gap-y-6 px-10 py-6">
                                <JobDetailsData type={"text"} formName={`nameJob-${index}`}
                                    labelText={"Nombre:"} inputValue={job.name}       
                                />
                                <JobDetailsData type={"number"} formName={`estimated_price-${index}`}
                                    labelText={"Precio estimado:"} inputValue={job.estimated_price}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </form>        
    );
}