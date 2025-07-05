// src/utils/axios.js
import axios from 'axios'
import router from '@/router'  // pastikan kamu sudah punya ini

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
})

// Tambahkan token ke setiap request
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`  // HARUS pakai "Bearer"
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Tangani error global, termasuk token expired
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const msg = error.response.data?.message

      if (msg === 'jwt expired') {
        alert('Sesi Anda telah berakhir. Silakan login kembali.')

        // Hapus token lama
        localStorage.removeItem('token')

        // Arahkan user ke login
        router.push('/login')
      }
    }

    return Promise.reject(error)
  }
)

export default instance