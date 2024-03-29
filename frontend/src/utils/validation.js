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

export function checkOnlyCharactersInText(text) {
    const onlyCharactersRegex = /^[a-zA-Z]+$/;
    return !onlyCharactersRegex.test(text);
}

export function checkCityLength(city) {
    return city.length > 50;
}

export function checkExperienceNegative(experience) {
    return experience < 0;
}

export function checkProfessionDuplicated(profession, professions) {
    return professions.includes(profession);
}

export function checkExperienceYears(experience, userBirthDate) {
    const today = new Date();
    const birthDate = new Date(userBirthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return Number(experience) + 16 > age;
}

export const errorMessages = {
    required: "Este campo es requerido.",
    cityLength: "La ciudad no debe tener más de 50 caracteres.",
    experienceNotValid: "La experiencia no puede ser menos que 0.",
    tooMuchExperience: "La experiencia no puede ser tan grande en comparación con la edad del usuario.",
    languageLength: "El idioma no debe tener más de 50 caracteres.",
    imageNotUploaded: "Debe subir una imagen.",
    emailNotValid: "El correo electrónico no es válido.",
    usernameExists: "El nombre de usuario ya existe.",
    professionDuplicate: "No se pueden crear dos servicios con la misma profesión.",
    onlyCharacters: "Este campo solo puede contener letras.",
}