<template>
  <div class="container mt-4">
    <h3 class="fw-bold">{{ isEdit ? 'Edit' : 'Tambah' }} Karyawan</h3>

    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="form-label fw-bold">Nama Karyawan</label>
            <input
              type="text"
              class="form-control"
              v-model="form.nama_karyawan"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Status Kepegawaian</label>
            <select class="form-select" v-model="form.status_kepegawaian" required>
              <option disabled value="">Pilih Status</option>
              <option>Aktif</option>
              <option>Nonaktif</option>
              <option>Cuti</option>
            </select>
          </div>
          <button type="submit" class="btn btn-success">
            <i class="bi bi-save"></i> Simpan
          </button>
          <button type="button" class="btn btn-secondary ms-2" @click="$router.back()">
            Batal
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios'

export default {
    data() {
        return {
      form: {
        nama_karyawan: '',
        status_kepegawaian: ''
      },
      isEdit: false,
      id: null
    }
  },
  methods: {
    async fetchData() {
      try {
        const res = await axios.get(`/karyawans/${this.id}`)
        this.form = {
          nama_karyawan: res.data.nama_karyawan,
          status_kepegawaian: res.data.status_kepegawaian
        }
      } catch (err) {
        console.error('Gagal mengambil data:', err)
      }
    },
    async submitForm() {
      try {
        if (this.isEdit) {
          await axios.put(`/karyawans/${this.id}`, this.form)
        } else {
          await axios.post('/karyawans', this.form)
        }
        this.$router.push('/karyawan')
      } catch (err) {
        console.error('Gagal menyimpan data:', err)
      }
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.isEdit = !!this.id
    if (this.isEdit) {
      this.fetchData()
    }
  }
}
</script>
