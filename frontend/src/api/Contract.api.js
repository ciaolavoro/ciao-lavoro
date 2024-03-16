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

export const createContractRequest = async (worker, client, accept_worker, accept_client, description, initial_date, end_date, cost, status, service) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ worker, client, accept_worker, accept_client, description, initial_date, end_date, cost, status, service}),
    };
    return fetch(`${BACKEND_URL}/contracts/create/`, options);
}

export const getWorkerContracts = async (token) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            
        },
    };

    return fetch(`${BACKEND_URL}/contracts/workerList/`, options);
}

export const getClientContracts = async (token) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    };

    return fetch(`${BACKEND_URL}/contracts/clientList/`, options);
}