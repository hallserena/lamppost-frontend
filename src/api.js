// API configuration
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://lamppost-api-production.up.railway.app',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (!config.url.endsWith('/')) {
    config.url = config.url + '/'
  }
  return config
})

export default api