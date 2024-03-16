import { Navigate, useLoaderData, useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthContextProvider";
import defaultUserImage from "../../assets/service/talonflame.jpg"
import UserProfileData from "./UserProfileData";
import UserProfileButton from "./UserProfileButton";
import PencilIcon from "../icons/PencilIcon";
import CheckIcon from "../icons/CheckIcon";
import CrossIcon from "../icons/CrossIcon";
import { useState } from "react";
import { updateUserRequest } from "../../api/user.api";

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const { logout, loggedUser } = useAuthContext();
    const user = useLoaderData();
    const navigate = useNavigate();

    const [username, setUsername] = useState(user.username);
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [language, setLanguage] = useState(user.language ?? "");
    const [birthDate, setBirthDate] = useState(user.birth_date);
    const [email, setEmail] = useState(user.email);
    const [image, setImage] = useState(user.image);

    if (loggedUser.user.id !== user.id) {
        return (<Navigate to="/" />)
    }

    const updateUser = async (userId, userData) => {
        try {
            const response = await updateUserRequest(userId, userData);
            if (response.ok) {
                alert('Perfil actualizado correctamente');
                setIsEditing(false);
                logout();
                navigate('/');
            } else {
                alert('Error al actualizar el perfil. Por favor, intente de nuevo.');
            }
        } catch (error) {
            alert('Error al actualizar el perfil. Por favor, intente de nuevo.');
        }
    }

    const resetUserData = () => {
        setUsername(user.username);
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setLanguage(user.language ?? "");
        setBirthDate(user.birth_date);
        setEmail(user.email);
        setImage(user.image);
    }

    const handleEdit = (event) => {
        event.preventDefault();

        const userData = {
            username: username,
            first_name: firstName,
            last_name: lastName,
            language: language,
            birth_date: birthDate,
            email: email,
            image: image,
        }

        if (window.confirm('¿Está seguro de guardar los cambios? Se cerrará la sesión si decide continuar.')) {
            updateUser(user.id, userData);
        }
    }

    const handleCancel = () => {
        resetUserData();
        setIsEditing(false);
    }

    return (
        <form className="flex flex-col justify-center items-center gap-y-10 mt-10 mx-44 py-14 bg-white border rounded-lg" onSubmit={handleEdit}>
            <div className="flex gap-x-20">
                <div className="flex flex-col gap-y-6">
                    <img src={image ?? defaultUserImage} alt={`Foto de perfil del usuario ${username}`}
                        className="mx-auto size-64 object-cover rounded-lg" />
                    {isEditing
                        ? <input type="file" name="image" accept="image/*" onChange={(event) => setImage(URL.createObjectURL(event.target.files[0]))}
                            className="block w-60 text-sm file:font-sans" />
                        : null}
                </div>
                <div className="flex flex-col gap-y-6">
                    <UserProfileData type={"text"} formName={"username"} labelText={"Nombre de usuario:"} inputValue={username}
                        isReadOnly={!isEditing} onChange={(event) => setUsername(event.target.value)} />
                    <div className="flex gap-x-4">
                        <UserProfileData type={"text"} formName={"firstName"} labelText={"Nombre:"} inputValue={firstName}
                            isReadOnly={!isEditing} onChange={(event) => setFirstName(event.target.value)} />
                        <UserProfileData type={"text"} formName={"lastName"} labelText={"Apellidos:"} inputValue={lastName}
                            isReadOnly={!isEditing} onChange={(event) => setLastName(event.target.value)} />
                    </div>
                    <div className="flex gap-x-4">
                        <UserProfileData type={"text"} formName={"language"} labelText={"Idioma:"} inputValue={language}
                            isReadOnly={!isEditing} onChange={(event) => setLanguage(event.target.value)} />
                        <UserProfileData type={"date"} formName={"birthDate"} labelText={"Fecha de nacimiento:"} inputValue={birthDate}
                            isReadOnly={!isEditing} onChange={(event) => setBirthDate(event.target.value)} />
                    </div>
                    <UserProfileData type={"email"} formName={"email"} labelText={"Correo:"} inputValue={email}
                        isReadOnly={!isEditing} onChange={(event) => setEmail(event.target.value)} />
                </div>
            </div>
            {isEditing
                ? (<div className="flex gap-x-4">
                    <UserProfileButton type={"submit"} text={"Guardar cambios"} icon={<CheckIcon />} />
                    <UserProfileButton type={"button"} text={"Cancelar"} icon={<CrossIcon />} onClick={handleCancel} />
                </div>)
                : (<UserProfileButton type={"button"} text={"Editar perfil"} icon={<PencilIcon />} onClick={() => setIsEditing(true)} />)}
        </form>
    )
}