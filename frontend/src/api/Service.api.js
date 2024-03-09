export const getAllServices = async () => {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/service/`, options);
}

export const getUserById = async (id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/${id}`, options);
}

export const getServiceByUser = async (id) => {
    const options = {
        method: 'Get',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/service/user/${id}`, options);
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