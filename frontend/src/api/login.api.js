import axios from 'axios'

export const loginRequest = async (email, password) => {
    return axios.post('http://localhost:8000/user/login/', { email, password });
}