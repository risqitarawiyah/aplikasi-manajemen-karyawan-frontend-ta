<template>
  <header class="navbar navbar-expand-lg bg-primary px-3 py-2 shadow-sm">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <!-- Tombol Menu (hamburger) -->
      <button class="btn btn-sm text-white" @click="$emit('toggleSidebar')">
        <i class="bi bi-list" style="font-size: 1.4rem;"></i>
      </button>

      <!-- Judul Aplikasi -->
      <span class="navbar-brand mb-0 h5 text-white fw-bold">MASDA</span>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
.navbar {
  height: 50px;
}
</style>
