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
            <input type="text" v-model="form.nama_karyawan" class="form-control" required />
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
            <label>Status</label>
            <select v-model="form.status_kepegawaian" class="form-control" required>
              <option disabled value="">Pilih</option>
              <option value="PNS">PNS</option>
              <option value="NON_PNS">NON_PNS</option>
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
        nama_karyawan: '',
        jenis_kelamin: '',
        email: '',
        no_hp: '',
        alamat: '',
        status_kepegawaian: ''
      }
    }
  },
  methods: {
    async tambahKaryawan() {
      if (
        !this.form.nama_karyawan ||
        !this.form.jenis_kelamin ||
        !this.form.email ||
        !this.form.no_hp ||
        !this.form.alamat ||
        !this.form.status_kepegawaian
      ) {
        alert('Semua field wajib diisi!')
        return
      }

      try {
        console.log('Form yang dikirim:', JSON.parse(JSON.stringify(this.form)))
        await axios.post('/karyawans', this.form)
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error('Gagal tambah karyawan:', err)
        alert('Gagal menambah karyawan. Cek kembali data yang diisi.')
      }
    },

    async updateKaryawan() {
      if (
        !this.form.nama_karyawan ||
        !this.form.email ||
        !this.form.no_hp ||
        !this.form.alamat ||
        !this.form.status_kepegawaian
      ) {
        alert('Semua field wajib diisi!')
        return
      }

      try {
        await axios.put(`/karyawans/${this.dataEdit.karyawan_id}`, this.form)
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error('Gagal update karyawan:', err)
        alert('Gagal memperbarui data karyawan.')
      }
    }
  },
  mounted() {
    if (this.mode === 'edit' && this.dataEdit) {
      const { nama_karyawan, email, no_hp, alamat, status_kepegawaian } = this.dataEdit
      this.form = { nama_karyawan, email, no_hp, alamat, status_kepegawaian }
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
