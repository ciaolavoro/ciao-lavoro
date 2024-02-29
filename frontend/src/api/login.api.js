import axios from 'axios'

export const loginRequest = async (email, password) => {
    return axios.post('http://127.0.0.1:8000/user/login/', { email, password });
}
