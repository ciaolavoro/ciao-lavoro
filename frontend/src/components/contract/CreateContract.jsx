import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { createContractRequest, checkWorkerAssociation } from "../../api/Contract.api"
import { useAuthContext } from "../auth/AuthContextProvider"
import {
   checkIfEmpty,
   checkIfNumGreaterThanMax,
   checkIfPositive,
   isTextNotGreaterThan,
   isValidDateTimeFormat,
   notOnlyNumbers,
   errorMessages,
   checkCostDecimal,
} from "../../utils/validation"
import { toast } from "../ui/use-toast"

export default function CreateContract() {
   const [description, setDescription] = useState("")
   const [initial_date, setInitial_date] = useState("")
   const [end_date, setEnd_date] = useState("")
   const [cost, setCost] = useState("")
   const [charCount, setCharCount] = useState(0)

   const navigate = useNavigate()
   const [searchParams] = useSearchParams()
   const service_Id = searchParams.get("service_id")
   const { loggedUser } = useAuthContext()

   const createContract = async token => {
      try {
         const res = await createContractRequest(description, initial_date, end_date, cost, service_Id, token)
         if (res.status === 200) {
            navigate("/")
         } else {
            alert("Error al crear el contrato. Por favor, inténtelo de nuevo.")
         }
      } catch (error) {
         alert("Error al crear el contrato. Por favor, inténtelo de nuevo.", console.error(error))
      }
   }

   const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(false)
   const [isDescriptionBig, setIsDescriptionBig] = useState(false)
   const [isDescriptionOnlyNumber, setIsDescriptionOnlyNumber] = useState(false)
   const [isStartDateAfterNow, setIsStartDateAfterNow] = useState(false)
   const [isEndDateAfterStartDate, setIsEndDateAfterStartDate] = useState(false)
   const [isTimeLessThanOneHour, setIsTimeLessThanOneHour] = useState(false)
   const [isTimeMoreThanEightHour, setIsTimeMoreThanEightHour] = useState(false)
   const [isStartTimeInSixMonths, setIsStartTimeInSixMonths] = useState(false)
   const [isCostNotPositive, setIsCostNotPositive] = useState(false)
   const [isCosteBig, setIsCosteBig] = useState(false)
   const [isCostNotDecimal, setIsCostNotDecimal] = useState(false)

   const handleSubmit = async event => {
      event.preventDefault()
      const token = loggedUser.token
      const isNotAssociated = await checkWorkerAssociation(service_Id,token) //La funcion a llamar, si esta asociado devuelve false

      if (isNotAssociated) {
         if (checkIfEmpty(description)) {
            setIsDescriptionEmpty(true)
            return
         }
         if (isTextNotGreaterThan(description, 500)) {
            resetErrors()
            setIsDescriptionBig(true)
            return
         }
         const now = new Date()
         const startDate = new Date(initial_date)
         const endDate = new Date(end_date)
         const limitDate = new Date(now)
         limitDate.setMonth(limitDate.getMonth() + 6)

         if (startDate <= now) {
            resetErrors()
            setIsStartDateAfterNow(true)
            return
         }
         if (endDate <= startDate) {
            resetErrors()
            setIsEndDateAfterStartDate(true)
            return
         }
         if (startDate > limitDate) {
            resetErrors()
            setIsStartTimeInSixMonths(true)
            return
         }
         if (checkIfPositive(cost)) {
            resetErrors()
            setIsCostNotPositive(true)
            return
         }
         if (checkIfNumGreaterThanMax(cost, 100000)) {
            resetErrors()
            setIsCosteBig(true)
            return
         }
         if (checkCostDecimal(cost)) {
            resetErrors()
            setIsCostNotDecimal(true)
            return
         }
         if (notOnlyNumbers(description)) {
            resetErrors()
            setIsDescriptionOnlyNumber(true)
            return
         }
         if (!isValidDateTimeFormat(startDate)) {
            toast("La fecha y hora de inicio tiene un formato incorrecto.")
            return
         }
         if (!isValidDateTimeFormat(endDate)) {
            toast("La fecha y hora de fin tiene un formato incorrecto.")
            return
         }
         const startDateMin = startDate.getTime()
         const endDateMin = endDate.getTime()
         const timeDifferenceMin = endDateMin - startDateMin
         const timeDifferenceHours = timeDifferenceMin / (1000 * 60)

         if (timeDifferenceHours <= 60) {
            resetErrors()
            setIsTimeLessThanOneHour(true)
            return
         }
         if (timeDifferenceHours > 8 * 60) {
            resetErrors()
            setIsTimeMoreThanEightHour(true)
            return
         }
         await createContract(token)
      } else {
         toast("No puedes contratar un servicio del que eres trabajador")
      }
   }

   const resetErrors = () => {
      setIsDescriptionEmpty(false)
      setIsDescriptionBig(false)
      setIsDescriptionOnlyNumber(false)
      setIsStartDateAfterNow(false)
      setIsEndDateAfterStartDate(false)
      setIsTimeLessThanOneHour(false)
      setIsTimeMoreThanEightHour(false)
      setIsStartTimeInSixMonths(false)
      setIsCostNotPositive(false)
      setIsCosteBig(false)
      setIsCostNotDecimal(false)
   }

   const handleDescriptionChange = e => {
      const newDescription = e.target.value
      setDescription(newDescription)
      setCharCount(newDescription.length)
   }

   return (
      <form
         className="flex flex-col gap-y-4 mt-10 mx-auto w-11/12 sm:w-3/4 lg:w-1/2 xl:w-1/3 py-10 px-6 bg-white border rounded-lg"
         onSubmit={handleSubmit}>
         <h1 className="text-3xl font-bold text-center mb-4">Creación del Contrato</h1>
         <div className="flex flex-col gap-y-4 w-full px-4">
            <label>Descripción:</label>
            <textarea
               name="description"
               value={description}
               onChange={handleDescriptionChange}
               className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
               rows="3"
               maxLength="500"
               style={{ minHeight: "35px" }}
            />
            <span>{charCount}/500</span>
            {(isDescriptionEmpty || isDescriptionBig || isDescriptionOnlyNumber) && (
               <p className="text-red-500">
                  {(isDescriptionEmpty && errorMessages.required) ||
                     (isDescriptionBig && errorMessages.descriptionBig) ||
                     (isDescriptionOnlyNumber && errorMessages.descriptionNotOnlyNumbers)}
               </p>
            )}
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
               <div className="flex flex-col gap-y-4">
                  <label>Fecha y hora de inicio:</label>
                  <input
                     type="datetime-local"
                     name="initial_date"
                     value={initial_date}
                     onChange={e => setInitial_date(e.target.value)}
                     className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                     min={new Date().toISOString().slice(0, 16)}
                     required
                  />
               </div>
               <div className="flex flex-col gap-y-4">
                  <label>Fecha y hora de finalización:</label>
                  <input
                     type="datetime-local"
                     name="end_date"
                     value={end_date}
                     onChange={e => setEnd_date(e.target.value)}
                     className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                     min={initial_date}
                     required
                  />
               </div>
               
            </div>
            {(isStartDateAfterNow || isEndDateAfterStartDate || isTimeLessThanOneHour || isTimeMoreThanEightHour || isStartTimeInSixMonths) && (
                  <p className="text-red-500">
                     {(isStartDateAfterNow && errorMessages.startDateBeforeNow) ||
                        (isEndDateAfterStartDate && errorMessages.endDateBeforeStartDate) ||
                        (isTimeLessThanOneHour && errorMessages.durationLessThanOneHour) ||
                        (isTimeMoreThanEightHour && errorMessages.durationMoreThanEightHours) ||
                        (isStartTimeInSixMonths && errorMessages.starDateLimit)}
                  </p>
               )}
            <label>Coste del trabajo:</label>
            <input
               type="text"
               name="cost"
               value={cost}
               onChange={e => setCost(e.target.value)}
               className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
               min="0"
               required
            />
            {(isCostNotPositive || isCosteBig || isCostNotDecimal) && (
               <p className="text-red-500">
                  {(isCostNotPositive && errorMessages.costNegative) ||
                     (isCosteBig && errorMessages.costBig) ||
                     (isCostNotDecimal && errorMessages.costDecimal)
                     }
               </p>
            )}
         </div>
         <button type="submit" className="bg-orange-300 hover:bg-orange-400 text-white rounded px-4 py-2 font-semibold">
            Crear Contrato
         </button>
      </form>
   )
}
