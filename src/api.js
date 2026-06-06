import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
})

// Automatically attach the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Ensure URLs always end with a trailing slash
  if (!config.url.endsWith('/')) {
    config.url = config.url + '/'
  }
  return config
})

export default api