const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
export const createJobRequest = async (name,estimated_price,serviceId,token) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ name,estimated_price }),
    };
    return fetch(`${BACKEND_URL}/service/create/${serviceId}/jobs/`, options);
}
export async function updateJobRequest(jobId, jobData,token) {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(jobData),
    };
    
    try {
        const response = await fetch(`${BACKEND_URL}/service/edit/jobs/${jobId}`, options);
        return response;
    } catch (error) {
        console.error('Update job error:', error);
    }
}