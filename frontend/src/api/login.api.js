import { fetchBackend } from "../utils/backendApi";

export const loginRequest = async (username, password) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    };
    try {
        const response = await fetchBackend(`/user/login/`, options);
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);
        return data;
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
    return fetchBackend(`/user/authenticated/`, options);
};

export const logoutRequest = async () => {
    localStorage.removeItem('token');
};

export const registerRequest = async (username, password, firstName, lastName, email, image, birthdate, language) => {

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('image', image);
    formData.append('birthdate', birthdate);
    formData.append('language', language);
    const options = {
        method: 'POST',
        body: formData
    };
    try {
        const response = await fetchBackend(`/user/register/`, options);
        const data = await response.json();

        if (response.ok) {
            return data;
        } else if (response.status === 400 && data === 'El nombre de usuario ya está en uso') {
            throw new Error(data);
        } else {
            throw new Error("Ha ocurrido un error en el registro");
        }
    } catch (error) {
        console.error('Registro error:', error);
        throw error;
    }
};
