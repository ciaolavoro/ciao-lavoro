import { useEffect, useState } from "react"
import ServiceCard from "./ServiceCard"
import { getServiceByCityAndProfession } from "../../api/Service.api"
import useGet from "@/hooks/useGet"
import { BACKEND_URL } from "@/utils/backendApi"
import { useSearchParams } from "react-router-dom"
import ServiceCardSkeleton from "./ServiceCardSkeleton"

export default function Services() {
   const [searchParams, setSearchParams] = useSearchParams()
   const [city, setCity] = useState(decodeURIComponent(searchParams.get("city") || ""))
   const [username, setUsername] = useState(decodeURIComponent(searchParams.get("username") || ""))
   const [profession, setProfession] = useState(decodeURIComponent(searchParams.get("profession") || ""))
   const [services, setServices] = useState([])
   const [loadingServices, setLoadingServices] = useState(true)
   const { data: professions, loading: loadingProfessions } = useGet(`${BACKEND_URL}/service/allProfessionsList/`)

   useEffect(() => {
      const getServices = async () => {
         setLoadingServices(true)
         try {
            const res = await getServiceByCityAndProfession(city, profession, username)
            if (res.status === 200) {
               const data = await res.json()
               setServices(data)
               setSearchParams({ city, username, profession })
            } else {
               alert("Error al cargar los servicios")
            }
            setLoadingServices(false)
         } catch (error) {
            setLoadingServices(false)
            alert("Error al cargar los servicios")
         }
      }

      let timeoutId = null
      const handleTyping = () => {
         if (timeoutId) {
            clearTimeout(timeoutId)
         }
         timeoutId = setTimeout(() => {
            getServices()
         }, 1000)
      }

      handleTyping()

      return () => clearTimeout(timeoutId)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [city, profession, username])

   return (
      <div>
         <section>
            <h1 className="text-4xl font-semibold text-center my-10">Encuentra el servicio que necesitas</h1>
         </section>
         <section className="px-5 lg:px-80 md:px-30 sm:px-20 py-6 ">
            <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row justify-center gap-2 my-4">
               <input
                  type="text"
                  placeholder="Ciudad"
                  className="border rounded px-2 py-1 font-semibold"
                  value={city}
                  onChange={e => setCity(e.target.value)}
               />
               <input
                  type="text"
                  placeholder="Nombre de Usuario"
                  className="border rounded px-2 py-1 font-semibold"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
               />

               <select
                  name="status"
                  value={profession}
                  onChange={e => setProfession(e.target.value)}
                  className="px-2 py-1 border rounded bg-orange-200 font-semibold">
                  <option value=""> Profesion </option>
                  {loadingProfessions ? (
                     <option>Cargando profesiones...</option>
                  ) : (
                     professions.professions.map((prof, index) => (
                        <option key={index} value={prof.id}>
                           {prof.name}
                        </option>
                     ))
                  )}
               </select>
            </form>
         </section>

         <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
            {loadingServices
               ? [...Array(3)].map((_, index) => <ServiceCardSkeleton key={index} />)
               : services.filter(service => service.is_active).map(service => <ServiceCard key={service.id} service={service} />)}
         </section>
      </div>
   )
}
