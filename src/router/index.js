import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue' // ⬅️ Tambahkan ini
import Dashboard from '../views/Dashboard.vue'
import Admin from '../views/Admin.vue'
import Karyawan from '../views/Karyawan.vue'
import Divisi from '../views/Divisi.vue'
import Laporan from '../views/Laporan.vue'

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    return payload.exp < now
  } catch (err) {
    return true
  }
}

const routes = [
  { path: '/', name: 'Login', component: HomeView, alias: '/login' },        // ⬅️ ke HomeView
  { path: '/register', name: 'Register', component: HomeView }, // ⬅️ ke HomeView
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAuth: true } },
  { path: '/karyawan', name: 'Karyawan', component: Karyawan, meta: { requiresAuth: true } },
  { path: '/divisi', name: 'Divisi', component: Divisi, meta: { requiresAuth: true } },
  { path: '/laporan', name: 'Laporan', component: Laporan, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/')
  } else if ((to.name === 'Login' || to.name === 'Register') && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
