export function checkIfEmpty(text) {
    return text.trim().length === 0;
}

export const errorMessages = {
    required: "Este campo es requerido.",
    languageLength: "El idioma no debe tener más de 50 caracteres.",
    imageNotUploaded: "Debe subir una imagen.",
    emailNotValid: "El correo electrónico no es válido.",
}