import { useState } from 'react';
import { NavLink } from "react-router-dom";
import defaultRegisterImage from "../../assets/register/defaultRegisterImage.png";
import { registerRequest } from '../../api/login.api';
import { useNavigate } from 'react-router-dom';
import EyeIcon from '../icons/EyeIcon.jsx';
import EyeSlashIcon from '../icons/EyeSlashIcon.jsx';


export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [firstName, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(defaultRegisterImage);
  const [birthdate, setBirthdate] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [passwordIcon, setPasswordIcon] = useState(EyeSlashIcon);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    const value = e.target.value;

    if(value.includes(' ')){
      alert('El nombre de usuario no debe contener espacios en blanco')
    }else{
      setUsername(value);
    }
    
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if ( !firstName.trim()){
      alert('El nombre no puede estar vacío');
      return;
    }
    if ( !lastName.trim()){
      alert('El apellido no puede estar vacío');
      return;
    }
    try {
      await registerRequest(username, password, firstName, lastName, email, image, birthdate);
      navigate("/");
  } catch (error) {
      console.error('Error registrando usuario:', error);
      if (error.message === 'El nombre de usuario ya está en uso') {
          alert('El nombre de usuario ya existe. Por favor, elige otro.');
      } else {
          alert('Ha ocurrido un error. Por favor intentelo de nuevo');
      }
  }
    
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
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
    setPasswordIcon(passwordType === 'password' ? <EyeIcon /> : <EyeSlashIcon />);

  };

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 200);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 16);

  return (
    <section className="flex flex-col items-center my-6">
      <div className="mb-4">
        <img src={image} alt="Imagen seleccionada o predeterminada" className="bg-white border max-w-full max-h-48 object-cover rounded-lg shadow-md" />
      </div>
      <div className="bg-white p-8 border rounded-lg shadow-lg w-full max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-between w-full">
            <div className="w-full flex justify-center">
              <label htmlFor="image-upload" className="block">
                <div className="flex items-center w-[150px] h-[60px] text-[16px] bg-green-500 text-black px-4 py-2 mb-2 rounded-lg hover:cursor-pointer hover:bg-green-600 transition">
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
                  onChange={handleUsernameChange}
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
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                    title="La contraseña debe tener mínimo una mayúscula, una minúscula, un número y un caracter especial"
                  />
                  <span className="absolute right-0 top-2 pr-2 cursor-pointer" onClick={() => togglePasswordVisibility()}>
                    {passwordIcon}
                  </span>
                </div>
              </label>
              <label className="block">
                Confirmar Contraseña:
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  pattern={password}
                  placeholder='Confirmar Contraseña'
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                  title="Debe de coincidir con la contraseña"
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
                  max={maxDate.toISOString().split('T')[0]}
                  min={minDate.toISOString().split('T')[0]}
                  placeholder='Fecha de nacimiento'
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
              </label>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button type="submit" className="px-6 py-2 bg-orange-400 text-black font-medium rounded-lg hover:cursor-pointer hover:bg-orange-500 transition">Registrarse</button>
          </div>
          <div className="flex flex-col justify-center items-center mt-4">
            <h3>¿Ya tienes una cuenta?</h3>
            <NavLink to="/login" className="text-orange-500 underline">Iniciar sesión</NavLink>
          </div>
        </form>
      </div>
    </section>
  );
}