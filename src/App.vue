<template>
  <div class="app">
    <!-- Notifikasi Token -->
    <div v-if="showNotif" class="notif-warning">
      {{ notifMessage }}
    </div>

    <Header v-if="showLayout" @toggleSidebar="sidebarVisible = !sidebarVisible" />
    <div class="main-layout" v-if="showLayout">
      <transition name="slide" appear>
        <keep-alive>
          <Sidebar v-if="sidebarVisible" />
        </keep-alive>
      </transition>

      <router-view class="content" />
    </div>
    <router-view v-else />
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import { getTokenRemainingTime } from '@/utils/token'

export default {
  components: { Header, Sidebar },
  data() {
    return {
      sidebarVisible: true,
      currentRouteName: this.$route.name,
      showNotif: false,
      notifMessage: '',
      tokenCheckInterval: null
    }
  },
  computed: {
    showLayout() {
      const authNames = ['Login', 'Register']
      return !authNames.includes(this.currentRouteName)
    }
  },
  watch: {
    '$route.name'(newName) {
      this.currentRouteName = newName
    }
  },
  methods: {
    cekToken() {
      const token = localStorage.getItem('token')
      if (!token) return

      const remaining = getTokenRemainingTime(token)

      if (remaining <= 120 && remaining > 0 && !this.showNotif) {
        this.notifMessage = '⚠️ Sesi Anda hampir habis. Silakan login ulang untuk menghindari logout otomatis.'
        this.showNotif = true
        setTimeout(() => {
          this.showNotif = false
        }, 5000)
      }

      if (remaining <= 0) {
        this.notifMessage = '⛔ Sesi Anda telah habis. Silakan login ulang.'
        this.showNotif = true
        localStorage.removeItem('token')
        setTimeout(() => {
          this.showNotif = false
          this.$router.push('/login')
        }, 2500)
      }
    }
  },
  mounted() {
    this.cekToken()
    this.tokenCheckInterval = setInterval(this.cekToken, 30000)
  },
  beforeUnmount() {
    clearInterval(this.tokenCheckInterval)
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-layout {
  display: flex;
  flex: 1;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f4f6f8;
  overflow-y: auto;
}

/* Sidebar transition animation */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-enter-to, .slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* notif token */
.notif-warning {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff3cd;
  color: #664d03;
  padding: 12px 20px;
  border: 1px solid #ffeeba;
  border-radius: 6px;
  z-index: 9999;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>