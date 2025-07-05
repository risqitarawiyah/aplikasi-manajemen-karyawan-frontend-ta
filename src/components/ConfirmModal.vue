<template>
  <div class="modal-backdrop">
    <div class="modal-container shadow-sm">
      <h5 class="mb-3">Konfirmasi</h5>
      <p>{{ pesan }}</p>
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary me-2" @click="$emit('batal')">Batal</button>
        <button class="btn btn-danger" @click="$emit('konfirmasi')">Ya, Lanjutkan</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pesan: {
      type: String,
      default: 'Apakah Anda yakin ingin melanjutkan aksi ini?'
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-container {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}
</style>
