<template>
  <div class="login-card">
      <div class="card-header text-black fw-bold text-center">
        Login
      </div>
      <div class="card-body">
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              id="username"
              v-model="form.username"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              class="form-control"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary w-100 fw-bold">
            Login
          </button>
        </form>
      </div>
      <div class="card-footer text-center text-muted">
        Belum punya akun?
        <router-link to="/register" class="text-decoration-none">Register disini</router-link>
      </div>

    <!-- Notifikasi -->
    <transition name="fade">
      <div v-if="notif.visible" :class="['notif', notif.type]">
        {{ notif.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import axios from '@/utils/axios'
import { useAuthStore } from '@/store/authStore'

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      notif: {
        message: '',
        type: 'success', // 'success' | 'error'
        visible: false
      }
    }
  },
  methods: {
    showNotif(message, type = 'success') {
      this.notif.message = message
      this.notif.type = type
      this.notif.visible = true
      setTimeout(() => {
        this.notif.visible = false
      }, 3000)
    },
    async handleLogin() {
      try {
        const res = await axios.post('/admins/login', {
          username: this.form.username,
          password: this.form.password
        })

        const { token, username } = res.data.data
        const auth = useAuthStore()
        auth.login(token, username)

        this.showNotif('Login berhasil!', 'success')
        setTimeout(() => this.$router.push('/dashboard'), 1000)
      } catch (err) {
        this.showNotif('Username atau password salah', 'error')
      }
    }
  }
}
</script>

<style scoped>
.login-card {
  max-width: 500px;
  margin: 0 auto;
  background-color: transparent;
  position: relative;
}

.card-header {
  font-size: 1.2rem;
  padding: 0.75rem;
}

.card-footer {
  font-size: 0.9rem;
  padding: 0.75rem;
}

/* Notifikasi styling */
.notif {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 6px;
  color: white;
  z-index: 9999;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.notif.success {
  background-color: #28a745;
}
.notif.error {
  background-color: #dc3545;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
