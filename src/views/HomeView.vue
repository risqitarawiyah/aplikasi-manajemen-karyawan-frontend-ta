<template>
  <div class="home-view d-flex flex-column align-items-center justify-content-center min-vh-100 bg-custom">
    <div class="text-center mb-4 welcome-text">
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
import { useRoute } from 'vue-router'; // ini boleh tetap kalau kamu mau pakai Composition API nanti

export default {
  components: {
    Login,
    Register,
  },
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
      const routeName = this.$route.name;
      if (routeName === 'Register') {
        this.activeComponent = 'Register';
      } else {
        this.activeComponent = 'Login';
      }
    },
    setActiveComponent(component) {
      this.activeComponent = component;
      if (component === 'Login') this.$router.push('/');
      else if (component === 'Register') this.$router.push('/register');
    }
  }
};
</script>

<style scoped>
.home-view {
  background-color: #b0d4f1;
  min-height: 100vh;
  overflow: auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.auth-container {
  width: 100%;
  max-width: 400px;
}
.welcome-text h1 {
  font-size: 2.5rem;
}
@media (max-width: 768px) {
  .auth-container {
    padding: 15px;
  }
  .welcome-text h1 {
    font-size: 1.8rem;
  }
}
</style>
