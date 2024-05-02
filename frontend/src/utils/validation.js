import { fetchBackend } from "./backendApi";

export async function checkIfUsernameExists(username, userId) {
    const res = await fetchBackend(`/user/`);
    const data = await res.json();
    const filteredData = data.filter(existingUser => existingUser.id !== userId && existingUser.username === username);
    return filteredData.length > 0;
}

export async function checkEmailExist(email) {
    const res = await fetchBackend(`/user/`);
    const data = await res.json();

    console.log('Datos de usuarios: ', data);

    const existingUser = data.find(user => user.email === email);

    console.log('Usuario existente: ', existingUser);

    return existingUser !== undefined;
}

export function checkIfEmpty(text) {
    return text.trim().length === 0;
}
export function checkUsernameIfEmptyAndSize(username) {
    return !username.trim() || username.length < 3 || username.length >= 31 || username.charAt(0) === ' ' || username.indexOf(' ') !== -1;
}
export function checkFirstNameIfEmptyAndSize(firstName) {
    return !firstName.trim() || firstName.length < 3 || firstName.length >= 31 ||  firstName.charAt(0) === ' ' || /^\d+$/.test(firstName);
}

export function checkLastNameIfEmptyAndSize(lastName) {
    return !lastName.trim() || lastName.length < 3 || lastName.length >= 61 ||  lastName.charAt(0) === ' '|| /^\d+$/.test(lastName);
}

export function checkIfProffesionEmpty(profession) {
    return profession === -1;
}

export function checkOnlyCharactersInText(text) {
    const onlyCharactersRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜç '`´]+$/;
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
    const age = getAge(userBirthDate);
    return Number(experience) + 16 > age;
}

export function checkIfImage(file) {
    return !file.type.startsWith("image/");
}

export function checkIfDateInFuture(date) {
    return new Date(date) > new Date();
}

export function checkIfBirthDateValid(date) {
    const age = getAge(date);
    return !(age >= 16 && age <= 80);
}

export function checkIfPointsPositive(points) {
    return points < 0;
}

export function checkIntegerPoints(points) {
    return !Number.isInteger(points);
}

export function checkNotStringPoints(points) {
    return typeof points !== 'number';
}

export function checkIfToManyPoints(yourPoints, pointsUsed) {
    return yourPoints < pointsUsed;
}

export function checkIfPointsMoreThanMoney(points, money) {
    // Hay un minimo de 0,50€ en Stripe, por eso al precio total se le resta 50 centimos
    return points > ((money * 100) - 50);
}

export function checkEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    return !emailRegex.test(email);
}


export function checkValidPassword(password) {
    const isPasswordLengthValid = password.length >= 8
    const passwordRegex = /^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_ñÑ]+$/
    return !passwordRegex.test(password) || !isPasswordLengthValid
}

export function checkfloatExperience(experience) {
    return !Number.isInteger(experience);

}

// Contrato

export function isValidDateTimeFormat(dateString) {
    const parsedDate = Date.parse(dateString)
    return !isNaN(parsedDate)
 }

export function notOnlyNumbers(text) {
    return (/^\d+$/.test(text));
}

export function checkIfPositive(number) {
    return number <= 0;
}

export function checkIfNumGreaterThanMax(num, max) {
    return (num > max);
}

export function isTextNotGreaterThan(text, max) {
    return text.length > max;
}

export function checkCostDecimal(cost){
    return !/^\d+(\.\d{1,2})?$/.test(cost);
}



export const errorMessages = {
    required: "Este campo es requerido.",
    cityLength: "La ciudad no debe tener más de 50 caracteres.",
    experienceNotValid: "La experiencia no puede ser menos que 0.",
    tooMuchExperience: "Ya que tu experiencia más 16 no puede ser mayor a tu edad.",
    floatExperience: "Por favor solo introduzca los años completos de experiencia",
    languageLength: "El idioma no debe tener más de 50 caracteres.",
    imageNotValid: "La imagen no es válida.",
    emailNotValid: "El correo electrónico no es válido.",
    usernameExists: "El nombre de usuario ya existe.",
    professionDuplicate: "No se pueden crear dos servicios con la misma profesión.",
    onlyCharacters: "Este campo solo puede contener letras.",
    dateInFuture: "La fecha no puede estar en el futuro.",
    birthDateNotValid: "Debes tener más de 16 años y menos de 80 años.",
    tooManyPoints: "Por favor, introduzca una cantidad de puntos que tengas disponibles.",
    positivePoints: "Por favor, introduzca un número de puntos positivos.",
    noMorePointsMoney: "El pago debe ser mínimo de 0'50€. No puedes canjear más puntos si eso hace que el precio sea menor de 0'50€.",
    usernameRequiredAndSize: "El nombre de usuario debe ser menos de 30 carácteres, más de 3 y no debe estar en blanco ni contener espacios.",
    nameRequiredAndSize: "El nombre debe ser menos de 30 carácteres, más de 3 y no debe estar en blanco, estar formado unicamente por números ni empezar con un espacio.",
    lastnameRequiredAndSize: "El apellido debe ser menos de 30 carácteres, más de 3 y no debe estar en blanco, estar formado unicamente por números ni empezar con un espacio.",
    termsNotAccepted: "Debes aceptar los términos y condiciones para continuar.",
    passwordNotValid: "La contraseña debe tener mínimo de 8 carácteres, una minúscula, una mayúscula, un número y uno de los siguientes carácteres especiales: ?=.*[@$!%*?&_",
    passwordNotEqual: "Las contraseñas no coinciden.",
    notIntegerPoints: "Por favor introduzca un número entero de puntos que gastar",
    notCorrectPoitns: "Por favor introduzca un número válido",

    // Contrato
    descriptionBig: "La descripción no puede superar los 500 caracteres.",
    startDateBeforeNow: "La fecha y hora de inicio debe ser posterior a la hora actual.",
    endDateBeforeStartDate: "La fecha y hora de fin debe ser posterior a la fecha y hora de inicio.",
    starDateLimit: "La fecha y hora de inicio no puede ser posterior a seis meses. Por favor, seleccione una fecha y hora de inicio más temprana.",
    costNegative: "El coste no puede ser negativo ni cero.",
    costBig: "El coste no puede ser mayor a 100000.",
    descriptionNotOnlyNumbers: "La descripción no puede contener solo números.",
    durationLessThanOneHour: "La duración del contrato debe ser mayor a una hora.",
    durationMoreThanEightHours: "La duración del contrato no puede ser mayor a ocho horas.",
    costDecimal: "El coste debe ser un numero, puede ser decimal. Ejemplo: 10.50",
}

export function getAge(date) {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}