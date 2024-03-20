import { Link, NavLink, useNavigate } from "react-router-dom";
import ciaoLavoroLogo from "/ciaolavoro-logo.png";
import { useAuthContext } from "./auth/AuthContextProvider";
import defaultUserImage from "../assets/service/talonflame.jpg"

const navItemsStyle = "px-2 py-1 font-semibold rounded hover:bg-gray-300 transition";

export default function Navbar() {
  const { logout, loggedUser } = useAuthContext();
  const navigate = useNavigate();

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
    }
  ];

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate('/');
    }
  };
  const handleProfile = () => {
    navigate('/users/profile');
  };

  const renderLoginOrLogout = () => {
    if (loggedUser) {
      return (
        <>
          <Link to="/services/user" >
            <li className={`${navItemsStyle} hover:cursor-pointer`}>
              Mis Servicios
            </li>
          </Link>

          <Link to="/contracts/myList" >
            <li className={`${navItemsStyle} hover:cursor-pointer`}>
              Mis Contratos
            </li>
          </Link>

          <li className={`${navItemsStyle} hover:cursor-pointer`} onClick={handleLogout}>Cerrar sesión</li>
          <li  onClick={handleProfile}>
            <img src={loggedUser.user.image ?? defaultUserImage} alt="Avatar del usuario" className="size-8 object-cover rounded-full hover:shadow transition" />
          </li>
        </>
      );
    } else {
      return (
        <NavLink to="/login" className={({ isActive }) => isActive ? "bg-gray-300 rounded" : ""}>
          <li className={navItemsStyle}>Iniciar sesión</li>
        </NavLink>
      );
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
          <ul className="flex gap-5 py-2">
            {navItems.map((item) => (
              <NavLink key={item.id} to={item.path} className={({ isActive }) => isActive ? "bg-gray-300 rounded" : ""}>
                <li className={navItemsStyle}>{item.title}</li>
              </NavLink>
            ))}
            {renderLoginOrLogout()}
          </ul>
        </section>
      </nav>
    </header>
  );
}
