import axios from 'axios'
import { clearToken, getToken } from './token'

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:3000/api/v1'

export const http = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})


http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? ''
      const isSessionCheck = url.endsWith('/auth/me')
      const isLoginOrRegister =
        url.endsWith('/auth/login') || url.endsWith('/auth/register')

      if (!isLoginOrRegister) {
        clearToken()
      }
      if (!isSessionCheck && !isLoginOrRegister) {
        window.dispatchEvent(new Event('auth:unauthorized'))
      }
    }

    return Promise.reject(error)
  },
)