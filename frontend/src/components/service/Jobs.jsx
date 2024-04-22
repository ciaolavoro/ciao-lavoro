import { useState } from "react"
import JobData from "./JobData"
import ServiceButton from "./ServiceButton"
import CheckIcon from "../icons/CheckIcon"
import CrossIcon from "../icons/CrossIcon"
import PencilIcon from "../icons/PencilIcon"
import { useAuthContext } from "../auth/AuthContextProvider"
import LinkButtonJob from "./LinkButtonJob"
import { updateJobRequest } from "../../api/Job.api"
import { useLoaderData } from "react-router-dom"

export default function Jobs() {
   const { loggedUser } = useAuthContext()
   const service = useLoaderData()

   const [jobs, setJobs] = useState(service.jobs)
   const [editingJobId, setEditingJobId] = useState(false)
   const [editJob, setEditJob] = useState(false)

   const updateJob = async (jobData, token) => {
      try {
         const response = await updateJobRequest(jobData.id, jobData, token)
         if (response.ok) {
            alert("Trabajo actualizado correctamente")
            setEditingJobId(false)
            setJobs(service.jobs)
            window.location.reload()
         } else {
            alert("Error al actualizar el trabajo. Por favor, intente de nuevo.")
            resetJobData()
         }
      } catch (error) {
         alert("Error al actualizar el trabajo. Por favor, intente de nuevo.")
         resetJobData()
      }
   }

   const handleJobInputChangeEstimatedPrice = (event, index) => {
      const updatedJobList = [...jobs]
      updatedJobList[index] = {
         ...updatedJobList[index],
         estimated_price: event,
      }
      setJobs(updatedJobList)
   }

   const handleJobInputChangeName = (value, index) => {
      const updatedJobList = [...jobs]
      updatedJobList[index] = {
         ...updatedJobList[index],
         name: value,
      }
      setJobs(updatedJobList)
   }

   const resetJobData = () => {
      async function fetchJobDetails() {
         try {
            setJobs(service.jobs)
         } catch (error) {
            console.error("Error fetching job details:", error)
         }
      }
      fetchJobDetails()
   }

   const handleCancelJob = () => {
      resetJobData()
      setEditingJobId(false)
   }

   const [isNameEmpty, setNameEmpty] = useState(false)
   const [isPriceEmpty, setPriceEmpty] = useState(false)
   const [isNameOnlyNumber, setIsNameOnlyNumber] = useState(false)
   const [isNotPositive, setIsNotPositive] = useState(false)
   const [isPriceBig, setIsPriceBig] = useState(false)
   const [isNotDecimal, setIsNotDecimal] = useState(false)
   const [isNameLong, setIsNameLong] = useState(false)
   const [isNameShort, setIsNameShort] = useState(false)

   const handleSaveJob = async (jobId, index) => {
      event.preventDefault()
      setJobs(service.jobs)
      const { name, estimated_price } = jobs[jobId]
      if (!name.trim()) {
         setNameEmpty(true)
         return
      } else if (/^\d+$/.test(name)) {
         resetErrors()
         setIsNameOnlyNumber(true)
         return
      } else if (!estimated_price) {
         resetErrors()
         setPriceEmpty(true)
         return
      } else if (Number(estimated_price) <= 0) {
         resetErrors()
         setIsNotPositive(true)
         return
      } else if (!/^\d+(\.\d{1,2})?$/.test(Number(estimated_price))) {
         resetErrors()
         setIsNotDecimal(true)
         return
      } else if (Number(estimated_price) >= 100000) {
         resetErrors()
         setIsPriceBig(true)
         return
      } else if (name.length >= 100) {
         resetErrors()
         setIsNameLong(true)
         return
      } else if (name.length < 5) {
         resetErrors()
         setIsNameShort(true)
         return
      }

      resetErrors()
      
      const JobData = {
         id: index,
         name,
         estimated_price: Number(estimated_price),
      }

      if (window.confirm("¿Está seguro de guardar los cambios?")) {
         updateJob(JobData, loggedUser.token)
         setEditJob(false)
      }
   }
   const resetErrors = () => {
      setNameEmpty(false)
      setPriceEmpty(false)
      setIsNameOnlyNumber(false)
      setIsNotPositive(false)
      setIsPriceBig(false)
      setIsNotDecimal(false)
      setIsNameLong(false)
      setIsNameShort(false)
   }

   return (
      <div className="flex flex-col gap-y-6 px-10 py-6">
         <div className="flex flex-col lg:flex-row md:flex-row gap-5">
            <h2 className="text-3xl font-bold">Trabajos:</h2>
            {loggedUser && loggedUser.user.username === service.user.username && (
               <LinkButtonJob url={`/services/${service.id}/job/create`} title="Crear un trabajo" />
            )}
         </div>
         {jobs.map((job, index) => (
            <div key={index} className="w-full md:w-90 border bg-white shadow-md rounded-xl m-8 pb-4">
               <div className="flex flex-col gap-y-6 px-10 py-6">
                  <JobData
                     labelText={"Nombre:"}
                     inputValue={job.name}
                     isReadOnly={index !== editingJobId}
                     onChange={event => handleJobInputChangeName(event.target.value, index)}
                     renderAsText={!editJob}
                  />
                  {(isNameEmpty || isNameOnlyNumber || isNameLong || isNameShort) && (
                     <p className="text-red-500">
                        {(isNameEmpty && "El nombre del trabajo no puede estar vacío.") ||
                           (isNameOnlyNumber && "El nombre del trabajo no puede ser un número.") ||
                           (isNameLong && "El nombre del trabajo no puede tener mas de 100 caracteres.") ||
                           (isNameShort && "El nombre del trabajo debe tener al menos 5 caracteres.")}
                     </p>
                  )}
                  <JobData
                     labelText={"Precio estimado:"}
                     inputValue={job.estimated_price}
                     isReadOnly={index !== editingJobId}
                     onChange={event => handleJobInputChangeEstimatedPrice(event.target.value, index)}
                     renderAsText={!editJob}
                  />
                  {(isPriceEmpty || isNotPositive || isPriceBig || isNotDecimal) && (
                     <p className="text-red-500">
                        {(isPriceEmpty && "El precio del trabajo no puede estar vacío.") ||
                           (isNotPositive && "El precio del trabajo debe ser positivo (el cero no cuenta).") ||
                           (isPriceBig && "El precio del trabajo no puede ser mayor o igual a 100000.") ||
                           (isNotDecimal &&
                              "El precio del trabajo no es valido. Debe ser un número entero o con decimales. Por ejemplo: 2, 2.7 o 2.75")}
                     </p>
                  )}
               </div>
               {editingJobId === index ? (
                  <div className="flex justify-center gap-x-4">
                     <ServiceButton
                        type={"button"}
                        text={"Guardar cambios"}
                        icon={<CheckIcon />}
                        onClick={() => {
                           handleSaveJob(index, job.id)
                        }}
                     />
                     <ServiceButton
                        type={"button"}
                        text={"Cancelar"}
                        icon={<CrossIcon />}
                        onClick={() => {
                           handleCancelJob()
                           setEditJob(false)
                        }}
                     />
                  </div>
               ) : (
                  loggedUser &&
                  loggedUser.user.username === service.user.username && (
                     <ServiceButton
                        type={"button"}
                        text={"Editar Trabajo"}
                        icon={<PencilIcon />}
                        onClick={() => {
                           setEditingJobId(index)
                           setEditJob(true)
                        }}
                     />
                  )
               )}
            </div>
         ))}
      </div>
   )
}
