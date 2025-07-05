<template>
  <div class="app">
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

export default {
  components: { Header, Sidebar },
  data() {
    return {
      sidebarVisible: true,
      currentRouteName: this.$route.name
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
</style>
