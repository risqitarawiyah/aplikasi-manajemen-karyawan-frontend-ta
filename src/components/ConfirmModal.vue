<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <div class="modal-header">
        <h5 class="modal-title">Konfirmasi</h5>
        <button type="button" class="close-btn" @click="$emit('cancel')">&times;</button>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('cancel')">Batal</button>
        <button class="btn btn-danger" @click="$emit('confirm')">Ya, Lanjutkan</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message']
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  background-color: #fff;
  width: 400px;
  border-radius: 8px;
  overflow: hidden;
}

.modal-header {
  background-color: #dbeeff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
}

.modal-footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
