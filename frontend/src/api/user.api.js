const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export async function updateUserRequest(userId, userData, token) {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: userData,
    };
    
    try {
        const response = await fetch(`${BACKEND_URL}/user/edit/`, options);
        return response;
    } catch (error) {
        console.error('Update user error:', error);
    }
}