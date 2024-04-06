import { fetchBackend } from "../utils/backendApi";

export const getUserLogged = async () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    };

    return fetchBackend(`/user/edit/`, options);
}

export const getUserById = async (id) => {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (typeof id !== 'number' || !Number.isInteger(id)) {
        return fetchBackend(`${id}`, options);
    } else {
        return fetchBackend(`/user/${id}`, options);
    }
}

export const getServiceByUser = async (id) => {
    const options = {
        method: 'Get',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return fetchBackend(`/service/user/${id}`, options);
}

export const getServiceByCityAndProfession = async (city, profession, username) => {

    const queryParams = new URLSearchParams({
        search_city: city,
        search_profession: profession,
        search_username: username
    });

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetchBackend(`/service/?${queryParams}`, options);
}

export const getAllServices = async () => {


    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetchBackend(`/service`, options);
}

export const createServiceRequest = async (email, profession, city, experience, token) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ email, profession, city, experience }),
    };
    return fetchBackend(`/service/create/`, options);
}

export async function updateServiceRequest(serviceId, serviceData, token) {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(serviceData),
    };

    try {
        const response = await fetchBackend(`/service/${serviceId}/edit/`, options);
        return response;
    } catch (error) {
        console.error('Update service error:', error);
    }
}

export const getJobDetailsByServiceId = async (id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetchBackend(`/service/${id}/jobs/`, options);
}

export const createServiceReview = async (service_id, rating, description, token) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ rating, description }),
    };
    return fetchBackend(`/service/${service_id}/create/review/`, options);
}

export const getProfessionsList = async (token) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    };
    return fetchBackend(`/service/professionsList/`, options);
}

export const getAllProfessionsList = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return fetchBackend(`/service/allProfessionsList/`, options);
}
