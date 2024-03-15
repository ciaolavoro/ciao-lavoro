const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;


export const getUserLogged = async () => {
    const token = localStorage.getItem('token');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    };

    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/edit/`, options);
}



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

export const getServiceByUser = async (id) => {
    const options = {
        method: 'Get',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return fetch(`${import.meta.env.VITE_BACKEND_API_URL}/service/user/${id}`, options);
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

export async function getJobDetails() {
    // Aquí deberías hacer una llamada a tu API para obtener los detalles del trabajo por el ID del servicio
    // Supongamos que obtienes los detalles de dos trabajos por el ID del servicio
    const job1 = { "id": 1,
    "name": "Arreglo grifos",
    "estimated_price": "0.06",
    "service": 1 }; // Ejemplo de datos de trabajo 1
    const job2 = { "id": 2,
    "name": "Arreglo tuberias",
    "estimated_price": "0.08",
    "service": 1 }; // Ejemplo de datos de trabajo 2
    

    // Retorna los detalles de los dos trabajos
    return [job1, job2];
}

export async function updateServiceRequest(serviceId, serviceData,token) {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: serviceData,
    };
    
    try {
        const response = await fetch(`${BACKEND_URL}/service/${serviceId}/`, options);
        return response;
    } catch (error) {
        console.error('Update service error:', error);
    }
}