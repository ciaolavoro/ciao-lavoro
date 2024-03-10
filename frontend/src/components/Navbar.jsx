import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ciaoLavoroLogo from "/ciaolavoro-logo.png";
import { isAuthenticated, logoutRequest } from '../api/login.api';

export default function Navbar() {
 const navItems = [
    {
      id: 1,
      title: "Inicio",
      path: "/",
    },
    {
      id: 2,
      title: "Buscar Servicios",
      path: "/services",
    },
    {
      id: 3,
      title: "Sobre nosotros",
      path: "https://ciaolavoro.github.io/landingpage",
    },
    
 ];

 const location = useLocation();

 const [isLoggedIn, setIsLoggedIn] = useState([]);

 useEffect(() => {
      const getIsAuthenticated = async () => {
          try {
              const res = await isAuthenticated();
              if(res.status === 200){
                 const data = await res.json();
                 setIsLoggedIn(data.isAuthenticated);
              } else {
                 alert('Error al cargar los servicios');
              }
          } catch (error) {
              alert('Error al cargar los servicios');
          }
      };
      getIsAuthenticated();
 }, []);

 const handleLogout = async () => {
    try {
      await logoutRequest();
      setIsLoggedIn(false);
      alert('Se ha cerrado la sesión correctamente')
    } catch (error) {
      alert('Ha ocurrido un error durante el cierre de sesión.');
    }
 };

 const renderAuthLinks = () => {
    if (isLoggedIn) {
      return (
        <div>
          <NavLink to="/services/user" className="px-2 py-1 font-semibold">
            Mis Servicios
          </NavLink>
          <button onClick={handleLogout} className="px-2 py-1 font-semibold">
            Cerrar sesión
          </button>
        </div>
        
      );
    } else {
      return (
        <NavLink to="/login" className="px-2 py-1 font-semibold">
          Iniciar sesión
        </NavLink>
      );
    }
 };

 return (
    <header>
      <nav className="flex justify-between items-center sticky w-full h-16 px-6 bg-white border border-gray-300 z-10">
        <section>
          <NavLink to="/">
            <img
              src={ciaoLavoroLogo}
              alt="Logo de CiaoLavoro"
              className="w-8 object-cover rounded"
            />
          </NavLink>
        </section>
        <section>
          <ul className="flex gap-5 py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={
                 location.pathname === item.path
                    ? "bg-slate-200 rounded"
                    : ""
                }
              >
                <li className="px-2 py-1 font-semibold">{item.title}</li>
              </NavLink>
            ))}
            {renderAuthLinks()}
          </ul>
        </section>
      </nav>
    </header>
 );
}
