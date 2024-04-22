import { Link } from "react-router-dom"
import MegaphoneIcon from "../icons/MegaphoneIcon"
import { BACKEND_URL } from "@/utils/backendApi"
import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const DEFAULT_USER_IMG =
   "https://images.unsplash.com/photo-1646753522408-077ef9839300?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NjZ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"

export default function ServiceCard({ service }) {
   const serviceUserImage = service.user.image.startsWith(`${BACKEND_URL}`) ? `${service.user.image}` : `${BACKEND_URL}${service.user.image}`
   const [isPromoted, setIsPromoted] = useState(false)

   //Hecho con Copilot
   const hasPassedAMonth = promotionDate => {
      const currentDate = new Date()
      const promotionDateObj = new Date(promotionDate)
      const oneMonth = 1000 * 60 * 60 * 24 * 30
      return currentDate - promotionDateObj > oneMonth
   }

   useEffect(() => {
      if (service.is_promoted) {
         const hasPassed = hasPassedAMonth(service.is_promoted)
         setIsPromoted(!hasPassed)
      } else {
         setIsPromoted(false)
      }
   }, [service.is_promoted])

   return (
      <div className="relative w-80 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
         <Link to={`/services/${service.id}`}>
            <img src={`${serviceUserImage}` ?? DEFAULT_USER_IMG} className="h-80 w-80 object-cover rounded-t-xl" />
            <div className="px-4 py-3 w-72">
               <h2 className="text-2xl font-semibold">
                  <strong></strong> {service.user.first_name} {service.user.last_name}
               </h2>
               <span className="text-gray-400 mr-3 uppercase text-s">@{service.user.username}</span>
               <br />
               <span className="text-gray-500 mr-3 uppercase text-m font-semibold">{service.profession}</span>

               <p className="mb-2 mt-4">
                  <strong>Ciudad:</strong> {service.city}
               </p>
               <p className="mb-2">
                  <strong>Experiencia:</strong> {service.experience} {service.experience > 1 ? "años" : "año"}
               </p>
               <p className="mb-2">
                  <strong>Idioma:</strong> {service.user && service.user.language ? service.user.language : "Sin idioma"}
               </p>
               {isPromoted && (
                  <div className="absolute top-0 right-0 mt-1 mr-1 p-2 border-2 border-gray-300 rounded-lg bg-white">
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger>
                              <MegaphoneIcon />
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Servicio promocionado</p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  </div>
               )}
            </div>
         </Link>
      </div>
   )
}
