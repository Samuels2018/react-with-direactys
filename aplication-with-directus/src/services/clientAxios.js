import axios from 'axios'

const clientAxios = axios.create({
  baseURL: 'http://localhost:8055',
  headers: {
    'Content-Type': 'application/json',
    //Authorization: `Bearer ${localStorage.getItem('access_token')}`
  }
})

export default clientAxios