const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export const loginRequest = async (username, password) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    };
    try {
        const response = await fetch(`${BACKEND_URL}/user/login/`, options);
        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
    }
  };


export const isAuthenticated = async () => {
    const token = localStorage.getItem('token');

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    };
    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/authenticated/`, options);
};

export const logoutRequest = async () => {
    localStorage.removeItem('token');
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
};
