const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;


export const getUserLogged = async () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    };

    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/edit/`, options);
}



export const getUserById = async (id) => {
    
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${BACKEND_URL}/user/${id}`, options);
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