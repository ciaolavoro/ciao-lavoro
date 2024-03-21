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

export const createContractRequest = async (description, initial_date, end_date, cost,service_id, token) => {
    const options = {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({description, initial_date, end_date, cost, token}),
    };

    return fetch(`${BACKEND_URL}/contracts/create/${service_id}/`, options);
}

export async function updateContractStatus(contractId, statusNum,token) {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    };
    
    try {
        const response = await fetch(`${BACKEND_URL}/contracts/edit/${contractId}/${statusNum}/`, options);
        return response;
    } catch (error) {
        console.error('Update Contract Status error:', error);
    }
}

export const getContracts = async (token,end_date, initial_date, status) => {
    const queryParams = new URLSearchParams({ 
        end_date: end_date, 
        initial_date: initial_date,
        status: status,              
                                        });
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            
        },
    };

    return fetch(`${BACKEND_URL}/contracts/list/?${queryParams}`, options);

}