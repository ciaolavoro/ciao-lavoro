export async function checkIfUsernameExists(username, userId) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/`);
    const data = await res.json();
    const filteredData = data.filter(existingUser => existingUser.id !== userId && existingUser.username === username);
    return filteredData.length > 0;
}

export function checkLanguageLength(language) {
    return language.length > 50;
}

export function checkIfEmpty(text) {
    return text.trim().length === 0;
}

export const errorMessages = {
    required: "Este campo es requerido.",
    languageLength: "El idioma no debe tener más de 50 caracteres.",
    imageNotUploaded: "Debe subir una imagen.",
    emailNotValid: "El correo electrónico no es válido.",
    usernameExists: "El nombre de usuario ya existe.",
}