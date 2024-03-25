import { fetchBackend } from "../utils/backendApi";

export async function updateUserRequest(userData, token) {
    const options = {
        method: 'PUT',
        headers: {
            'Authorization': `Token ${token}`,
        },
        body: userData,
    };

    try {
        const response = await fetchBackend(`/user/profile/`, options);
        return response;
    } catch (error) {
        console.error('Update user error:', error);
    }
}