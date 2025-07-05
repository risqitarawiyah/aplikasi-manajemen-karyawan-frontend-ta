<template>
  <div class="modal-backdrop">
    <div class="modal-container shadow-sm">
      <h5 class="mb-3">{{ formData.id ? 'Edit' : 'Tambah' }} Divisi</h5>

      <form @submit.prevent="simpan">
        <div class="mb-3">
          <label class="form-label fw-bold">ID Karyawan</label>
          <input type="number" class="form-control" v-model.number="formData.karyawan_id" required />
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Divisi</label>
          <input type="text" class="form-control" v-model="formData.divisi" required />
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Posisi</label>
          <input type="text" class="form-control" v-model="formData.posisi" required />
        </div>

        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-secondary me-2" @click="$emit('close')">Batal</button>
          <button type="submit" class="btn btn-success">Simpan</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios'

export default {
  props: {
    dataAwal: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        id: null,
        karyawan_id: '',
        divisi: '',
        posisi: ''
      }
    }
  },
  mounted() {
    if (this.dataAwal && Object.keys(this.dataAwal).length > 0) {
      this.formData = { ...this.dataAwal }
    }
  },
  methods: {
    async simpan() {
      try {
        if (this.formData.id) {
          await axios.put(`/divisis/${this.formData.id}`, this.formData)
        } else {
          await axios.post('/divisis', this.formData)
        }
        this.$emit('saved')
      } catch (err) {
        console.error('Gagal menyimpan data divisi:', err)
        alert('Gagal menyimpan data. Silakan periksa kembali.')
      }
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
  max-width: 500px;
}
</style>
