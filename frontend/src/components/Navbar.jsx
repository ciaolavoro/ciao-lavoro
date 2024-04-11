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
import { getUserPoints } from "../api/user.api"
import { useState } from "react"
import SearchIcon from "./icons/SearchIcon"
import InfoIcon from "./icons/InfoIcon"
import LoginIcon from "./icons/LoginIcon"
import MenuIcon from "./icons/MenuIcon"
import CustomAlertDialog from "./CustomAlertDialog"

const navItemsStyle = "px-2 py-1 font-semibold rounded hover:bg-gray-300 transition"

export default function Navbar() {
   const { logout, loggedUser } = useAuthContext()
   const navigate = useNavigate()
   const [userPoints, setUserPoints] = useState(null)
   const [openLogoutDialog, setOpenLogoutDialog] = useState(false)

   const userPointsOnNavbar = async () => {
      try {
         const points = await getUserPoints(loggedUser.token)
         setUserPoints(points)
      } catch (error) {
         console.error("Error al mostrar los puntos: ", error)
      }
   }

   if (loggedUser && !userPoints) {
      userPointsOnNavbar()
   }

   const navItems = [
      {
         id: 1,
         title: "Buscar Servicios",
         out: false,
         icon: <SearchIcon />,
         path: "/services",
      },
      {
         id: 2,
         title: "Sobre nosotros",
         out: true,
         icon: <InfoIcon />,
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
         icon: <BriefcaseIcon />,
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
      logout()
      navigate("/")
   }

   return (
      <header>
         <nav className="flex justify-between items-center sticky w-full h-16 px-6 bg-white border border-gray-300 z-10">
            <section>
               <NavLink to="/">
                  <img src={ciaoLavoroLogo} alt="Logo de CiaoLavoro" className="w-8 object-cover rounded" />
               </NavLink>
            </section>

            <section className="hidden md:flex">
               {" "}
               <ul className="flex gap-5 px-4 py-2">
                  {navItems.map(item => (
                     <NavLink
                        key={item.id}
                        to={item.path}
                        target={item.out ? "_blank" : ""}
                        className={({ isActive }) => (isActive ? "bg-gray-300 rounded" : "")}>
                        <li className={navItemsStyle}>{item.title}</li>
                     </NavLink>
                  ))}
                  {loggedUser && (
                     <li className="flex items-center">
                        <span className="mr-1">Puntos: {userPoints}</span>
                     </li>
                  )}
                  <NavbarMenu navItemsUser={navItemsUser} handleLogout={() => setOpenLogoutDialog(true)} />
               </ul>
            </section>

            <section className="md:hidden">
               <ul>
                  <ResponsiveNavbarMenu navItemsUser={navItemsUser} navItems={navItems} handleLogout={() => setOpenLogoutDialog(true)} />
               </ul>
            </section>
         </nav>
         <CustomAlertDialog
            open={openLogoutDialog}
            setOpen={setOpenLogoutDialog}
            title={"¿Estás seguro de que deseas cerrar sesión?"}
            handleAction={handleLogout}>
            <p>Si decide continuar, se procedera al cierre de sesion en CiaoLavoro.</p>
         </CustomAlertDialog>
      </header>
   )
}

function ResponsiveNavbarMenu({ navItemsUser, navItems, handleLogout }) {
   const { loggedUser } = useAuthContext()

   return (
      <>
         {loggedUser ? (
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
                  {navItems.map(item => (
                     <Link key={item.id} to={item.path} target={item.out ? "_blank" : ""}>
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
         ) : (
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <li className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-300 hover:text-gray-700 hover:border-gray-700 focus:outline-none focus:text-gray-700 focus:border-gray-700">
                     <MenuIcon />
                  </li>
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                  <Link to="/login">
                     <DropdownMenuItem>
                        <LoginIcon />
                        <span className="ml-1">Iniciar Sesión</span>
                     </DropdownMenuItem>
                  </Link>
                  {navItems.map(item => (
                     <Link key={item.id} to={item.path} target={item.out ? "_blank" : ""}>
                        <DropdownMenuItem>
                           {item.icon}
                           <span className="ml-1">{item.title}</span>
                        </DropdownMenuItem>
                     </Link>
                  ))}
               </DropdownMenuContent>
            </DropdownMenu>
         )}
      </>
   )
}

function NavbarMenu({ navItemsUser, handleLogout }) {
   const { loggedUser } = useAuthContext()

   return (
      <>
         {loggedUser ? (
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
         ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? "bg-gray-300 rounded" : "")}>
               <li className={navItemsStyle}>Iniciar sesión</li>
            </NavLink>
         )}
      </>
   )
}
