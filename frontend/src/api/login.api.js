export const loginRequest = async (username, password) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password }),
    };
    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/login/`, options);
}

export const isAuthenticated = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/authenticated/`, options);
}

export const logoutRequest = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/logout/`, options);
};

export const registerRequest = async (username, password,firstName,lastName,email,image,birthdate) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password,firstName,lastName,email,image,birthdate }),
    };
    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/register/`, options);
}