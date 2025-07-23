<template>
  <div class="karyawan-list">
    <h3 class="fw-bold">
      Karyawan <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
    </h3>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <div style="max-width: 300px; width: 100%;">
        <input
          type="text"
          v-model="search"
          class="form-control"
          placeholder="Cari nama karyawan..."
        >
      </div>

      <button class="btn btn-primary ms-2" @click="tambahKaryawan">
        <i class="bi bi-plus-circle"></i> Tambah Karyawan
      </button>
    </div>

    <div v-if="notifPesan" class="alert alert-success" role="alert">
      {{ notifPesan }}
    </div>

    <div v-if="notifError" class="alert alert-danger" role="alert">
      {{ notifError }}
    </div>

    <div class="table-wrapper">
      <table class="table table-bordered table-striped">
        <thead class="tabel-header-soft">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Jenis Kelamin</th>
            <th>Email</th>
            <th>No HP</th>
            <th>Alamat</th>
            <th>Status</th>
            <th>Divisi</th>
            <th>Jabatan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(karyawan, index) in filteredKaryawan" :key="karyawan.id">
            <td>{{ index + 1 }}</td>
            <td>{{ karyawan.nama }}</td>
            <td>{{ karyawan.jenis_kelamin }}</td>
            <td>{{ karyawan.email }}</td>
            <td>{{ karyawan.no_hp }}</td>
            <td>{{ karyawan.alamat }}</td>
            <td>{{ karyawan.status_kepegawaian?.nama || '-' }}</td>
            <td>{{ karyawan.divisi?.nama || '-' }}</td>
            <td>{{ karyawan.jabatan?.nama || '-' }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="editKaryawan(karyawan)">Edit</button>
              <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(karyawan)">Hapus</button>
            </td>
          </tr>
          <tr v-if="karyawanList.length === 0">
            <td colspan="10" class="text-center text-muted">Tidak ada data karyawan</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form dan Konfirmasi -->
    <KaryawanForm
      v-if="tampilkanForm"
      :mode="formMode"
      :dataEdit="dataEdit"
      @close="handleFormClose"
      @saved="handleFormSaved"
    />

    <ConfirmModal
      v-if="showConfirm"
      :message="`Yakin ingin menghapus karyawan ini?`"
      @confirm="hapusKaryawan"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script>
import axios from '@/utils/axios'
import ConfirmModal from '@/components/ConfirmModal.vue'
import KaryawanForm from './KaryawanForm.vue'

export default {
  components: { ConfirmModal, KaryawanForm },
  data() {
    return {
      karyawanList: [],
      karyawanDihapus: null,
      showConfirm: false,
      search: '',
      tampilkanForm: false,
      formMode: 'tambah',
      notifPesan: '',
      dataEdit: null,
      notifError: ''
    }
  },
  computed: {
    filteredKaryawan() {
      const keyword = this.search.toLowerCase()
      return this.karyawanList.filter(k =>
        k.nama?.toLowerCase().includes(keyword)
      )
    }
  },
  methods: {
    async ambilData() {
      try {
        const res = await axios.get('/karyawans') // pastikan sudah include divisi dan jabatan di backend
        this.karyawanList = res.data
      } catch (err) {
        console.error('Gagal mengambil data karyawan:', err)
      }
    },
    tambahKaryawan() {
      this.formMode = 'tambah'
      this.dataEdit = null
      this.tampilkanForm = true
    },
    tampilkanNotifikasi(pesan) {
      this.notifPesan = pesan
      setTimeout(() => {
        this.notifPesan = ''
      }, 3000)
    },
    editKaryawan(karyawan) {
      this.formMode = 'edit'
      this.dataEdit = karyawan
      this.tampilkanForm = true
    },
    konfirmasiHapus(karyawan) {
      this.karyawanDihapus = karyawan
      this.showConfirm = true
    },
    async hapusKaryawan() {
      try {
        await axios.delete(`/karyawans/${this.karyawanDihapus.id}`)
        this.ambilData()
        this.tampilkanNotifikasi('Karyawan berhasil dihapus!')
      } catch (err) {
        console.error('Gagal menghapus karyawan:', err)
        this.notifError = err.response?.data?.message || 'Terjadi kesalahan saat menghapus karyawan.'
        setTimeout(() => {
          this.notifError = ''
        }, 4000)
      } finally {
        this.showConfirm = false
      }
    },
    handleFormClose() {
      this.tampilkanForm = false
    },
    async handleFormSaved() {
      const mode = this.formMode
      this.tampilkanForm = false
      this.ambilData()
      this.tampilkanNotifikasi(
        mode === 'tambah' ? 'Karyawan berhasil ditambahkan!' : 'Karyawan berhasil diperbarui!'
      )
    }
  },
  mounted() {
    this.ambilData()
  }
}
</script>

<style scoped>
.table-wrapper {
    max-height: 400px;
    overflow-y: auto;
}

.tabel-header-soft th {
  background-color: #dbeeff;
  color: #0b0b0b;
}

.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}
.table td:last-child {
  white-space: nowrap;
  width: 120px;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}
</style>
