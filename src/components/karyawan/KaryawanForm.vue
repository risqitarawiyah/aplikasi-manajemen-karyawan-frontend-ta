<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">
          {{ mode === 'tambah' ? 'Tambah Karyawan' : 'Edit Karyawan' }}
        </h5>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="mode === 'tambah' ? tambahKaryawan() : updateKaryawan()">
        <div class="modal-body">
          <div class="mb-3">
            <label>Nama</label>
            <input type="text" v-model="form.nama" class="form-control" required />
          </div>

          <div v-if="mode === 'tambah'" class="mb-3">
            <label>Jenis Kelamin</label>
            <select v-model="form.jenis_kelamin" class="form-control" required>
              <option disabled value="">Pilih</option>
              <option value="L">L</option>
              <option value="P">P</option>
            </select>
          </div>

          <div class="mb-3">
            <label>Email</label>
            <input type="email" v-model="form.email" class="form-control" required />
          </div>

          <div class="mb-3">
            <label>No HP</label>
            <input type="tel" v-model="form.no_hp" class="form-control" required />
          </div>

          <div class="mb-3">
            <label>Alamat</label>
            <textarea v-model="form.alamat" class="form-control" rows="2" required></textarea>
          </div>

          <div class="mb-3">
            <label>Status Kepegawaian</label>
            <select v-model="form.status_kepegawaian" class="form-control" required>
              <option disabled value="">Pilih</option>
              <option value="PNS">PNS</option>
              <option value="NON_PNS">NON_PNS</option>
            </select>
          </div>

          <div class="mb-3">
            <label>Divisi</label>
            <select v-model="form.divisiId" class="form-control" required>
              <option disabled value="">Pilih Divisi</option>
              <option v-for="div in divisiList" :key="div.id" :value="div.id">
                {{ div.nama }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label>Jabatan</label>
            <select v-model="form.jabatanId" class="form-control" required>
              <option disabled value="">Pilih Jabatan</option>
              <option v-for="jab in jabatanList" :key="jab.id" :value="jab.id">
                {{ jab.nama }}
              </option>
            </select>
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
    dataEdit: Object
  },
  data() {
    return {
      form: {
        nama: '',
        jenis_kelamin: '',
        email: '',
        no_hp: '',
        alamat: '',
        status_kepegawaian: '',
        divisiId: '',
        jabatanId: ''
      },
      divisiList: [],
      jabatanList: []
    }
  },
  methods: {
    async fetchDropdowns() {
      try {
        const [divisiRes, jabatanRes] = await Promise.all([
          axios.get('/divisis'),
          axios.get('/jabatans')
        ])
        this.divisiList = divisiRes.data
        this.jabatanList = jabatanRes.data
      } catch (err) {
        console.error('Gagal memuat divisi/jabatan:', err)
      }
    },
    async tambahKaryawan() {
      const f = this.form
      if (!f.nama || !f.jenis_kelamin || !f.email || !f.no_hp || !f.alamat || !f.status_kepegawaian || !f.divisiId || !f.jabatanId) {
        alert('Semua field wajib diisi!')
        return
      }

      try {
        await axios.post('/karyawans', this.form)
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error('Gagal tambah karyawan:', err)
        alert('Gagal menambah karyawan.')
      }
    },
    async updateKaryawan() {
      const f = this.form
      if (!f.nama || !f.email || !f.no_hp || !f.alamat || !f.status_kepegawaian || !f.divisiId || !f.jabatanId) {
        alert('Semua field wajib diisi!')
        return
      }

      try {
        await axios.put(`/karyawans/${this.dataEdit.id}`, this.form)
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error('Gagal update karyawan:', err)
        alert('Gagal memperbarui data karyawan.')
      }
    }
  },
  mounted() {
    this.fetchDropdowns()

    if (this.mode === 'edit' && this.dataEdit) {
      const {
        nama, email, no_hp, alamat, status_kepegawaian,
        divisiId, jabatanId
      } = this.dataEdit

      this.form = {
        nama,
        jenis_kelamin: '', // hidden saat edit
        email,
        no_hp,
        alamat,
        status_kepegawaian,
        divisiId,
        jabatanId
      }
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.4);
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
  min-height: 0; /* penting untuk scroll */
}

.modal-header {
  background-color: #dbeeff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.modal-footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background-color: #f8f9fa; /* opsional, biar kelihatan */
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
}

select.form-control {
  appearance: auto;
}
</style>
