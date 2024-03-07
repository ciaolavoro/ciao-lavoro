export const loginRequest = async (username, password) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password }),
    };
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/login/`, options);
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

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
}

export const logoutRequest = async () => {
    localStorage.removeItem('token');
};

