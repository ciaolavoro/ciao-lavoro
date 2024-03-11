const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export const getUserById = async (id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${BACKEND_URL}/user/${id}`, options);
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

    return fetch(`${BACKEND_URL}/service/?${queryParams}`, options);
}

export const createServiceRequest = async (email, profession, city, experience) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, profession, city, experience }),
    };
    return fetch(`${BACKEND_URL}/service/create/`, options);
}