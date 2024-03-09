export const getAllServices = async () => {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/service/`, options);
}

export const getAllUsers = async () => {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/`, options);
}

export const getServiceByCityAndProfession = async (city, profession) => {

    const queryParams = new URLSearchParams({ 
        search_city: city, 
        search_profession: profession });

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/service/?${queryParams}`, options);
}