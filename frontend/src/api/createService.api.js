export const createServiceRequest = async (email, profession, city, experience) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, profession, city, experience }),
    };
    return fetch('/api/service/create/', options);
}