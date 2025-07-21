import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue' // ⬅️ Tambahkan ini
import Dashboard from '../views/Dashboard.vue'
import Karyawan from '../views/Karyawan.vue'
import Divisi from '../views/Divisi.vue'
import Jabatan from '../views/Jabatan.vue'
import WaliKelas from '../views/WaliKelas.vue'
import Guru from '../views/Guru.vue'
import Mapel from '@/views/Mapel.vue'
import Absensi from '../views/Absensi.vue'
import LaporanAbsensi from '../views/LaporanAbsensi.vue'

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
  { path: '/karyawan', name: 'Karyawan', component: Karyawan, meta: { requiresAuth: true } },
  { path: '/divisi', name: 'Divisi', component: Divisi, meta: { requiresAuth: true } },
  { path: '/jabatan', name: 'Jabatan', component: Jabatan, meta: { requiresAuth: true } },
  { path: '/guru', name: 'Guru', component: Guru, meta: { requiresAuth: true } },
  { path: '/mapel', name: 'Mapel', component: Mapel, meta: { requiresAuth: true } },
  { path: '/walikelas', name: 'WaliKelas', component: WaliKelas, meta: { requiresAuth: true } },
  { path: '/absensi', name: 'Absensi', component: Absensi, meta: { requiresAuth: true } },
  { path: '/laporanabsensi', name: 'LaporanAbsensi', component: LaporanAbsensi, meta: { requiresAuth: true } }
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
