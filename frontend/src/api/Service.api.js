import axios from 'axios'

export const getAllServices = () => {
    return axios.get('http://127.0.0.1:8000/service/')
}

export const getAllUser = () => {
    return axios.get('http://localhost:8000/user/')
}