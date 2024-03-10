import { useState } from 'react';
import { NavLink } from "react-router-dom";
import Background from "../Background";
import defaultImage from './imagen.png';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { registerRequest } from '../../api/login.api';
import { eye } from 'react-icons-kit/feather/eye';
import { useNavigate } from 'react-router-dom';


const RegisterPage = () => {
 const [username, setUsername] = useState('');
 const [firstName, setName] = useState('');
 const [lastName, setLastName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [setConfirmPassword] = useState('');
 const [image, setImage] = useState(defaultImage);
 const [birthdate, setBirthdate] = useState('');
 const [passwordType, setPasswordType] = useState('password');
 const [passwordIcon, setPasswordIcon] = useState(eyeOff);
 const navigate = useNavigate();

 const handleSubmit = (event) => {
    event.preventDefault();
    registerRequest(username, password,firstName,lastName,email,image,birthdate);
    navigate("/");
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

 const togglePasswordVisibility = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
      setPasswordIcon(eye);
    } else {
      setPasswordType('password');
      setPasswordIcon(eyeOff);
    }
 };

 const minDate = new Date();
 minDate.setFullYear(minDate.getFullYear() - 200);

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
                      style={{ display: 'none' }}
                    />
                 </div>
                </label>
              </div>
              <div className="w-1/2 pr-4">
                <label className="block">
                 Nombre de usuario:
                 <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    maxLength={30}
                    placeholder='Nombre de usuario'
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                 />
                </label>
                <label className="block">
                 Nombre:
                 <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={3}
                    maxLength={30}
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
                    minLength={3}
                    maxLength={60}
                    placeholder='Apellidos'
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                 />
                </label>
              </div>
              <div className="w-1/2 pr-4">
                <label className="block">
                 Contraseña:
                 <div className="relative">
                    <input
                      type={passwordType}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]+$"
                      placeholder='Contraseña'
                      className="w-full p-2 mb-4 border border-gray-300 rounded-md pl-10"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pl-3">
                      <Icon icon={passwordIcon} size={20} onClick={togglePasswordVisibility} />
                    </span>
                 </div>
                </label>
                <label className="block">
                 Confirmar Contraseña:
                 <input
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    pattern={password}
                    placeholder='Confirmar Contraseña'
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
                    max={new Date().toISOString().split('T')[0]}
                    min={minDate.toISOString().split('T')[0]}
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
