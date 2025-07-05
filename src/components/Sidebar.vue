<template>
  <div class="sidebar bg-white border-end d-flex flex-column justify-content-between vh-100 px-3 py-4">
    <!-- Profil Admin -->
    <div>
      <div class="text-center mb-4">
        <img src="/avatar.jpeg" class="rounded-circle" width="80" />
        <h6 class="mt-2 fw-bold">Tarawiyah</h6>
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
      <button class="btn btn-outline-danger w-100" @click="logout">
        <i class="bi bi-box-arrow-right me-1"></i> Logout
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { label: 'Dashboard', path: '/dashboard', icon: 'bi bi-speedometer2' },
        { label: 'Admin', path: '/admin', icon: 'bi bi-person-badge' },
        { label: 'Karyawan', path: '/karyawan', icon: 'bi bi-people' },
        { label: 'Divisi', path: '/divisi', icon: 'bi bi-diagram-3' },
        { label: 'Laporan', path: '/laporan', icon: 'bi bi-file-earmark-text' }
      ]
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
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
