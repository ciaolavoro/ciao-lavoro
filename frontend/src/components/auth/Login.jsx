import { useState } from 'react';
import './Login.css';
import { NavLink } from "react-router-dom"
import Navbar from "../Navbar";
import Background from "../Background";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="relative font-sans">
      <Navbar/>
      <Background/>
      <main>
        <br></br>
        <center>
          <NavLink to="/">
            <img src="ciaolavoro-logo.png" alt="Logo de CiaoLavoro" className='logo'/>
          </NavLink>
        </center>
        <div className="login-form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <label>
              Usuario/Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Contraseña:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <center>
              <div>
                <button type="submit">Iniciar sesión</button>
              </div>
              <br></br>
              
              <h3>¿Aún no estás registrado?</h3><NavLink to="/register" className="link-naranja">Crear nueva cuenta</NavLink>
            </center>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
