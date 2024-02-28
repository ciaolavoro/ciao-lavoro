import { NavLink } from "react-router-dom"

export default function Navbar() {

    const navItems = [
        {
            id: 1,
            title: "Inicio",
            path: "/",
        },
        {
            id: 2,
            title: "Sobre nosotros",
            path: "/about",
        },
        {
            id: 3,
            title: "Iniciar sesión",
            path: "/auth",
        },
    ];

    return (
        <header>
            <nav className="flex justify-between items-center sticky w-full h-16 px-6 bg-white border border-gray-300 z-10">
                <section>
                    <NavLink to="/">
                        <img src="ciaolavoro-logo.png" alt="Logo de CiaoLavoro" className="w-8 object-cover rounded" />
                    </NavLink>
                </section>
                <section>
                    <ul className="flex gap-5 py-2">
                        {navItems.map((item) => (
                            <NavLink key={item.id} to={item.path} className={({ isActive }) => isActive ? "bg-slate-200 rounded" : ""}>
                                <li className="px-2 py-1 font-semibold">{item.title}</li>
                            </NavLink>
                        ))}
                    </ul>
                </section>
            </nav>
        </header>
    )
}