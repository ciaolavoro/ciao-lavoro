const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export const getUserById = async (id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (typeof id !== 'number' || !Number.isInteger(id)) {
        // El id no es un número entero
        return fetch(`${id}`, options);
    } else {
        // El id es un número entero
        return fetch(`${BACKEND_URL}/user/${id}`, options);
    }  
}

export const getServiceByCityAndProfession = async (city, profession) => {

    const queryParams = new URLSearchParams({ 
        search_city: city, 
        search_profession: profession });

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${BACKEND_URL}/service/?${queryParams}`, options);
}

export const createServiceRequest = async (email, profession, city, experience) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, profession, city, experience }),
    };
    return fetch(`${BACKEND_URL}/service/create/`, options);
}


export const getServiceDetailsById = async (id) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(`${BACKEND_URL}/service/${id}`, options);

        if (!response.ok) {
            throw new Error('Error al obtener los detalles del servicio');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error al obtener los detalles del servicio: ${error.message}`);
    }
}

export const getJobDetailsByServiceId = async (id) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(`${BACKEND_URL}/job/${id}`, options);

        if (!response.ok) {
            throw new Error('Error al obtener los detalles del trabajo');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error al obtener los detalles del trabajo: ${error.message}`);
    }
}

export async function getJobDetailsByServiceId2(serviceId) {
    // Aquí deberías hacer una llamada a tu API para obtener los detalles del trabajo por el ID del servicio
    // Retorna los detalles del trabajo
    return { name: "Trabajo de ejemplo", estimated_price: 100 }; // Ejemplo de datos de trabajo
}

export async function updateServiceRequest(serviceId, serviceData,token) {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(serviceData),
    };
    
    try {
        const response = await fetch(`${BACKEND_URL}/service/${serviceId}/`, options);
        return response;
    } catch (error) {
        console.error('Update service error:', error);
    }
}