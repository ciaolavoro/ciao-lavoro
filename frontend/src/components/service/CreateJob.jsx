import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { createJobRequest } from "../../api/Job.api.js"
import { useAuthContext } from "../auth/AuthContextProvider"

export default function CreateService() {
   const [nameJob, setNameJob] = useState("")
   const [estimated_price, setEstimated_price] = useState("")
   const [serviceId, setServiceId] = useState(null)
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

   const [isNameEmpty, setNameEmpty] = useState(false)
   const [isPriceEmpty, setPriceEmpty] = useState(false)
   const [isNameOnlyNumber, setIsNameOnlyNumber] = useState(false)
   const [isNotPositive, setIsNotPositive] = useState(false)
   const [isPriceBig, setIsPriceBig] = useState(false)
   const [isNotDecimal, setIsNotDecimal] = useState(false)
   const [isNameLong, setIsNameLong] = useState(false)
   const [isNameShort, setIsNameShort] = useState(false)

   const handleSubmit = event => {
      event.preventDefault()
      if (!nameJob.trim()) {
         setNameEmpty(true)
         return
      } else if (/^\d+$/.test(nameJob)) {
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
      } else if (Number(estimated_price) >= 100000) {
         resetErrors()
         setIsPriceBig(true)
         return
      } else if (!/^\d+(\.\d{1,2})?$/.test(Number(estimated_price))) {
         resetErrors()
         setIsNotDecimal(true)
         return
      } else if (nameJob.length >= 100) {
         resetErrors()
         setIsNameLong(true)
         return
      } else if (nameJob.length < 5) {
         resetErrors()
         setIsNameShort(true)
         return
      }

      resetErrors()
      createJob(nameJob, Number(estimated_price), serviceId, loggedUser.token)
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
      <div className="flex justify-center items-center mt-10">
         <div className="bg-white p-8 border rounded-lg shadow-lg">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
               <h1 className="text-4xl font-bold text-center">Crea un nuevo trabajo</h1>
               <div className="flex flex-col gap-2">
                  <label>Nombre:</label>
                  <input type="text" name="nameJob" value={nameJob} onChange={e => setNameJob(e.target.value)} className="px-2 py-1 border rounded" />
               </div>
               {(isNameEmpty || isNameOnlyNumber || isNameLong || isNameShort) && (
                  <p className="text-red-500">
                     {(isNameEmpty && "El nombre del trabajo no puede estar vacío.") ||
                        (isNameOnlyNumber && "El nombre del trabajo no puede ser un número.") ||
                        (isNameLong && "Debe ser menos de 100 caracteres.") ||
                        (isNameShort && "Debe ser más de 5 caracteres.")}
                  </p>
               )}
               <div className="flex flex-col gap-2">
                  <label>Precio estimado:</label>
                  <input
                     type="text"
                     name="estimated_price"
                     value={estimated_price}
                     onChange={e => setEstimated_price(e.target.value)}
                     className="px-2 py-1 border rounded"
                  />
                  <p className="text-gray-500 text-sm">El precio se tiene que escribir con .</p>
                  <p className="text-gray-500 text-sm">Por ejemplo: 2.7</p>
               </div>
               {(isPriceEmpty || isNotPositive || isPriceBig || isNotDecimal) && (
                  <p className="text-red-500" >
                     {(isPriceEmpty && "El precio del trabajo no puede estar vacío.") ||
                        (isNotPositive && "El precio del trabajo debe ser mayor a 0") ||
                        (isPriceBig && "No puede ser mayor o igual a 100000.") ||
                        (isNotDecimal && <span>
                           El precio del trabajo no es valido. <br />
                           Debe ser un número entero o con decimales. <br />
                           Por ejemplo: 2, 2.7 o 2.75
                         </span>)}
                  </p>
               )}
               <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">
                  Crear Trabajo
               </button>
            </form>
         </div>
      </div>
   )
}
