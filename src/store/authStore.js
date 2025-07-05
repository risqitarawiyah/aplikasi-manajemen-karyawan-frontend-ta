// src/store/authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    peran: localStorage.getItem('role') || ''
  }),
  actions: {
    login(token, peran) {
      this.token = token
      this.peran = peran
      localStorage.setItem('token', token)
      localStorage.setItem('role', peran)
    },
    logout() {
      this.token = ''
      this.peran = ''
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
  }
})
