import axios from 'axios'

export const getAllContracts = () => {
    return axios.get('http://localhost:8000/contracts')
}

export const getAllUser = () => {
    return axios.get('http://localhost:8000/user/')
}