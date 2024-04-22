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

export async function getUserPoints(token) {
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
        },
    };

    try {
        const response = await fetchBackend(`/user/getPoints/`, options);
        const data = await response.json();
        return data.total_points; 
    } catch (error) {
        console.error('Get user points error:', error);
        return null;
    }
}