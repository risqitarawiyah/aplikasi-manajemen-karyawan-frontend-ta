<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">
          {{ mode === 'tambah' ? 'Tambah Status Kepegawaian' : 'Edit Status Kepegawaian' }}
        </h5>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="mode === 'tambah' ? tambahStatus() : updateStatus()">
        <div class="modal-body">
          <div class="mb-3">
            <label>Nama Status</label>
            <input
              type="text"
              v-model="form.nama"
              class="form-control"
              placeholder="Misal: PNS / NON_PNS"
              required
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Batal</button>
          <button type="submit" class="btn btn-primary">
            {{ mode === 'tambah' ? 'Tambah' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios'

export default {
  props: {
    mode: String,
    dataStatus: Object
  },
  data() {
    return {
      form: {
        nama: ''
      }
    }
  },
  methods: {
    async tambahStatus() {
      try {
        await axios.post('/statuskepegawaian', this.form)
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error('Gagal menambah status:', err)
        alert('Gagal menambah status kepegawaian.')
      }
    },
    async updateStatus() {
      try {
        await axios.put(`/statuskepegawaian/${this.dataStatus.id}`, this.form)
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error('Gagal memperbarui status:', err)
        alert('Gagal memperbarui status kepegawaian.')
      }
    }
  },
  mounted() {
    if (this.mode === 'edit' && this.dataStatus) {
      this.form.nama = this.dataStatus.nama
    }
  }
}
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
  max-height: 90vh;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.modal-box form {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.modal-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}
.modal-header {
  background-color: #dbeeff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
}
.modal-footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background-color: #f8f9fa;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
}
</style>
