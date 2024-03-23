import { Link, NavLink, useNavigate } from "react-router-dom"
import ciaoLavoroLogo from "/ciaolavoro-logo.png"
import { useAuthContext } from "./auth/AuthContextProvider"
import defaultUserImage from "../assets/service/talonflame.jpg"
import { BACKEND_URL } from "../utils/backendApi"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import UserProfileIcon from "./icons/UserProfileIcon"
import BriefcaseIcon from "./icons/BriefcaseIcon"
import DocumentIcon from "./icons/DocumentIcon"
import LogoutIcon from "./icons/LogoutIcon"
import { useState } from "react"

const navItemsStyle = "px-2 py-1 font-semibold rounded hover:bg-gray-300 transition"

export default function Navbar() {
   const { logout, loggedUser } = useAuthContext()
   const navigate = useNavigate()
   const [isMenuOpen, setIsMenuOpen] = useState(false)

   const navItems = [
      {
         id: 1,
         title: "Buscar Servicios",
         out: false,
         path: "/services",
      },
      {
         id: 2,
         title: "Sobre nosotros",
         out: true,
         path: "https://ciaolavoro.github.io/landingpage",
      },
   ]

   const navItemsUser = [
      {
         id: 1,
         title: "Mi perfil",
         icon: <UserProfileIcon />,
         path: `/users/${loggedUser?.user?.id}`,
      },
      {
         id: 2,
         title: "Mis Servicios",
         icon: <BriefcaseIcon/>,
         path: "/services/user",
      },
      {
         id: 3,
         title: "Mis Contratos",
         icon: <DocumentIcon />,
         path: "/contracts/myList",
      },
   ]

   const handleLogout = () => {
      if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
         logout()
         navigate("/")
      }
   }

   const renderLoginOrLogout = () => {
      if (loggedUser) {
         return (
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <li className="rounded-full hover:shadow-lg transition">
                     <img
                        src={`${BACKEND_URL}${loggedUser.user.image}` || defaultUserImage}
                        alt="Imagen de perfil"
                        className="w-8 h-8 object-cover rounded-full"
                     />
                  </li>
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                  {navItemsUser.map(item => (
                     <Link key={item.id} to={item.path}>
                        <DropdownMenuItem>
                           {item.icon}
                           <span className="ml-1">{item.title}</span>
                        </DropdownMenuItem>
                     </Link>
                  ))}
                  <DropdownMenuItem onClick={handleLogout}>
                     <LogoutIcon />
                     <span className="ml-1">Cerrar sesión</span>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         )
      } else {
         return (
            <NavLink to="/login" className={({ isActive }) => (isActive ? "bg-gray-300 rounded" : "")}>
               <li className={navItemsStyle}>Iniciar sesión</li>
            </NavLink>
         )
      }
   }

   return (
      <header>
         <nav className="flex justify-between items-center sticky w-full h-16 px-6 bg-white border border-gray-300 z-10">
            <section>
               <NavLink to="/">
                  <img src={ciaoLavoroLogo} alt="Logo de CiaoLavoro" className="w-8 object-cover rounded" />
               </NavLink>
            </section>
            <section className="hidden md:flex"> {/* Ocultar en pantallas pequeñas */}
               <ul className="flex gap-5 py-2">
                  {navItems.map((item) => (
                     <NavLink key={item.id} to={item.path} className={({ isActive }) => isActive ? "bg-gray-300 rounded" : ""}>
                        <li className={navItemsStyle}>{item.title}</li>
                     </NavLink>
                  ))}
                  {renderLoginOrLogout()}
               </ul>
            </section>

            <section className="md:hidden"> {/* Mostrar solo en pantallas pequeñas */}
               <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-300 hover:text-gray-700 hover:border-gray-700 focus:outline-none focus:text-gray-700 focus:border-gray-700">
                  <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
               </button>
               {isMenuOpen && (
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white border rounded shadow-xl">
                     <ul>
                        {navItems.map((item) => (
                           <NavLink key={item.id} to={item.path} className={({ isActive }) => isActive ? "bg-gray-300 rounded" : ""}>
                              <li className={navItemsStyle}>{item.title}</li>
                           </NavLink>
                        ))}
                        {renderLoginOrLogout()}
                     </ul>
                  </div>
               )}
            </section>


         </nav>
      </header>
   )
}
