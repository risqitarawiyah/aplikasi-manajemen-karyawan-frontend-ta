<template>
  <div class="divisi-list">
    <h3 class="fw-bold">
      Divisi <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
    </h3>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <!-- Search bar -->
      <div style="max-width: 300px; width: 100%;">
        <input
          type="text"
          v-model="search"
          class="form-control"
          placeholder="Cari nama divisi..."
        />
      </div>

      <!-- Tombol tambah -->
      <button class="btn btn-primary ms-2" @click="tambahDivisi">
        <i class="bi bi-plus-circle"></i> Tambah Divisi
      </button>
    </div>

    <!-- Notifikasi -->
    <div v-if="notifPesan" class="alert alert-success" role="alert">
      {{ notifPesan }}
    </div>

    <table class="table table-bordered table-striped">
      <thead class="tabel-header-soft">
        <tr>
          <th>ID</th>
          <th>Nama Divisi</th>
          <th>Jumlah Karyawan</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="divisi in filteredDivisi" :key="divisi.id">
          <td>{{ divisi.id }}</td>
          <td>{{ divisi.nama }}</td>
          <td>{{ divisi.karyawan?.length || 0 }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="editDivisi(divisi)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(divisi)">Hapus</button>
          </td>
        </tr>
        <tr v-if="!loading && divisiList.length === 0">
          <td colspan="4" class="text-center text-muted">Belum ada data divisi</td>
        </tr>
      </tbody>
    </table>

    <!-- Form -->
    <DivisiForm
      v-if="tampilkanForm"
      :mode="formMode"
      :dataEdit="dataEdit"
      @close="tutupForm"
      @saved="handleFormSaved"
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
      notifPesan: '',
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
        div.nama?.toLowerCase().includes(keyword)
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
    tampilkanNotifikasi(pesan) {
      this.notifPesan = pesan
      setTimeout(() => {
        this.notifPesan = ''
      }, 3000)
    },
    konfirmasiHapus(divisi) {
      this.divisiDihapus = divisi
      this.showConfirm = true
    },
    async hapusDivisi() {
      try {
        await axios.delete(`/divisis/${this.divisiDihapus.id}`)
        await this.fetchDivisi()
        this.tampilkanNotifikasi('Divisi berhasil dihapus!')
      } catch (err) {
        console.error('Gagal menghapus divisi:', err)
      } finally {
        this.showConfirm = false
      }
    },
    async handleFormSaved() {
      const mode = this.formMode
      this.tampilkanForm = false
      await this.fetchDivisi()
      this.tampilkanNotifikasi(
        mode === 'tambah' ? 'Divisi berhasil ditambahkan!' : 'Divisi berhasil diperbarui!'
      )
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