import { useState } from 'react';
import { NavLink } from "react-router-dom"
import Background from "../Background";
import { loginRequest } from '../../api/login.api'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const navigate = useNavigate();


 async function login(email, password) {
  try {
     const res = await loginRequest(email, password);
     if (res.data.status === 'success') {
       navigate('/');
     } else {
       alert('Error en el inicio de sesión. Por favor, intente de nuevo.');
     }
  } catch (error) {
     alert('Error en el inicio de sesión. Por favor, intente de nuevo.');
  }
 }

 const handleSubmit = (event) => {
  event.preventDefault();
  login(email, password);
 };
 

 return (
    <div className="relative font-sans">
      <Background/>
      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-marron-200">
          <NavLink to="/">
            <img src="ciaolavoro-logo.png" alt="Logo de CiaoLavoro" className='w-24 h-auto mb-8'/>
          </NavLink>
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <label className="mb-4">
              Usuario/Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                placeholder='Usuario/Email'
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