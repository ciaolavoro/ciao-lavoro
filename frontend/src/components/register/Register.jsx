import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import defaultRegisterImage from "../../assets/register/defaultRegisterImage.png"
import { registerRequest } from "../../api/login.api"
import EyeIcon from "../icons/EyeIcon.jsx"
import EyeSlashIcon from "../icons/EyeSlashIcon.jsx"
import { languages } from "@/utils/constants"
import { checkIfImage } from "@/utils/validation"
import { useToast } from "../ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import ChevronUpDownIcon from "../icons/ChevronUpDownIcon"


export default function RegisterPage() {
   const [username, setUsername] = useState("")
   const [firstName, setName] = useState("")
   const [lastName, setLastName] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [confirmPassword, setConfirmPassword] = useState("")
   const [image, setImage] = useState(defaultRegisterImage)
   const [birthdate, setBirthdate] = useState("")
   const [passwordType, setPasswordType] = useState("password")
   const [confirmPasswordType, setConfirmPasswordType] = useState("password")
   const [passwordIcon, setPasswordIcon] = useState(EyeSlashIcon)
   const [confirmPasswordIcon, setConfirmPasswordIcon] = useState(EyeSlashIcon)
   const [uploadedImage, setUploadedImage] = useState(null)
   const [termsAccepted, setTermsAccepted] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const [language, setLanguage] = useState("")
   const navigate = useNavigate()
   const { toast } = useToast()
   const [openLanguageSelector, setOpenLanguageSelector] = useState(false)

   const handleUsernameChange = e => {
      const value = e.target.value

      if (value.includes(" ")) {
         alert("El nombre de usuario no debe contener espacios en blanco")
      } else {
         setUsername(value)
      }
   }

   const validateEmail = email => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
   }

   const handleSubmit = async event => {
      event.preventDefault()
      if (!validateEmail(email)) {
         setErrorMessage("Por favor ingrese un email válido.")
         return
      }
      if (!termsAccepted) {
         setErrorMessage("Para poder registrarse debe aceptar los Terminos y Condiciones")
         return
      }
      if (!firstName.trim()) {
         alert("El nombre no puede estar vacío")
         return
      }
      if (!lastName.trim()) {
         alert("El apellido no puede estar vacío")
         return
      }
      if (password !== confirmPassword) {
         alert("Las contraseñas no coinciden")
         return
      }
      try {
         const response = await registerRequest(username, password, firstName, lastName, email, image, birthdate, language)
         if (response.status == 500) {
            alert("El email no es valido")
         } else {
            toast({
               title: "Registro de usuario exitoso",
               description: "Te has registrado correctamente. Bienvenido a CiaoLavoro.",
            })
            navigate("/")
         }
      } catch (error) {
         console.error("Error registrando usuario:", error)
         if (error.message === "El nombre de usuario ya está en uso") {
            alert("El nombre de usuario ya existe. Por favor, elige otro.")
         } else {
            alert("Ha ocurrido un error. Por favor intentelo de nuevo")
         }
      }
   }

   const handleImageChange = event => {
      if (checkIfImage(event.target.files[0])) {
         alert("Por favor, suba solo imágenes.")
         return
      }
      setImage(event.target.files[0])
      setUploadedImage(URL.createObjectURL(event.target.files[0]))
   }

   const togglePasswordVisibility = () => {
      setPasswordType(passwordType === "password" ? "text" : "password")
      setPasswordIcon(passwordType === "password" ? <EyeIcon /> : <EyeSlashIcon />)
   }

   const toggleConfirmPasswordVisibility = () => {
      setConfirmPasswordType(confirmPasswordType === "password" ? "text" : "password")
      setConfirmPasswordIcon(confirmPasswordType === "password" ? <EyeIcon /> : <EyeSlashIcon />)
   }

   const minDate = new Date()
   minDate.setFullYear(minDate.getFullYear() - 100)
   const maxDate = new Date()
   maxDate.setFullYear(maxDate.getFullYear() - 16)

   return (
      <section className="flex flex-col items-center my-6">
         <div className="mb-4">
            <img
               src={uploadedImage ?? defaultRegisterImage}
               alt="Imagen seleccionada o predeterminada"
               className="bg-white border max-w-full max-h-48 object-cover rounded-lg shadow-md"
            />
         </div>
         <div className="bg-white px-8 py-6 border rounded-lg shadow-lg w-full max-w-xl">
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
               <section className="flex flex-col items-center md:justify-between w-full">
                  <section className="w-full flex justify-center">
                     <label htmlFor="image-upload" className="block">
                        <div className="flex items-center w-[150px] h-[60px] text-[16px] bg-green-500 text-black px-4 py-2 mb-2 rounded-lg shadow hover:cursor-pointer hover:bg-green-600 transition">
                           Selecciona tu foto de perfil
                           <input type="file" id="image-upload" accept="image/" onChange={handleImageChange} style={{ display: "none" }} />
                        </div>
                     </label>
                  </section>
                  <section className="flex flex-col md:flex-row">
                     <section className="w-full md:w-1/2 md:pr-4">
                        <label className="block">
                           Nombre de usuario:
                           <input
                              type="text"
                              value={username}
                              onChange={handleUsernameChange}
                              required
                              minLength={3}
                              maxLength={30}
                              placeholder="Nombre de usuario"
                              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                           />
                        </label>
                        <label className="block">
                           Nombre:
                           <input
                              type="text"
                              value={firstName}
                              onChange={e => setName(e.target.value)}
                              required
                              minLength={3}
                              maxLength={30}
                              placeholder="Nombre"
                              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                           />
                        </label>
                        <label className="block">
                           Apellido:
                           <input
                              type="text"
                              value={lastName}
                              onChange={e => setLastName(e.target.value)}
                              required
                              minLength={3}
                              maxLength={60}
                              placeholder="Apellido"
                              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                           />
                        </label>
                        <label className="block">
                           Idioma:
                           <Popover open={openLanguageSelector} onOpenChange={setOpenLanguageSelector}>
                        <PopoverTrigger asChild>
                           <button className="flex items-center justify-between px-2 h-8 border rounded w-full">
                              {language !== "" ? language : "Selecciona un idioma"}
                              {<ChevronUpDownIcon />}
                           </button>
                        </PopoverTrigger>
                        <PopoverContent>
                           <Command>
                              <CommandInput placeholder="Buscar idioma..." />
                              <CommandList>
                                 <CommandEmpty>No se ha encontrado el idioma.</CommandEmpty>
                                 <CommandGroup>
                                    {languages.map((lang, index) => (
                                       <CommandItem
                                          key={index}
                                          value={lang}
                                          onSelect={currentLang => {
                                             setLanguage(currentLang === language ? "" : currentLang)
                                             setOpenLanguageSelector(false)
                                          }}>
                                          {lang}
                                       </CommandItem>
                                    ))}
                                 </CommandGroup>
                              </CommandList>
                           </Command>
                        </PopoverContent>
                     </Popover>
                        </label>
                     </section>
                     <section className="w-full md:w-1/2 md:pr-4">
                        <label className="block">
                           Contraseña:
                           <div className="relative">
                              <input
                                 type={passwordType}
                                 value={password}
                                 onChange={e => setPassword(e.target.value)}
                                 required
                                 minLength={8}
                                 pattern="^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_ñÑ]+$"
                                 placeholder="Contraseña"
                                 className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                                 title="La contraseña debe tener mínimo una mayúscula, una minúscula, un número y un caracter especial(?=.*[@$!%*?&_)"
                              />
                              <span className="absolute right-0 top-2 pr-2 cursor-pointer" onClick={togglePasswordVisibility}>
                                 {passwordIcon}
                              </span>
                           </div>
                        </label>
                        <label className="block">
                           Confirmar Contraseña:
                           <div className="relative">
                              <input
                                 type={confirmPasswordType}
                                 value={confirmPassword}
                                 onChange={e => setConfirmPassword(e.target.value)}
                                 required
                                 minLength={8}
                                 placeholder="Confirmar Contraseña"
                                 className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                                 title="Debe coincidir con la contraseña"
                              />
                              <span className="absolute right-0 top-2 pr-2 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
                                 {confirmPasswordIcon}
                              </span>
                           </div>
                        </label>
                        <label className="block">
                           Email:
                           <input
                              type="email"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              required
                              placeholder="Email"
                              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                           />
                        </label>
                        <label className="block">
                           Fecha de nacimiento:
                           <input
                              type="date"
                              value={birthdate}
                              onChange={e => setBirthdate(e.target.value)}
                              required
                              max={maxDate.toISOString().split("T")[0]}
                              min={minDate.toISOString().split("T")[0]}
                              placeholder="Fecha de nacimiento"
                              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                           />
                        </label>
                     </section>
                  </section>
               </section>
               <div className="flex justify-center mt-8">
                  <input type="checkbox" id="terms-accept" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
                  <label htmlFor="terms-accept" className="ml-2">
                     Aceptar
                     <span>
                        <Link
                           to={"https://ciaolavoro.github.io/landingpage/terminosyCondciones.html"}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="ml-2 text-green-500 underline">
                           Términos de uso y Condiciones
                        </Link>
                     </span>
                     .
                  </label>
               </div>
               {errorMessage && <p className="text-red-500">{errorMessage}</p>}

               <div className="flex justify-center mt-8">
                  <button
                     type="submit"
                     className="px-6 py-2 bg-orange-400 text-black font-medium rounded-lg shadow hover:cursor-pointer hover:bg-orange-500 transition">
                     Registrarse
                  </button>
               </div>
               <div className="flex flex-col justify-center items-center mt-4">
                  <h3>¿Ya tienes una cuenta?</h3>
                  <NavLink to="/login" className="text-orange-500 underline">
                     Iniciar sesión
                  </NavLink>
               </div>
            </form>
         </div>
      </section>
   )
}
