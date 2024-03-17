const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export async function updateUserRequest(userId, userData) {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: userData,
    };
    
    try {
        const response = await fetch(`${BACKEND_URL}/user/${userId}/`, options);
        return response;
    } catch (error) {
        console.error('Update user error:', error);
    }
}