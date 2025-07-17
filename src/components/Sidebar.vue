<template>
  <div class="sidebar bg-white border-end d-flex flex-column justify-content-between vh-100 px-3 py-4">
    <!-- Profil Admin -->
    <div>
      <div class="text-center mb-4">
        <img src="/avatar.jpeg" class="rounded-circle" width="80" />
        <h6 class="mt-2 fw-bold">{{ auth.username }}</h6>
        <p class="text-muted small">Administrator</p>
      </div>

      <!-- Menu Navigasi -->
      <ul class="nav flex-column">
        <li class="nav-item mb-2" v-for="item in menuItems" :key="item.label">
          <router-link :to="item.path" class="nav-link d-flex align-items-center" active-class="active">
            <i :class="item.icon" class="me-2"></i> {{ item.label }}
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Logout -->
    <div class="text-center">
      <button class="btn btn-outline-danger w-100" @click="handleLogout">
        <i class="bi bi-box-arrow-right me-1"></i> Logout
      </button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/authStore'

export default {
  setup() {
    const auth = useAuthStore()
    return { auth }
  },
  data() {
    return {
      menuItems: [
        { label: 'Dashboard', path: '/dashboard', icon: 'bi bi-speedometer2' },
        { label: 'Karyawan', path: '/karyawan', icon: 'bi bi-people' },
        { label: 'Divisi', path: '/divisi', icon: 'bi bi-diagram-3' },
        { label: 'Jabatan', path: '/jabatan', icon: 'bi bi-briefcase' },
        { label: 'Wali Kelas', path: '/walikelas', icon: 'bi bi-person-lines-fill' },
        { label: 'Absensi', path: '/absensi', icon: 'bi bi-calendar-check' },
        { label: 'Laporan Absensi', path: '/laporanabsensi', icon: 'bi bi-journal-text' }
      ]
    }
  },
  methods: {
    handleLogout() {
      const auth = useAuthStore()
      auth.logout()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 240px;
}

.nav-link {
  color: #333;
  font-weight: 500;
}

.nav-link.active {
  background-color: #e7f1ff;
  border-radius: 6px;
  font-weight: bold;
  color: #0d6efd;
}
</style>