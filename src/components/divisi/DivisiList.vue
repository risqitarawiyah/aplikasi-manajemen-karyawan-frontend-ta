<template>
  <div class="container">
    <h3 class="fw-bold">
      Divisi <small class="text-muted">Aplikasi Manajemen Data Karyawan</small></h3>

    <button class="btn btn-primary mb-3" @click="tambahDivisi">
      <i class="bi bi-plus-circle"></i> Tambah Divisi
    </button>

    <div v-if="loading" class="text-center my-4">Loading...</div>
    <div v-else>
      <table class="table table-bordered">
        <thead class="tabel-header-soft">
          <tr>
            <th>ID</th>
            <th>Divisi</th>
            <th>Posisi</th>
            <th>Karyawan_ID</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="divisi in daftarDivisi" :key="divisi.divisi_id">
            <td>{{ divisi.divisi_id }}</td>
            <td>{{ divisi.nama_divisi }}</td>
            <td>{{ divisi.posisi }}</td>
            <td>{{ divisi.karyawan_id }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="editDivisi(divisi)">Edit</button>
              <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(divisi)">Hapus</button>
            </td>
          </tr>
          <tr v-if="daftarDivisi.length === 0">
            <td colspan="5" class="text-center text-muted">Belum ada data divisi</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Tambah/Edit -->
    <DivisiForm v-if="tampilkanForm" :mode="formMode" :dataEdit="dataEdit" @close="tutupForm" @saved="fetchDivisi" />
  </div>
</template>

<script>
import axios from '@/utils/axios'
import DivisiForm from './DivisiForm.vue'

export default {
  components: { DivisiForm },
  data() {
    return {
      daftarDivisi: [],
      loading: true,
      tampilkanForm: false,
      formMode: 'tambah',
      dataEdit: null
    }
  },
  methods: {
    async fetchDivisi() {
      this.loading = true
      try {
        const res = await axios.get('/divisis')
        this.daftarDivisi = res.data
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
    async konfirmasiHapus(divisi) {
      const konfirmasi = window.confirm(`Yakin ingin menghapus divisi "${divisi.divisi}"?`)
      if (konfirmasi) {
        try {
          await axios.delete(`/divisis/${divisi.divisi_id}`)
          this.fetchDivisi()
        } catch (err) {
          console.error('Gagal menghapus divisi:', err)
        }
      }
    }
  },
  mounted() {
    this.fetchDivisi()
  }
}
</script>

<style scoped>
.tabel-header-soft {
  background-color: #dbeeff;
  color: #0d47a1;
}

.table th {
  vertical-align: middle;
  text-align: center;
}

.table td {
  vertical-align: middle;
}

</style>