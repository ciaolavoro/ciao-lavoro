import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { createJobRequest } from "../../api/Job.api.js"
import { useAuthContext } from "../auth/AuthContextProvider"

export default function CreateService() {
   const [nameJob, setNameJob] = useState("")
   const [estimated_price, setEstimated_price] = useState("")
   const [serviceId, setServiceId] = useState(null)
   const [errorMessage, setErrorMessage] = useState("")
   const { loggedUser } = useAuthContext()
   const navigate = useNavigate()

   useEffect(() => {
      const url = window.location.href
      const parts = url.split("/")
      if (parts.length >= 4) {
         const id = parts[4]
         setServiceId(id)
      }
   }, [serviceId])

   const createJob = async (name, estimated_price, serviceId, token) => {
      try {
         const res = await createJobRequest(name, estimated_price, serviceId, token)
         if (res.status === 200) {
            navigate(`/services/${serviceId}`)
         } else {
            alert("Error al crear trabajo. Por favor, intente de nuevo.")
         }
      } catch (error) {
         alert(`Error al crear trabajo: ${error}`)
      }
   }

   const handleSubmit = event => {
      event.preventDefault()
      if (!nameJob.trim() || !estimated_price) {
         setErrorMessage("Todos los campos son obligatorios y el precio no puede estar en blanco.")
         return
      }
      if (Number(estimated_price) <= 0) {
         setErrorMessage("El precio debe ser positivo.")
         return
      }
      if (Number(estimated_price) >= 100000) {
         setErrorMessage("El precio no debe superar los 100000.")
         return
      }
      if (nameJob.length >= 100) {
         setErrorMessage("El nombre del trabajo no puede tener mas de 100 caracteres.")
         return
      }
      createJob(nameJob, Number(estimated_price), serviceId, loggedUser.token)
      setErrorMessage("")
   }

   return (
      <div className="flex justify-center items-center mt-10">
         <div className="bg-white p-8 border rounded-lg shadow-lg">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
               <h1 className="text-4xl font-bold text-center">Crea un nuevo trabajo</h1>
               <div className="flex flex-col gap-2">
                  <label>Nombre:</label>
                  <input type="text" name="nameJob" value={nameJob} onChange={e => setNameJob(e.target.value)} className="px-2 py-1 border rounded" />
               </div>
               <div className="flex flex-col gap-2">
                  <label>Precio estimado:</label>
                  <input
                     type="number"
                     name="estimated_price"
                     value={estimated_price}
                     onChange={e => setEstimated_price(e.target.value)}
                     className="px-2 py-1 border rounded"
                  />
               </div>
               {errorMessage && <p className="text-red-500">{errorMessage}</p>}
               <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">
                  Crear Trabajo
               </button>
            </form>
         </div>
      </div>
   )
}
