export function checkCityLength(city) {
    return city.length > 50;
}

export function checkExperienceNegative(experience) {
    return experience < 0;
}

export function checkIfEmpty(text) {
    return text.trim().length === 0;
}

export const errorMessages = {
    required: "Este campo es requerido.",
    cityLength: "La ciudad no debe tener más de 50 caracteres.",
    experienceNotValid: "La experiencia no puede ser menos que 0.",
}