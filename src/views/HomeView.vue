<template>
  <div class="home-view d-flex flex-column align-items-center justify-content-center min-vh-100 bg-custom">
    
    <!-- TAMPILKAN HANYA SAAT LOGIN -->
    <div class="text-center mb-4 welcome-text" v-if="activeComponent === 'Login'">
      <h1 class="display-5 fw-bold mb-2">Selamat Datang di MASDA</h1>
      <p class="lead mb-3">Aplikasi Manajemen Data Karyawan</p>
    </div>

    <div class="auth-container bg-light text-dark p-4 rounded shadow">
      <transition name="fade" mode="out-in">
        <component :is="activeComponent" @switch="setActiveComponent" />
      </transition>
    </div>
    
  </div>
</template>

<script>
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";

export default {
  components: { Login, Register },
  data() {
    return {
      activeComponent: "Login",
    };
  },
  mounted() {
    this.syncWithRoute();
  },
  watch: {
    '$route.name'() {
      this.syncWithRoute();
    }
  },
  methods: {
    syncWithRoute() {
      this.activeComponent = this.$route.name === 'Register' ? 'Register' : 'Login'
    },
    setActiveComponent(component) {
      this.activeComponent = component
      this.$router.push(component === 'Login' ? '/' : '/register')
    }
  }
}
</script>

<style scoped>
.home-view {
  background-color: #b0d4f1;
  min-height: 100vh;
  overflow: auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.welcome-text h1 {
  font-size: 2.5rem;
}

@media (max-width: 768px) {
  .welcome-text h1 {
    font-size: 1.8rem;
  }
}

/* Animasi Transisi */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
