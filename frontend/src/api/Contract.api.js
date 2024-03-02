export const getAllContracts = async () => {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch('/api/contracts/', options);
}

export const getAllUsers = async () => {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch('/api/user/', options);
}

export const getAllServices = async () => {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch('/api/service/', options);
}

export const createContractRequest = async (worker, client, accept_worker, accept_client, description, initial_date, end_date, cost, status, service) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ worker, client, accept_worker, accept_client, description, initial_date, end_date, cost, status, service}),
    };
    return fetch('/api/contracts/create/', options);
}