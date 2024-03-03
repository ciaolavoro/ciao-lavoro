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

    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/users/`, options);
}