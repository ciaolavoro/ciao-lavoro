export const getAllContracts = async () => {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/contracts/`, options);
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