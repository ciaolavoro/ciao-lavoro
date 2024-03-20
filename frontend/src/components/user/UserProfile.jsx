import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../auth/AuthContextProvider';
import defaultUserImage from '../../assets/service/talonflame.jpg';
import UserProfileData from './UserProfileData';
import UserProfileButton from './UserProfileButton';
import PencilIcon from '../icons/PencilIcon';
import CheckIcon from '../icons/CheckIcon';
import CrossIcon from '../icons/CrossIcon';
import { updateUserRequest, getUserRequest } from '../../api/user.api';

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const { logout, loggedUser } = useAuthContext();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [language, setLanguage] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserRequest(loggedUser.token);
                console.log(response);
                setUser(response);
            } catch (error) {
                console.error('Error fetching user data:', error);
                alert('Error al actualizar el perfil. Por favor, intente de nuevo.');
            }
        };
        fetchUser();
    }, [loggedUser.token]);

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setLanguage(user.language || '');
            setBirthDate(user.birth_date || '');
            setEmail(user.email || '');
            setImage(user.image || defaultUserImage);
        }
    }, [user]);

    const handleEdit = async (event) => {
        event.preventDefault();

        const userData = {
            id: user.id,
            username,
            first_name: firstName,
            last_name: lastName,
            language,
            birth_date: birthDate,
            email,
            image,
        };

        if (window.confirm('¿Está seguro de guardar los cambios? Se cerrará la sesión si decide continuar.')) {
            try {
                const response = await updateUserRequest(userData, loggedUser.token);
                if (response.ok) {
                    alert('Perfil actualizado correctamente');
                    setIsEditing(false);
                    logout();
                    navigate('/');
                } else {
                    alert('Error al actualizar el perfil. Por favor, intente de nuevo.');
                }
            } catch (error) {
                console.error('Error updating user profile:', error);
                alert('Error al actualizar el perfil. Por favor, intente de nuevo.');
            }
        }
    };

    const resetUserData = () => {
        if (user) {
            setUsername(user.username || '');
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setLanguage(user.language || '');
            setBirthDate(user.birth_date || '');
            setEmail(user.email || '');
            setImage(user.image || defaultUserImage);
        }
    };

    const handleCancel = () => {
        resetUserData();
        setIsEditing(false);
    };
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