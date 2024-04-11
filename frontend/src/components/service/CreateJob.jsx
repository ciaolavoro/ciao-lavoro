import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { createJobRequest } from "../../api/Job.api.js"
import { useAuthContext } from "../auth/AuthContextProvider"

export default function CreateService() {
   const [nameJob, setNameJob] = useState("")
   const [estimated_price, setEstimated_price] = useState("")
   const [serviceId, setServiceId] = useState(null)
   const [errorNameMessage, setErrorNameMessage] = useState("")
   const [errorPriceMessage, setErrorPriceMessage] = useState("")
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
      if (!nameJob.trim()) {
         setErrorNameMessage("El nombre es obligatorio.")
         return
      }
      if (/^\d+$/.test(nameJob)) {
         setErrorNameMessage("El nombre del trabajo no puede tener solo numeros.")
         return
      }
      if (!estimated_price) {
         setErrorPriceMessage("El precio es obligatorio.")
         return
      }
      if (Number(estimated_price) <= 0) {
         setErrorPriceMessage("El precio debe ser positivo.")
         return
      }
      if (Number(estimated_price) >= 100000) {
         setErrorPriceMessage("El precio debe ser menor que 100000.")
         return
      }
      if (nameJob.length >= 100) {
         setErrorNameMessage("El nombre del trabajo no puede tener mas de 100 caracteres.")
         return
      }
      if(Number.isInteger(Number(estimated_price))){
         setErrorPriceMessage("El precio debe ser un numero con decimales.")
         return
      }
      createJob(nameJob, Number(estimated_price), serviceId, loggedUser.token)
      setErrorNameMessage("")
      setErrorPriceMessage("")
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
               {errorNameMessage && <p className="text-red-500">{errorNameMessage}</p>}
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
               {errorPriceMessage && <p className="text-red-500">{errorPriceMessage}</p>}
               <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">
                  Crear Trabajo
               </button>
            </form>
         </div>
      </div>
   )
}
