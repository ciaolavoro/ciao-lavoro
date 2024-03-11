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