import { useState, useEffect  } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../auth/AuthContextProvider"
import { createServiceRequest, getServiceByUser, getProfessionsList  } from "../../api/Service.api"
import {
   checkProfessionDuplicated,
   checkIfEmpty,
   checkCityLength,
   checkExperienceNegative,
   errorMessages,
   checkOnlyCharactersInText,
   checkExperienceYears,
} from "../../utils/validation"

export default function CreateService() {
   const { loggedUser } = useAuthContext()
   const [professions, setProfessions] = useState([])
   const navigate = useNavigate()

   const [email] = useState(loggedUser.user.email)
   const [profession, setProfession] = useState("1")
   const [city, setCity] = useState("")
   const [experience, setExperience] = useState("")
   const [isRequiredCityError, setIsRequiredCityError] = useState(false)
   const [isRequiredExperienceError, setIsRequiredExperienceError] = useState(false)
   const [isCityError, setIsCityError] = useState(false)
   const [isProfessionDuplicated, setProfessionDuplicated] = useState(false)
   const [isExperienceError, setIsExperienceError] = useState(false)
   const [isOnlyCharacters, setIsOnlyCharacters] = useState(false)
   const [isBigExperienceError, setIsBigExperienceError] = useState(false)

   useEffect(() => {
      const fetchProfessions = async () => {
         try {
            const response = await getProfessionsList(loggedUser.token);
            const data = await response.json();
            setProfessions(data.professions);
         } catch (error) {
            console.error("Failed to fetch professions", error);
         }
      }

      if (loggedUser && loggedUser.token) {
         fetchProfessions();
      }
   }, [loggedUser, loggedUser.token])

   const createService = async (email, professionNumber, city, experience) => {
      try {
         const listprofession = await getProfessionsByUser(loggedUser.user.id)
         if (checkIfEmpty(city)) {
            setIsRequiredCityError(true)
            return
         } else if (checkOnlyCharactersInText(city)) {
            resetErrors()
            setIsOnlyCharacters(true)
            return
         } else if (checkCityLength(city)) {
            resetErrors()
            setIsCityError(true)
            return
         } else if (checkIfEmpty(experience.toString())) {
            resetErrors()
            setIsRequiredExperienceError(true)
            return
         } else if (checkExperienceNegative(experience)) {
            resetErrors()
            setIsExperienceError(true)
            return
         } else if (checkExperienceYears(experience, loggedUser.user.birth_date)) {
            resetErrors()
            setIsBigExperienceError(true)
            return
         } else if (checkProfessionDuplicated(professions[professionNumber - 1], listprofession)) {
            resetErrors()
            setProfessionDuplicated(true)
            return
         }
         resetErrors()

         const res = await createServiceRequest(email, professionNumber, city, experience, loggedUser.token)
         if (res.status === 200) {
            alert("El servicio se ha creado correctamente")
            navigate("/")
         } else {
            alert("Error al crear servicio. Por favor, intente de nuevo.")
         }
      } catch (error) {
         alert("Ya tienes un servicio con la misma profesión. Por favor, intente de nuevo.")
         // alert(`Error al crear servicio: ${error}`)
      }
   }

   const getProfessionsByUser = async userId => {
      try {
         const serviceResponse = await getServiceByUser(userId)
         const services = await serviceResponse.json()
         const professionTypes = services.map(service => service.profession)
         const uniqueProfessions = [...new Set(professionTypes)]
         return uniqueProfessions
      } catch (error) {
         alert("Error fetching professions:", error)
         return []
      }
   }

   const resetErrors = () => {
      setIsRequiredCityError(false)
      setIsRequiredExperienceError(false)
      setIsCityError(false)
      setIsExperienceError(false)
      setProfessionDuplicated(false)
      setIsOnlyCharacters(false)
   }

   const handleSubmit = event => {
      event.preventDefault()
      createService(email, Number(profession), city, Number(experience))
   }

   return (
      <form className="flex flex-col justify-center items-center gap-y-10 mt-10 mx-44 py-14 bg-white border rounded-lg" onSubmit={handleSubmit}>
         <h1 className="text-4xl font-bold">Creación del servicio</h1>
         <div className="flex flex-col items-center gap-2">
            <div className="flex gap-x-2">
               <label>Profesión:</label>
               <select
                  name="profession"
                  onChange={e => {
                     setProfession(e.target.value)
                  }}
                  className="px-2 py-1 border rounded">
                  {professions.map((prof, index) => (
                            <option key={index} value={prof.id}>{prof.name}</option>
                        ))}
               </select>
            </div>
            {isProfessionDuplicated && <p className="text-red-500">{errorMessages.professionDuplicate}</p>}
         </div>
         <div className="flex flex-col items-center gap-2">
            <div className="flex gap-x-2">
               <label>Ciudad:</label>
               <input type="text" name="city" value={city} onChange={e => setCity(e.target.value)} className="px-2 py-1 border rounded" />
            </div>
            {(isRequiredCityError || isCityError || isOnlyCharacters) && (
               <p className="text-red-500">
                  {(isRequiredCityError && errorMessages.required) ||
                     (isCityError && errorMessages.cityLength) ||
                     (isOnlyCharacters && errorMessages.onlyCharacters)}
               </p>
            )}
         </div>

         <div className="flex flex-col items-center gap-2">
            <div className="flex gap-x-2">
               <label>Experiencia:</label>
               <input
                  type="number"
                  name="experience"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className="px-2 py-1 border rounded"
               />
            </div>
            {(isRequiredExperienceError || isExperienceError || isBigExperienceError) && (
               <p className="text-red-500">
                  {(isRequiredExperienceError && errorMessages.required) ||
                     (isExperienceError && errorMessages.experienceNotValid) ||
                     (isBigExperienceError && errorMessages.tooMuchExperience)}
               </p>
            )}
         </div>
         <button type="submit" className="bg-orange-300 rounded px-3 py-1 font-semibold">
            Crear Servicio
         </button>
      </form>
   )
}
