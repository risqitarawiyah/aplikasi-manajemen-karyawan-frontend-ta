<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">
          {{ mode === 'tambah' ? 'Tambah Divisi' : 'Edit Divisi' }}
        </h5>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="mode === 'tambah' ? tambahDivisi() : updateDivisi()">
        <div class="modal-body">
          <div class="mb-3">
            <label>Nama Divisi</label>
            <select v-model="form.nama_divisi" class="form-control" required>
              <option disabled value="">Pilih</option>
              <option value="Manajemen Sekolah">Manajemen Sekolah</option>
              <option value="Kesiswaan">Kesiswaan</option>
              <option value="Administrasi">Administrasi</option>
              <option value="Kependidikan">Kependidikan</option>
              <option value="Guru">Guru</option>
              <option value="Keamanan">Keamanan</option>
            </select>
          </div>

          <div class="mb-3">
            <label>Posisi</label>
            <input type="text" v-model="form.posisi" class="form-control" required />
          </div>

          <div class="mb-3">
            <label>Karyawan</label>
            <select v-model="form.karyawan_id" class="form-control" required>
              <option disabled value="">Pilih</option>
              <option v-for="k in daftarKaryawan" :key="k.karyawan_id" :value="k.karyawan_id">
                {{ k.nama_karyawan }}
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
        nama_divisi: '',
        posisi: '',
        karyawan_id: ''
      },
      daftarKaryawan: []
    }
  },
  methods: {
    async tambahDivisi() {
      if (!this.form.nama_divisi || !this.form.posisi || !this.form.karyawan_id) {
        alert('Semua field wajib diisi!')
        return
      }

      try {
        await axios.post('/divisis', this.form)
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error('Gagal tambah divisi:', err)
        alert('Gagal menambah divisi. Cek kembali data yang diisi.')
      }
    },

    async updateDivisi() {
      if (!this.form.nama_divisi || !this.form.posisi || !this.form.karyawan_id) {
        alert('Semua field wajib diisi!')
        return
      }

      try {
        await axios.put(`/divisis/${this.dataEdit.divisi_id}`, this.form)
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error('Gagal update divisi:', err)
        alert('Gagal memperbarui data divisi.')
      }
    },

    async ambilKaryawan() {
      try {
        const res = await axios.get('/karyawans')
        this.daftarKaryawan = res.data
      } catch (err) {
        console.error('Gagal mengambil daftar karyawan:', err)
      }
    }
  },
  mounted() {
    this.ambilKaryawan()

    if (this.mode === 'edit' && this.dataEdit) {
      const { nama_divisi, posisi, karyawan_id } = this.dataEdit
      this.form = { nama_divisi, posisi, karyawan_id }
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

select.form-control {
  appearance: auto;
}
</style>
