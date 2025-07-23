<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">
          {{ mode === 'tambah' ? 'Tambah Kelas' : 'Edit Kelas' }}
        </h5>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Tingkat</label>
            <input
              type="number"
              v-model.number="form.tingkat"
              class="form-control"
              required
              min="1"
              placeholder="Contoh: 10"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Jurusan</label>
            <input
              type="text"
              v-model="form.jurusan"
              class="form-control"
              required
              placeholder="Contoh: IPA, IPS, TKJ"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Ruang</label>
            <input
              type="text"
              v-model="form.ruang"
              class="form-control"
              required
              placeholder="Contoh: A, B, C"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Jumlah Siswa</label>
            <input
              type="number"
              v-model.number="form.jumlah_siswa"
              class="form-control"
              required
              min="1"
              placeholder="Contoh: 30"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Tahun Ajaran</label>
            <input
              type="text"
              v-model="form.tahun_ajaran"
              class="form-control"
              required
              placeholder="Contoh: 2024/2025"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Wali Kelas</label>
            <select v-model="form.wali_kelas_id" class="form-select" required>
              <option disabled value="">-- Pilih Wali Kelas --</option>
              <option v-for="g in guruList" :key="g.id" :value="g.karyawanId">
                {{ g.karyawan?.nama }}
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
    mode: { type: String, default: 'tambah' },
    dataEdit: { type: Object, default: null }
  },
  data() {
    return {
      form: {
        tingkat: '',
        jurusan: '',
        ruang: '',
        jumlah_siswa: '',
        tahun_ajaran: '',
        wali_kelas_id: ''
      },
      guruList: []
    }
  },
  methods: {
    async ambilGuru() {
      try {
        const res = await axios.get('/guru')
        this.guruList = res.data
      } catch (err) {
        console.error('Gagal mengambil data guru:', err)
      }
    },
    async handleSubmit() {
      try {
        if (this.mode === 'tambah') {
          await axios.post('/kelas', this.form)
        } else {
          await axios.put(`/kelas/${this.dataEdit.id}`, this.form)
        }
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error('Gagal menyimpan data kelas:', err)
        alert('Terjadi kesalahan saat menyimpan.')
      }
    },
    isiFormEdit() {
      if (this.mode === 'edit' && this.dataEdit) {
        this.form = {
          tingkat: this.dataEdit.tingkat,
          jurusan: this.dataEdit.jurusan,
          ruang: this.dataEdit.ruang,
          jumlah_siswa: this.dataEdit.jumlah_siswa,
          tahun_ajaran: this.dataEdit.tahun_ajaran,
          wali_kelas_id: this.dataEdit.wali_kelas_id
        }
      }
    }
  },
  mounted() {
    this.ambilGuru()
    this.isiFormEdit()
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
</style>

