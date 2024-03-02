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