<template>
  <div class="container">
    <h3 class="fw-bold">
      Divisi <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
    </h3>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <!-- Search bar di kiri -->
      <div style="max-width: 300px; width: 100%;">
        <input
          type="text"
          v-model="search"
          class="form-control"
          placeholder="Cari nama divisi..."
        />
      </div>

      <!-- Tombol tambah di kanan -->
      <button class="btn btn-primary ms-2" @click="tambahDivisi">
        <i class="bi bi-plus-circle"></i> Tambah Divisi
      </button>
    </div>

    <table class="table table-bordered table-striped">
      <thead class="tabel-header-soft">
        <tr>
          <th>ID</th>
          <th>Divisi</th>
          <th>Posisi</th>
          <th>ID Karyawan</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="divisi in filteredDivisi" :key="divisi.divisi_id">
          <td>{{ divisi.divisi_id }}</td>
          <td>{{ divisi.nama_divisi }}</td>
          <td>{{ divisi.posisi }}</td>
          <td>{{ divisi.karyawan_id }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="editDivisi(divisi)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(divisi)">Hapus</button>
          </td>
        </tr>
        <tr v-if="!loading && divisiList.length === 0">
          <td colspan="5" class="text-center text-muted">Belum ada data divisi</td>
        </tr>
      </tbody>
    </table>

    <!-- Form Tambah/Edit -->
    <DivisiForm
      v-if="tampilkanForm"
      :mode="formMode"
      :dataEdit="dataEdit"
      @close="tutupForm"
      @saved="fetchDivisi"
    />

    <!-- Modal Konfirmasi -->
    <ConfirmModal
      v-if="showConfirm"
      :message="`Yakin ingin menghapus divisi ini?`"
      @confirm="hapusDivisi"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script>
import axios from '@/utils/axios'
import DivisiForm from './DivisiForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
  components: { DivisiForm, ConfirmModal },
  data() {
    return {
      divisiList: [],
      loading: false,
      tampilkanForm: false,
      formMode: 'tambah',
      dataEdit: null,
      search: '',
      showConfirm: false,
      divisiDihapus: null
    }
  },
  computed: {
    filteredDivisi() {
      const keyword = this.search.toLowerCase()
      return this.divisiList.filter(div =>
        div.nama_divisi.toLowerCase().includes(keyword)
      )
    }
  },
  methods: {
    async fetchDivisi() {
      this.loading = true
      try {
        const res = await axios.get('/divisis')
        this.divisiList = res.data
      } catch (err) {
        console.error('Gagal mengambil data divisi:', err)
      } finally {
        this.loading = false
      }
    },
    tambahDivisi() {
      this.formMode = 'tambah'
      this.dataEdit = null
      this.tampilkanForm = true
    },
    editDivisi(divisi) {
      this.formMode = 'edit'
      this.dataEdit = divisi
      this.tampilkanForm = true
    },
    tutupForm() {
      this.tampilkanForm = false
    },
    konfirmasiHapus(divisi) {
      this.divisiDihapus = divisi
      this.showConfirm = true
    },
    async hapusDivisi() {
      try {
        await axios.delete(`/divisis/${this.divisiDihapus.divisi_id}`)
        await this.fetchDivisi()
      } catch (err) {
        console.error('Gagal menghapus divisi:', err)
      } finally {
        this.showConfirm = false
      }
    }
  },
  mounted() {
    this.fetchDivisi()
  }
}
</script>

<style scoped>
.tabel-header-soft th {
  background-color: #dbeeff;
  color: #0b0b0b;
}

.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}
</style>
