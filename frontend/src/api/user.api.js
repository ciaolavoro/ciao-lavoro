const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export async function updateUserRequest(userData, token) {
    const options = {
        method: 'PUT',
        headers: {
            'Authorization': `Token ${token}`,
        },
        body: userData,
    };
    
    try {
        const response = await fetch(`${BACKEND_URL}/user/profile/`, options);
        return response;
    } catch (error) {
        console.error('Update user error:', error);
    }
}

export async function getUserRequest(token) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    };
    
    try {
        const response = await fetch(`${BACKEND_URL}/user/profile/`, options);
        return response.json();
    } catch (error) {
        console.error('Update user error:', error);
    }
}