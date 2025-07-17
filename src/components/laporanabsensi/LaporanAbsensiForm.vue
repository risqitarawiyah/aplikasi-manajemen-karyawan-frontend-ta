<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">
          {{ mode === 'tambah' ? 'Tambah Laporan Absensi' : 'Edit Laporan Absensi' }}
        </h5>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <div class="modal-body">
          <div class="mb-3">
            <label>Nama Karyawan</label>
            <select v-model="form.karyawanId" class="form-select" required>
              <option disabled value="">-- Pilih Karyawan --</option>
              <option v-for="k in karyawanList" :key="k.id" :value="k.id">{{ k.nama }}</option>
            </select>
          </div>

          <div class="mb-3">
            <label>Bulan</label>
            <input type="number" v-model.number="form.bulan" min="1" max="12" class="form-control" required />
          </div>

          <div class="mb-3">
            <label>Tahun</label>
            <input type="number" v-model.number="form.tahun" min="2000" max="2100" class="form-control" required />
          </div>

          <div class="mb-3">
            <label>Jumlah Hadir</label>
            <input type="number" v-model.number="form.jumlah_hadir" min="0" class="form-control" required />
          </div>

          <div class="mb-3">
            <label>Jumlah Tidak Hadir</label>
            <input type="number" v-model.number="form.jumlah_tidak_hadir" min="0" class="form-control" required />
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
        karyawanId: '',
        bulan: '',
        tahun: '',
        jumlah_hadir: '',
        jumlah_tidak_hadir: '',
        persentase: 0
      },
      karyawanList: []
    }
  },
  methods: {
    async ambilKaryawan() {
      try {
        const res = await axios.get('/karyawans')
        this.karyawanList = res.data
      } catch (err) {
        console.error('Gagal mengambil data karyawan:', err)
      }
    },
    hitungPersentase() {
      const total = this.form.jumlah_hadir + this.form.jumlah_tidak_hadir
      if (total > 0) {
        this.form.persentase = ((this.form.jumlah_hadir / total) * 100).toFixed(2)
      } else {
        this.form.persentase = 0
      }
    },
    async handleSubmit() {
      this.hitungPersentase()
      try {
        if (this.mode === 'tambah') {
          await axios.post('/laporan-absensi', this.form)
        } else {
          await axios.put(`/laporan-absensi/${this.dataEdit.id}`, this.form)
        }
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        console.error('Gagal menyimpan data:', err)
        alert('Terjadi kesalahan saat menyimpan.')
      }
    },
    isiFormEdit() {
      if (this.mode === 'edit' && this.dataEdit) {
        this.form = {
          karyawanId: this.dataEdit.karyawanId,
          bulan: this.dataEdit.bulan,
          tahun: this.dataEdit.tahun,
          jumlah_hadir: this.dataEdit.jumlah_hadir,
          jumlah_tidak_hadir: this.dataEdit.jumlah_tidak_hadir,
          persentase: this.dataEdit.persentase
        }
      }
    }
  },
  mounted() {
    this.ambilKaryawan()
    this.isiFormEdit()
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
