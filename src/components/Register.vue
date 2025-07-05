<template>
  <div class="register-card">
    <div class="card">
      <div class="card-header text-white bg-primary fw-bold text-center">
        Register
      </div>
      <div class="card-body">
        <form @submit.prevent="handleRegister">
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
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
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

          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Konfirmasi Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="form.confirmPassword"
              class="form-control"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary w-100 fw-bold">
            Register
          </button>
        </form>
      </div>
      <div class="card-footer text-center text-muted">
        Sudah punya akun?
        <router-link to="/login" class="text-decoration-none">Login disini</router-link>
      </div>
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

export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      notif: {
        message: '',
        type: 'success',
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
    async handleRegister() {
      if (this.form.password !== this.form.confirmPassword) {
        this.showNotif('Password dan konfirmasi tidak cocok!', 'error')
        return
      }

      try {
        await axios.post('/admins/register', {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password
        })

        this.showNotif('Registrasi berhasil!', 'success')
        setTimeout(() => this.$router.push('/login'), 1000)
      } catch (err) {
        const msg = err.response?.data?.message || 'Terjadi kesalahan saat registrasi.'
        this.showNotif(`Registrasi gagal: ${msg}`, 'error')
      }
    }
  }
}
</script>

<style scoped>
.register-card {
  max-width: 500px;
  margin: 0 auto;
  background-color: transparent;
  position: relative;
}

.card {
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
