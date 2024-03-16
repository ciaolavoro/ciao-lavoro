const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export const getAllUsers = async () => {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${BACKEND_URL}/user/`, options);
}

export const getAllServices = async () => {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${BACKEND_URL}/service/`, options);
}

export const createContractRequest = async (description, initial_date, end_date, cost,service_id) => {
    const token = localStorage.getItem('token');
    const options = {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({description, initial_date, end_date, cost}),
    };
    console.log(token)
    return fetch(`${BACKEND_URL}/contracts/create/${service_id}/`, options);
}