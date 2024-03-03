export const loginRequest = async (email, password) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    };
    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/login/`, options);
}