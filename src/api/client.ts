import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.outofcontextmarketing.com',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('oocm_token')
  if (token) config.headers['x-access-token'] = token
  return config
})

export default client
