import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import defaultRegisterImage from "../../assets/register/defaultRegisterImage.png"
import { registerRequest } from "../../api/login.api"
import EyeIcon from "../icons/EyeIcon.jsx"
import EyeSlashIcon from "../icons/EyeSlashIcon.jsx"
import { languages } from "@/utils/constants"
import {
   checkEmail,
   checkFirstNameIfEmptyAndSize,
   checkIfBirthDateValid,
   checkIfEmpty,
   checkIfImage,
   checkIfUsernameExists,
   checkLastNameIfEmptyAndSize,
   checkUsernameIfEmptyAndSize,
   checkValidPassword,
   errorMessages,
} from "@/utils/validation"
import { useToast } from "../ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import ChevronUpDownIcon from "../icons/ChevronUpDownIcon"
import RegisterData from "./RegisterData"

export default function RegisterPage() {
   const navigate = useNavigate()
   const { toast } = useToast()
   const [openLanguageSelector, setOpenLanguageSelector] = useState(false)

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
   const [language, setLanguage] = useState("")

   const [imageError, setImageError] = useState(false)
   const [usernameError, setUsernameError] = useState(false)
   const [usernameExistsError, setUsernameExistsError] = useState(false)
   const [firstNameError, setFirstNameError] = useState(false)
   const [lastNameError, setLastNameError] = useState(false)
   const [languageError, setLanguageError] = useState(false)
   const [passwordError, setPasswordError] = useState(false)
   const [passwordNotEqualError, setPasswordNotEqualError] = useState(false)
   const [emailError, setEmailError] = useState(false)
   const [birthDateError, setBirthDateError] = useState(false)
   const [termsError, setTermsError] = useState(false)

   const resetErrors = () => {
      setImageError(false)
      setUsernameError(false)
      setUsernameExistsError(false)
      setFirstNameError(false)
      setLastNameError(false)
      setLanguageError(false)
      setPasswordError(false)
      setPasswordNotEqualError(false)
      setEmailError(false)
      setBirthDateError(false)
      setTermsError(false)
   }

   const handleSubmit = async event => {
      event.preventDefault()
      if (checkUsernameIfEmptyAndSize(username)) {
         setUsernameError(true)
         return
      } else if (await checkIfUsernameExists(username, -1)) {
         resetErrors()
         setUsernameExistsError(true)
         return
      } else if (checkFirstNameIfEmptyAndSize(firstName)) {
         resetErrors()
         setFirstNameError(true)
         return
      } else if (checkLastNameIfEmptyAndSize(lastName)) {
         resetErrors()
         setLastNameError(true)
         return
      } else if (checkIfEmpty(language)) {
         resetErrors()
         setLanguageError(true)
         return
      } else if (checkValidPassword(password)) {
         resetErrors()
         setPasswordError(true)
         return
      } else if (password !== confirmPassword) {
         resetErrors()
         setPasswordNotEqualError(true)
         return
      } else if (checkEmail(email)) {
         resetErrors()
         setEmailError(true)
         return
      } else if (checkIfBirthDateValid(birthdate)) {
         resetErrors()
         setBirthDateError(true)
         return
      } else if (!termsAccepted) {
         resetErrors()
         setTermsError(true)
         return
      }
      resetErrors()

      try {
         const response = await registerRequest(username, password, firstName, lastName, email, image, birthdate, language)
         if (response.status === 201) {
            toast({
               title: "✔ Registro de usuario exitoso",
               description: "Te has registrado correctamente. Bienvenido a CiaoLavoro.",
            })
            navigate("/login")
         } else {
            toast({
               title: "❌ Email no válido",
               description: "El email que ha introducido no es válido. Por favor, introduzca un email correcto.",
            })
         }
      } catch (error) {
         console.error("Error registrando usuario:", error)
      }
   }

   const handleImageChange = event => {
      if (checkIfImage(event.target.files[0])) {
         resetErrors()
         setImageError(true)
         return
      }
      resetErrors()

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
                  <section className="flex flex-col w-full justify-center items-center">
                     <label htmlFor="image-upload" className="block">
                        <div className="flex items-center w-[150px] h-[60px] text-[16px] bg-green-500 text-black px-4 py-2 mb-2 rounded-lg shadow hover:cursor-pointer hover:bg-green-600 transition">
                           Selecciona tu foto de perfil
                           <input type="file" id="image-upload" accept="image/" onChange={handleImageChange} style={{ display: "none" }} />
                        </div>
                     </label>
                     {imageError && <p className="text-red-500 text-xs">{errorMessages.imageNotValid}</p>}
                  </section>
                  <section className="flex flex-col md:flex-row">
                     <section className="flex flex-col gap-y-2 w-full md:w-1/2 md:pr-4">
                        <RegisterData
                           type={"text"}
                           inputName={"username"}
                           labelText={"Nombre de usuario:"}
                           inputValue={username}
                           onChange={e => setUsername(e.target.value)}
                           isError={usernameError || usernameExistsError}
                           errorMessage={
                              (usernameError && errorMessages.usernameRequiredAndSize) || (usernameExistsError && errorMessages.usernameExists)
                           }
                        />
                        <RegisterData
                           type={"text"}
                           inputName={"firstName"}
                           labelText={"Nombre:"}
                           inputValue={firstName}
                           onChange={e => setName(e.target.value)}
                           isError={firstNameError}
                           errorMessage={errorMessages.nameRequiredAndSize}
                        />
                        <RegisterData
                           type={"text"}
                           inputName={"lastName"}
                           labelText={"Apellidos:"}
                           inputValue={lastName}
                           onChange={e => setLastName(e.target.value)}
                           isError={lastNameError}
                           errorMessage={errorMessages.lastnameRequiredAndSize}
                        />
                        <label>
                           Idioma:
                           <Popover open={openLanguageSelector} onOpenChange={setOpenLanguageSelector}>
                              <PopoverTrigger asChild>
                                 <button className="flex items-center justify-between px-2 h-12 border rounded w-full">
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
                           {languageError && <p className="pl-1 text-red-500 text-xs">{errorMessages.required}</p>}
                        </label>
                     </section>
                     <section className="flex flex-col gap-y-2 w-full md:w-1/2 md:pr-4">
                        <div className="relative">
                           <RegisterData
                              type={passwordType}
                              inputName={"password"}
                              labelText={"Contraseña:"}
                              inputValue={password}
                              onChange={e => setPassword(e.target.value)}
                              isError={passwordError}
                              errorMessage={errorMessages.passwordNotValid}
                           />
                           <span className="absolute right-0 top-7 pr-2 cursor-pointer" onClick={togglePasswordVisibility}>
                              {passwordIcon}
                           </span>
                        </div>
                        <div className="relative">
                           <RegisterData
                              type={confirmPasswordType}
                              inputName={"confirmPassword"}
                              labelText={"Confirmar contraseña:"}
                              inputValue={confirmPassword}
                              onChange={e => setConfirmPassword(e.target.value)}
                              isError={passwordNotEqualError}
                              errorMessage={errorMessages.passwordNotEqual}
                           />
                           <span className="absolute right-0 top-7 pr-2 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
                              {confirmPasswordIcon}
                           </span>
                        </div>
                        <RegisterData
                           type={"email"}
                           inputName={"email"}
                           labelText={"Email:"}
                           inputValue={email}
                           onChange={e => setEmail(e.target.value)}
                           isError={emailError}
                           errorMessage={errorMessages.emailNotValid}
                        />
                        <RegisterData
                           type={"date"}
                           inputName={"birthDate"}
                           labelText={"Fecha de nacimiento:"}
                           inputValue={birthdate}
                           onChange={e => setBirthdate(e.target.value)}
                           isError={birthDateError}
                           errorMessage={errorMessages.birthDateNotValid}
                        />
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
               {termsError && <p className="text-red-500 text-xs">{errorMessages.termsNotAccepted}</p>}

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
