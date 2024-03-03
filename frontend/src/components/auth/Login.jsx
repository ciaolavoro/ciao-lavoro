import { useState } from 'react';
import { NavLink } from "react-router-dom"
import Background from "../Background";
import { loginRequest } from '../../api/login.api'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function login(username, password) {
    try {
      const res = await (await loginRequest(username, password)).json();
      console.log(res.message)
      if (res.status === '1') {
        navigate('/');
        window.location.reload();
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
    login(username, password);
  };


  return (
    <div className="relative font-sans">
      <Background />
      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-marron-200">
        <NavLink to="/">
          <img src="ciaolavoro-logo.png" alt="Logo de CiaoLavoro" className='w-24 h-auto mb-8' />
        </NavLink>
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <label className="mb-4">
              Usuario:
              <input
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                placeholder='Usuario'
              />
            </label>
            <label className="mb-4">
              Contraseña:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                placeholder='Contraseña'
              />
            </label>
            <center>
              <div>
                <button type="submit" className="p-2 bg-orange-400 text-black rounded cursor-pointer font-inherit border-none">Iniciar sesión</button>
              </div>
              <br></br>

              <h3>¿Aún no estás registrado?</h3><NavLink to="/register" className="text-orange-400 underline">Crear nueva cuenta</NavLink>
            </center>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;