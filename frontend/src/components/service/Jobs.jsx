import { useState } from "react";
import JobData from "./JobData";
import ServiceButton from "./ServiceButton";
import CheckIcon from "../icons/CheckIcon";
import CrossIcon from "../icons/CrossIcon";
import PencilIcon from "../icons/PencilIcon";
import { useAuthContext } from "../auth/AuthContextProvider";
import LinkButtonContract from "./LinkButtonContract";
import LinkButtonJob from "./LinkButtonJob";
import { updateJobRequest } from "../../api/Job.api";

export default function Jobs({ serviceJobs, serviceId }) {
    const { loggedUser } = useAuthContext();

    const [jobs, setJobs] = useState(serviceJobs);
    const [editingJobId, setEditingJobId] = useState(false);

    const updateJob = async (jobData, token) => {
        try {
            const response = await updateJobRequest(jobData.id, jobData, token);
            if (response.ok) {
                alert('Trabajo actualizado correctamente');
                setEditingJobId(false);
                setJobs(serviceJobs);
                window.location.reload();
            } else {
                alert('Error al actualizar el trabajo. Por favor, intente de nuevo.');
                resetJobData();
            }
        } catch (error) {
            alert('Error al actualizar el trabajo. Por favor, intente de nuevo.');
            resetJobData();
        }
    }

    const handleJobInputChangeEstimatedPrice = (event, index) => {
        const updatedJobList = [...jobs];
        updatedJobList[index] = {
            ...updatedJobList[index],
            estimated_price: event
        }
        setJobs(updatedJobList)
    };

    const handleJobInputChangeName = (value, index) => {
        const updatedJobList = [...jobs];
        updatedJobList[index] = {
            ...updatedJobList[index],
            name: value
        }
        setJobs(updatedJobList)
    };

    const resetJobData = () => {
        async function fetchJobDetails() {
            try {
                setJobs(serviceJobs)
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        }
        fetchJobDetails();
    }

    const handleCancelJob = () => {
        resetJobData();
        setEditingJobId(false);
    };

    const handleSaveJob = async (jobId, index) => {
        event.preventDefault();
        setJobs(serviceJobs)
        const JobData = {
            id: index,
            name: jobs[jobId].name,
            estimated_price: jobs[jobId].estimated_price,
        }

        if (window.confirm('¿Está seguro de guardar los cambios?')) {
            updateJob(JobData, loggedUser.token);
        }
    };

    return (
        <div className="flex flex-col gap-y-6 px-10 py-6">
            <h2 className="text-3xl font-bold mb-4">Trabajos:</h2>
            {jobs.map((job, index) => (
                <div key={index} className="w-90 border bg-white shadow-md rounded-xl m-8">
                    <div className="flex flex-col gap-y-6 px-10 py-6">
                        <JobData type={"text"} formName={`nameJob-${index}`} labelText={"Nombre:"}
                            inputValue={job.name} isReadOnly={index !== editingJobId}
                            onChange={(event) => handleJobInputChangeName(event.target.value, index)} />
                        <JobData type={"number"} formName={`estimatedJobPrice-${index}`} labelText={"Precio estimado:"}
                            inputValue={job.estimated_price} isReadOnly={index !== editingJobId}
                            onChange={(event) => handleJobInputChangeEstimatedPrice(event.target.value, index)} />
                    </div>
                    {editingJobId === index ? (
                        <div className="flex gap-x-4">
                            <ServiceButton type={"button"} text={"Guardar cambios"} icon={<CheckIcon />} onClick={() => handleSaveJob(index, job.id)} />
                            <ServiceButton type={"button"} text={"Cancelar"} icon={<CrossIcon />} onClick={() => handleCancelJob()} />
                        </div>
                    ) : (
                        <ServiceButton type={"button"} text={"Editar Trabajo"} icon={<PencilIcon />} onClick={() => setEditingJobId(index)} />
                    )}
                </div>
            ))}

            <div className="flex gap-20 ml-20">
                <LinkButtonContract url="/contracts/create" title="Crear un contrato" />
                <LinkButtonJob url={`/services/${serviceId}/job/create`} title="Crear una trabajo" />
            </div>
        </div>
    )
}