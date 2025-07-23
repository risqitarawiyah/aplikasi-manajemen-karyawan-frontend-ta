<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <div class="modal-header">
        <h5 class="modal-title">Generate Laporan Otomatis</h5>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="generate">
        <div class="modal-body">
          <div class="mb-3">
            <label for="bulan">Bulan</label>
            <input type="number" v-model.number="bulan" min="1" max="12" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="tahun">Tahun</label>
            <input type="number" v-model.number="tahun" min="2000" max="2100" class="form-control" required />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Batal</button>
          <button type="submit" class="btn btn-primary">Proses</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  data() {
    return {
      bulan: '',
      tahun: ''
    };
  },
  methods: {
    async generate() {
      try {
        const res = await axios.post('/laporanabsensi/generate', {
          bulan: this.bulan,
          tahun: this.tahun
        });
        this.$emit('notif', 'Laporan berhasil digenerate!');
        this.$emit('close');
        this.$emit('generated'); // untuk trigger reload data
      } catch (err) {
        console.error(err);
        this.$emit('notif', 'Gagal membuat laporan otomatis.');
      }
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-box {
  background: white;
  width: 500px;
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
.modal-body {
  padding: 16px;
}
.modal-footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
}
</style>
