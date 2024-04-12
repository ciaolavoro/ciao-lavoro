import useGet from "@/hooks/useGet"
import { BACKEND_URL } from "@/utils/backendApi"
import { useState } from "react"
import SearchIcon from "../icons/SearchIcon"
import { useSearchParams, useNavigate } from "react-router-dom"

export default function SearchServices() {
   const navigate = useNavigate()
   const [city, setCity] = useState("")
   const [username, setUsername] = useState("")
   const [profession, setProfession] = useState("")
   const [, setSearchParams] = useSearchParams()
   const { data: professions, loading: loadingProfessions } = useGet(`${BACKEND_URL}/service/allProfessionsList/`)

   const handleSearch = e => {
      e.preventDefault()
      setSearchParams({ city, username, profession }, false)
      const cityParam = encodeURIComponent(city)
      const usernameParam = encodeURIComponent(username)
      const professionParam = encodeURIComponent(profession)
      navigate(`/services?city=${cityParam}&username=${usernameParam}&profession=${professionParam}`)
   }

   return (
      <div className="flex justify-center">
         <form onSubmit={handleSearch} className="flex border rounded">
            <input
               type="text"
               placeholder="Ciudad"
               value={city}
               onChange={e => setCity(e.target.value)}
               className="font-semibold w-64 pl-2 p-1 border-r-2 rounded-l outline-none"
            />
            <input
               type="text"
               placeholder="Nombre de usuario"
               value={username}
               onChange={e => setUsername(e.target.value)}
               className="hidden lg:block font-semibold w-64 pl-2 border-r-2 outline-none"
            />
            <select
               name="professions"
               value={profession}
               onChange={e => setProfession(e.target.value)}
               className="hidden md:block font-semibold w-64 pl-2 bg-orange-200">
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
            <button className="flex justify-center w-12 p-1 rounded-r bg-orange-300">
               <SearchIcon />
            </button>
         </form>
      </div>
   )
}
