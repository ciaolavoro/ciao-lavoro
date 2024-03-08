import { useState } from 'react';
import { NavLink } from "react-router-dom";
import Background from "../Background";
import defaultImage from './imagen.png';

const RegisterPage = () => {
 const [username, setUsername] = useState('');
 const [name, setName] = useState('');
 const [lastName, setLastName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [confirmPassword] = useState('');
 const [image, setImage] = useState(defaultImage);
 const [birthdate, setBirthdate] = useState('');

 const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Lógica de envío aquí...
 };

 const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
 };

 return (
    <div className="relative font-sans">
      <Background />
      <main className="flex flex-col items-center">
        <div className="mb-8">
          <img src={image} alt="Imagen seleccionada o predeterminada" className="max-w-full max-h-48 object-cover rounded-lg shadow-md" />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
            <div className="flex flex-wrap justify-between w-full">
            <div className="w-full flex justify-center">
              <label htmlFor="image-upload" className="block">
                <div className="bg-green-600 text-black px-4 py-2 rounded-lg cursor-pointer" style={{ width: '150px', height: '60px', fontSize: '16px', alignItems:'center', display:'flex', justifyContent:'center' }}>
                 Selecciona tu foto de perfil
                 <input
                    type="file"
                    id="image-upload"
                    onChange={handleImageChange}
                    required
                    style={{ display: 'none' }}
                 />
                </div>
              </label>
            </div>
            
              {/* Columna 1: Datos del usuario */}
              <div className="w-1/2 pr-4">
              <br></br>
                <label className="block">
                  Nombre de usuario:
                 <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder='Nombre de usuario'
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                 />
                </label>
                <label className="block">
                  Nombre:
                 <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder='Nombre'
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                 />
                </label>
                <label className="block">
                  Apellido:
                 <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder='Apellidos'
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                 />
                </label>
              </div>
              {/* Columna 2: Datos de la cuenta */}
              <div className="w-1/2 pr-4">
              <br></br>
                <label className="block">
                  Contraseña:
                 <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder='Contraseña'
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                 />
                </label>
                <label className="block">
                  Email:
                 <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder='Email'
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                 />
                </label>
                <label className="block">
                  Fecha de nacimiento:
                 <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    required
                    placeholder='Fecha de nacimiento'
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                 />
                </label>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button type="submit" className="px-6 py-2 bg-orange-400 text-black rounded-lg cursor-pointer font-medium">Registrarse</button>
            </div>
            <div className="flex justify-center mt-4">
              <h3 className="mb-2">¿Ya tienes una cuenta?</h3>
              <NavLink to="/login" className="text-orange-500 underline">Iniciar sesión</NavLink>
            </div>
          </form>
        </div>
      </main>
    </div>
 );
};

export default RegisterPage;
