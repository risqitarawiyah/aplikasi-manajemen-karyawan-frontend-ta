<template>
  <div class="karyawan-list">
    <h3 class="fw-bold">
      Karyawan <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
    </h3>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <!-- Search bar di kiri -->
      <div style="max-width: 300px; width: 100%;">
        <input
          type="text"
          v-model="search"
          class="form-control"
          placeholder="Cari nama karyawan..."
        >
      </div>

      <!-- Tombol tambah di kanan -->
      <button class="btn btn-primary ms-2" @click="tambahKaryawan">
        <i class="bi bi-plus-circle"></i> Tambah Karyawan
      </button>
    </div>

    <table class="table table-bordered table-striped">
      <thead class="tabel-header-soft">
        <tr>
          <th>ID</th>
          <th>Nama</th>
          <th>Jenis Kelamin</th>
          <th>Email</th>
          <th>No Hp</th>
          <th>Alamat</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="karyawan in filteredKaryawan" :key="karyawan.karyawan_id">
          <td>{{ karyawan.karyawan_id }}</td>
          <td>{{ karyawan.nama_karyawan }}</td>
          <td>{{ karyawan.jenis_kelamin }}</td>
          <td>{{ karyawan.email }}</td>
          <td>{{ karyawan.no_hp }}</td>
          <td>{{ karyawan.alamat }}</td>
          <td>{{ karyawan.status_kepegawaian }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="editKaryawan(karyawan)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(karyawan)">Hapus</button>
          </td>
        </tr>
        <tr v-if="karyawanList.length === 0">
          <td colspan="8" class="text-center text-muted">Tidak ada data karyawan</td>
        </tr>
      </tbody>
    </table>

    <KaryawanForm
      v-if="tampilkanForm"
      :mode="formMode"
      :dataEdit="dataEdit"
      @close="tampilkanForm = false"
      @saved="ambilData"
    />

    <!-- Modal Konfirmasi -->
    <ConfirmModal
      v-if="showConfirm"
      :message="`Yakin ingin menghapus karyawan ini?\nSemua divisi milik karyawan ini juga akan ikut terhapus.`"
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
      dataEdit: null
    }
  },
  computed: {
    filteredKaryawan() {
      const keyword = this.search.toLowerCase()
      return this.karyawanList.filter(k =>
        k.nama_karyawan.toLowerCase().includes(keyword)
      )
    }
  },
  methods: {
    async ambilData() {
      try {
        const res = await axios.get('/karyawans')
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
        await axios.delete(`/karyawans/${this.karyawanDihapus.karyawan_id}`)
        this.ambilData()
        } catch (err) {
          console.error('Gagal menghapus karyawan:', err)
        } finally {
          this.showConfirm = false
        }
    },
    handleFormClose() {
      this.tampilkanForm = false
    },
    async handleFormSaved(dataBaru) {
      this.tampilkanForm = false
      this.ambilData()
    }
  },
  mounted() {
    this.ambilData()
  }
}
</script>

<style scoped>
.tabel-header-soft th {
  background-color: #dbeeff;
  color: #0b0b0b;
}

/* Gabungkan th dan td agar semua teks tabel rata tengah */
.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}
</style>