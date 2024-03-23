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

const navItemsStyle = "px-2 py-1 font-semibold rounded hover:bg-gray-300 transition"

export default function Navbar() {
   const { logout, loggedUser } = useAuthContext()
   const navigate = useNavigate()

   const navItems = [
      {
         id: 1,
         title: "Inicio",
         out: false,
         path: "/",
      },
      {
         id: 2,
         title: "Buscar Servicios",
         out: false,
         path: "/services",
      },
      {
         id: 3,
         title: "Sobre nosotros",
         out: true,
         path: "https://ciaolavoro.github.io/landingpage",
      },
   ]

   const navItemsUser = [
      {
         id: 1,
         title: "Mi perfil",
         icon: <UserProfileIcon size={4} />,
         path: `/users/${loggedUser?.user?.id}`,
      },
      {
         id: 2,
         title: "Mis Servicios",
         icon: <BriefcaseIcon size={4} />,
         path: "/services/user",
      },
      {
         id: 3,
         title: "Mis Contratos",
         icon: <DocumentIcon size={4} />,
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
                     <LogoutIcon size={4} />
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
            <section>
               <ul className="flex gap-5 px-4 py-2">
                  {navItems.map(item => (
                     <NavLink
                        key={item.id}
                        to={item.path}
                        target={item.out && "_blank"}
                        className={({ isActive }) => (isActive ? "bg-gray-300 rounded" : "")}>
                        <li className={navItemsStyle}>{item.title}</li>
                     </NavLink>
                  ))}
                  {renderLoginOrLogout()}
               </ul>
            </section>
         </nav>
      </header>
   )
}
