import { Navigate, useLoaderData, useNavigate } from "react-router-dom"
import { useAuthContext } from "../auth/AuthContextProvider"
import defaultUserImage from "../../assets/service/talonflame.jpg"
import UserProfileData from "./UserProfileData"
import UserProfileButton from "./UserProfileButton"
import PencilIcon from "../icons/PencilIcon"
import CheckIcon from "../icons/CheckIcon"
import CrossIcon from "../icons/CrossIcon"
import { useState } from "react"
import { updateUserRequest } from "../../api/user.api"
import { checkIfEmpty, checkIfUsernameExists, checkLanguageLength, errorMessages } from "../../utils/validation"
import { BACKEND_URL } from "../../utils/backendApi"


export default function UserProfile() {
   const [isEditing, setIsEditing] = useState(false)
   const { logout, loggedUser } = useAuthContext()
   const user = useLoaderData()
   const userId = user.id
   const navigate = useNavigate()

   const [username, setUsername] = useState(user.username)
   const [firstName, setFirstName] = useState(user.first_name)
   const [lastName, setLastName] = useState(user.last_name)
   const [language, setLanguage] = useState(user.language ?? "")
   const [birthDate, setBirthDate] = useState(user.birth_date)
   const [email, setEmail] = useState(user.email)
   const [image, setImage] = useState(`${BACKEND_URL}${user.image}`)
   const [uploadedImage, setUploadedImage] = useState(null)
   const [isRequiredError, setIsRequiredError] = useState(false)
   const [isUsernameError, setIsUsernameError] = useState(false)
   const [isImageError, setIsImageError] = useState(false)
   const [isLanguageError, setIsLanguageError] = useState(false)

   if (!loggedUser || !userId) {
      return <Navigate to="/" />
   }

   const updateUser = async (userId, userData) => {
      try {
         const response = await updateUserRequest(userId, userData, loggedUser.token)
         if (response.ok) {
            alert("Perfil actualizado correctamente")
            setIsEditing(false)
            logout()
            navigate("/")
         } else {
            alert("Error al actualizar el perfil. Por favor, intente de nuevo.")
         }
      } catch (error) {
         alert("Error al actualizar el perfil. Por favor, intente de nuevo.")
      }
   }

   const resetUserData = () => {
      setUsername(user.username)
      setFirstName(user.first_name)
      setLastName(user.last_name)
      setLanguage(user.language ?? "")
      setBirthDate(user.birth_date)
      setEmail(user.email)
      setImage(`${BACKEND_URL}${user.image}`)
      setUploadedImage(null)
   }

   const resetErrors = () => {
      setIsRequiredError(false)
      setIsUsernameError(false)
      setIsImageError(false)
      setIsLanguageError(false)
   }

   const handleEdit = async event => {
      event.preventDefault()

      if (checkIfEmpty(username) || checkIfEmpty(firstName) || checkIfEmpty(lastName) || checkIfEmpty(birthDate) || checkIfEmpty(email)) {
         setIsRequiredError(true)
         return
      } else if (await checkIfUsernameExists(username, userId)) {
         resetErrors()
         setIsUsernameError(true)
         return
      } else if (checkLanguageLength(language)) {
         resetErrors()
         setIsLanguageError(true)
         return
      } else if (!image) {
         resetErrors()
         setIsImageError(true)
         return
      }
      resetErrors()

      const userData = new FormData()
      userData.append("username", username)
      userData.append("first_name", firstName)
      userData.append("last_name", lastName)
      userData.append("language", language)
      userData.append("birth_date", birthDate)
      userData.append("email", email)
      userData.append("image", image)

      if (window.confirm("¿Está seguro de guardar los cambios? Se cerrará la sesión si decide continuar.")) {
         updateUser(userData, loggedUser.token)
      }
   }

   const handleCancel = () => {
      resetErrors()
      resetUserData()
      setIsEditing(false)
   }

   const handleImageUpload = event => {
      setImage(event.target.files[0])
      setUploadedImage(URL.createObjectURL(event.target.files[0]))
   }

   return (
      <form className="flex flex-col justify-center items-center gap-y-10 mt-10 mx-44 py-14 bg-white border rounded-lg" onSubmit={handleEdit}>
         <div className="flex gap-x-20">
            <div className="flex flex-col gap-y-6">
               <img
                  src={uploadedImage ?? image ?? defaultUserImage}
                  alt={`Foto de perfil del usuario ${username}`}
                  className="mx-auto size-64 object-cover rounded-lg"
               />
               {isEditing && (
                  <div className="flex flex-col">
                     <input type="file" name="image" accept="image/*" onChange={handleImageUpload} className="block w-60 text-sm file:font-sans" />
                     {isImageError && <p className="mx-auto text-red-500 text-xs">{errorMessages.imageNotUploaded}</p>}
                  </div>
               )}
            </div>
            <div className="flex flex-col gap-y-6">
               <UserProfileData
                  type={"text"}
                  formName={"username"}
                  labelText={"Nombre de usuario:"}
                  inputValue={username}
                  isReadOnly={!isEditing}
                  onChange={event => setUsername(event.target.value)}
                  isError={isRequiredError || isUsernameError}
                  errorMessage={(isRequiredError && errorMessages.required) || (isUsernameError && errorMessages.usernameExists)}
               />
               <div className="flex gap-x-4">
                  <UserProfileData
                     type={"text"}
                     formName={"firstName"}
                     labelText={"Nombre:"}
                     inputValue={firstName}
                     isReadOnly={!isEditing}
                     onChange={event => setFirstName(event.target.value)}
                     isError={isRequiredError}
                     errorMessage={errorMessages.required}
                  />
                  <UserProfileData
                     type={"text"}
                     formName={"lastName"}
                     labelText={"Apellidos:"}
                     inputValue={lastName}
                     isReadOnly={!isEditing}
                     onChange={event => setLastName(event.target.value)}
                     isError={isRequiredError}
                     errorMessage={errorMessages.required}
                  />
               </div>
               <div className="flex gap-x-4">
                  <UserProfileData
                     type={"text"}
                     formName={"language"}
                     labelText={"Idioma:"}
                     inputValue={language}
                     isReadOnly={!isEditing}
                     onChange={event => setLanguage(event.target.value)}
                     isError={isLanguageError}
                     errorMessage={errorMessages.languageLength}
                  />
                  <UserProfileData
                     type={"date"}
                     formName={"birthDate"}
                     labelText={"Fecha de nacimiento:"}
                     inputValue={birthDate}
                     isReadOnly={!isEditing}
                     onChange={event => setBirthDate(event.target.value)}
                     isError={isRequiredError}
                     errorMessage={errorMessages.required}
                  />
               </div>
               <UserProfileData
                  type={"email"}
                  formName={"email"}
                  labelText={"Correo:"}
                  inputValue={email}
                  isReadOnly={!isEditing}
                  onChange={event => setEmail(event.target.value)}
                  isError={isRequiredError}
                  errorMessage={isRequiredError && errorMessages.required}
               />
            </div>
         </div>
         {isEditing ? (
            <div className="flex gap-x-4">
               <UserProfileButton type={"submit"} text={"Guardar cambios"} icon={<CheckIcon />} />
               <UserProfileButton type={"button"} text={"Cancelar"} icon={<CrossIcon />} onClick={handleCancel} />
            </div>
         ) : (
            loggedUser.user.id === userId && (
               <UserProfileButton type={"button"} text={"Editar perfil"} icon={<PencilIcon />} onClick={() => setIsEditing(true)} />
            )
         )}
      </form>
   )
}
