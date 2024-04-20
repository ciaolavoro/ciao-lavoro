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
import { checkLastNameIfEmptyAndSize, checkUsernameIfEmptyAndSize, checkFirstNameIfEmptyAndSize, checkIfBirthDateValid, checkIfDateInFuture, checkIfEmpty, checkIfImage, checkIfUsernameExists, errorMessages } from "../../utils/validation"
import { BACKEND_URL } from "../../utils/backendApi"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import ChevronUpDownIcon from "../icons/ChevronUpDownIcon"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { languages } from "@/utils/constants"
import { useToast } from "../ui/use-toast"
import CustomAlertDialog from "../CustomAlertDialog"

export default function UserProfile() {
   const [isEditing, setIsEditing] = useState(false)
   const [openLanguageSelector, setOpenLanguageSelector] = useState(false)
   const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
   const [userData, setUserData] = useState(null)
   const { login, loggedUser } = useAuthContext()
   const user = useLoaderData()
   const userId = user.id
   const navigate = useNavigate()
   const { toast } = useToast()

   const [username, setUsername] = useState(user.username)
   const [firstName, setFirstName] = useState(user.first_name)
   const [lastName, setLastName] = useState(user.last_name)
   const [language, setLanguage] = useState(user.language ?? "")
   const [birthDate, setBirthDate] = useState(user.birth_date)
   const [email, setEmail] = useState(user.email)
   const [image, setImage] = useState(`${BACKEND_URL}${user.image}`)
   const [uploadedImage, setUploadedImage] = useState(null)
   const [isUsernameError, setIsUsernameError] = useState(false)
   const [isImageError, setIsImageError] = useState(false)
   const [isDateError, setIsDateError] = useState(false)
   const [isDateNotValid, setIsDateNotValid] = useState(false)
   const [isUsernameRequiredError, setIsUsernameRequiredError] = useState(false)
   const [isNameRequiredError, setIsNameRequiredError] = useState(false)
   const [isLastNameRequiredError, setIsLastNameRequiredError] = useState(false)
   const [isBirthdayRequiredError, setIsBirthdayRequiredError] = useState(false)
   const [isEmailRequiredError, setEmailIsRequiredError] = useState(false)

   if (!loggedUser || !userId) {
      return <Navigate to="/" />
   }

   const updateUser = async userData => {
      try {
         const response = await updateUserRequest(userData, loggedUser.token)
         if (response.ok) {
            setIsEditing(false)
            const user = await response.json()
            login(user)
            navigate("/")
            toast({
               title: "✔ Perfil actualizado",
               description: "Se ha actualizado su perfil correctamente.",
            })
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
      setIsUsernameError(false)
      setIsImageError(false)
      setIsDateError(false)
      setIsDateNotValid(false)
      setIsUsernameRequiredError(false)
      setIsBirthdayRequiredError(false)
      setIsNameRequiredError(false)
      setIsLastNameRequiredError(false)
      setEmailIsRequiredError(false)
   }

   const handleEdit = async event => {
      event.preventDefault()

      if (checkUsernameIfEmptyAndSize(username)) {
         setIsUsernameRequiredError(true)
         return
      } else if (checkFirstNameIfEmptyAndSize(firstName)) {
         setIsNameRequiredError(true)
         return
      } else if (checkLastNameIfEmptyAndSize(lastName)) {
         setIsLastNameRequiredError(true)
         return
      } else if (checkIfEmpty(birthDate)) {
         setIsBirthdayRequiredError(true)
         return
      } else if (checkIfEmpty(email)) {
         setEmailIsRequiredError(true)
         return
      } else if (await checkIfUsernameExists(username, userId)) {
         resetErrors()
         setIsUsernameError(true)
         return
      } else if (!image) {
         resetErrors()
         setIsImageError(true)
         return
      } else if (checkIfDateInFuture(birthDate)) {
         resetErrors()
         setIsDateError(true)
         return
      } else if (checkIfBirthDateValid(birthDate)) {
         resetErrors()
         setIsDateNotValid(true)
         return
      }
      resetErrors()

      const formData = new FormData()
      formData.append("username", username)
      formData.append("first_name", firstName)
      formData.append("last_name", lastName)
      formData.append("language", language)
      formData.append("birth_date", birthDate)
      formData.append("email", email)
      formData.append("image", image)
      setUserData(formData)

      setOpenConfirmDialog(true)
   }

   const handleCancel = () => {
      resetErrors()
      resetUserData()
      setIsEditing(false)
   }

   const handleImageUpload = event => {
      const image = event.target.files[0]
      if (checkIfImage(image)) {
         event.target.value = null
         setIsImageError(true)
         return
      }
      setIsImageError(false)
      setImage(image)
      setUploadedImage(URL.createObjectURL(image))
   }

   return (
      <form
         className="flex flex-col justify-center items-center gap-y-10 mt-10 mx-2 md:mx-auto px-2 w-full md:w-fit py-14 bg-white border rounded-lg"
         onSubmit={handleEdit}>
         <div className="flex flex-col justify-center items-center gap-y-6 w-full px-4 md:px-16 md:flex-row md:gap-x-20">
            <section className="flex flex-col items-center gap-y-6 w-full">
               <img
                  src={uploadedImage ?? image ?? defaultUserImage}
                  alt={`Foto de perfil del usuario ${username}`}
                  className="mx-auto size-64 object-cover rounded-lg"
               />
               {isEditing && (
                  <div className="flex flex-col">
                     <input type="file" name="image" accept="image/*" onChange={handleImageUpload} className="block w-60 text-sm file:font-sans" />
                     {isImageError && <p className="mx-auto text-red-500 text-xs">{errorMessages.imageNotValid}</p>}
                  </div>
               )}
            </section>
            <section className="flex flex-col gap-y-2 w-full md:gap-y-6">
               <UserProfileData
                  type={"text"}
                  formName={"username"}
                  labelText={"Nombre de usuario:"}
                  inputValue={username}
                  isReadOnly={!isEditing}
                  onChange={event => setUsername(event.target.value)}
                  isError={isUsernameRequiredError || isUsernameError}
                  errorMessage={
                     (isUsernameRequiredError && errorMessages.usernameRequiredAndSize) || (isUsernameError && errorMessages.usernameExists)
                  }
               />
               <section className="flex flex-col gap-y-2 md:flex-row md:gap-x-4">
                  <UserProfileData
                     type={"text"}
                     formName={"firstName"}
                     labelText={"Nombre:"}
                     inputValue={firstName}
                     isReadOnly={!isEditing}
                     onChange={event => setFirstName(event.target.value)}
                     isError={isNameRequiredError}
                     errorMessage={errorMessages.nameRequiredAndSize}
                  />
                  <UserProfileData
                     type={"text"}
                     formName={"lastName"}
                     labelText={"Apellidos:"}
                     inputValue={lastName}
                     isReadOnly={!isEditing}
                     onChange={event => setLastName(event.target.value)}
                     isError={isLastNameRequiredError}
                     errorMessage={errorMessages.lastnameRequiredAndSize}
                  />
               </section>
               <section className="flex flex-col gap-y-2 md:flex-row md:gap-x-4">
                  <div className="flex-col w-full">
                     <label>Idioma:</label>
                     <Popover open={isEditing && openLanguageSelector} onOpenChange={isEditing && setOpenLanguageSelector}>
                        <PopoverTrigger asChild>
                           <button className="flex items-center justify-between px-2 h-8 border rounded w-full">
                              {language !== "" ? language : "Selecciona un idioma"}
                              {isEditing && <ChevronUpDownIcon />}
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
                  </div>
                  <UserProfileData
                     type={"date"}
                     formName={"birthDate"}
                     labelText={"Fecha de nacimiento:"}
                     inputValue={birthDate}
                     isReadOnly={!isEditing}
                     onChange={event => setBirthDate(event.target.value)}
                     isError={isBirthdayRequiredError || isDateError || isDateNotValid}
                     errorMessage={
                        (isBirthdayRequiredError && errorMessages.required) ||
                        (isDateError && errorMessages.dateInFuture) ||
                        (isDateNotValid && errorMessages.birthDateNotValid)
                     }
                  />
               </section>
               <UserProfileData
                  type={"email"}
                  formName={"email"}
                  labelText={"Correo:"}
                  inputValue={email}
                  isReadOnly={!isEditing}
                  onChange={event => setEmail(event.target.value)}
                  isError={isEmailRequiredError}
                  errorMessage={isEmailRequiredError && errorMessages.required}
               />
            </section>
         </div>
         {isEditing ? (
            <div className="flex gap-x-4">
               <UserProfileButton type={"submit"} text={"Guardar cambios"} icon={<CheckIcon />} />
               <UserProfileButton type={"button"} text={"Cancelar"} icon={<CrossIcon />} onClick={handleCancel} />
               <CustomAlertDialog
                  open={openConfirmDialog}
                  setOpen={setOpenConfirmDialog}
                  title={"¿Está seguro de guardar los cambios?"}
                  handleAction={() => {
                     updateUser(userData)
                     setOpenConfirmDialog(false)
                  }}>
               </CustomAlertDialog>
            </div>
         ) : (
            loggedUser.user.id === userId && (
               <UserProfileButton type={"button"} text={"Editar perfil"} icon={<PencilIcon />} onClick={() => setIsEditing(true)} />
            )
         )}
      </form>
   )
}
