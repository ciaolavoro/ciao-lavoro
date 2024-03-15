import { useState } from 'react';
import { Link, NavLink, Navigate } from "react-router-dom"
import { loginRequest } from '../../api/login.api'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './AuthContextProvider';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loggedUser } = useAuthContext();
  const navigate = useNavigate();

  if(loggedUser) {
    return (<Navigate to="/" />)
  }

  const loginUser = async (username, password) => {
    try {
      const res = await loginRequest(username, password)
      if (res.status === '1') {
        login({ user: res.user, token: res.token });
        navigate('/');
        alert('Se ha iniciado sesión correctamente')
      } else {
        alert('Error en el inicio de sesión. Por favor, intente de nuevo.');
      }
    } catch (error) {
      alert('Error en el inicio de sesión. Por favor, intente de nuevo.');
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(username, password);
  };

  return (
    <div className='flex flex-col justify-center items-center mt-6'>
      <NavLink to="/">
        <img src="ciaolavoro-logo.png" alt="Logo de CiaoLavoro" className='w-24 h-auto mb-8' />
      </NavLink>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-y-4 w-80 bg-white p-8 border rounded-lg shadow-md">
        <div className='flex flex-col w-full'>
          <label>Usuario:</label>
          <input type="text" value={username} placeholder='Usuario' onChange={(e) => setUsername(e.target.value)} required
            className="p-2 border border-gray-300 rounded" />
        </div>
        <div className='flex flex-col w-full'>
          <label>Contraseña:</label>
          <input type="password" value={password} placeholder='Contraseña' onChange={(e) => setPassword(e.target.value)} required
            className="p-2 border border-gray-300 rounded" />
        </div>
        <button type="submit" className="p-2 bg-orange-400 text-black rounded cursor-pointer font-inherit border-none">Iniciar sesión</button>
        <div className='flex flex-col items-center'>
          <h3>¿Aún no estás registrado?</h3>
          <Link to="/register" className="text-orange-400 underline">Crear nueva cuenta</Link>
        </div>
      </form>
    </div>
  );
}