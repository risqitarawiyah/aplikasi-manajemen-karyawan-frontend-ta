<template>
  <div class="kelas-list">
    <h3 class="fw-bold">
      Data Kelas <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
    </h3>

    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-primary" @click="tambah">
        <i class="bi bi-plus-circle"></i> Tambah Kelas
      </button>
    </div>

    <!-- Notifikasi -->
    <div v-if="notif" class="alert alert-success" role="alert">
      {{ notif }}
    </div>

    <table class="table table-bordered table-striped">
      <thead class="tabel-header-soft">
        <tr>
          <th>No</th>
          <th>Tingkat</th>
          <th>Ruang</th>
          <th>Jumlah Siswa</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(kelas, index) in list" :key="kelas.id">
          <td>{{ index + 1 }}</td>
          <td>{{ kelas.tingkat }}</td> <!-- Sudah diubah label kolomnya jadi "Tingkat" -->
          <td>{{ kelas.ruang }}</td>
          <td>{{ kelas.jumlah_siswa }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="edit(kelas)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(kelas)">Hapus</button>
          </td>
        </tr>
        <tr v-if="!loading && list.length === 0">
          <td colspan="5" class="text-center text-muted">Belum ada data kelas</td>
        </tr>
      </tbody>
    </table>

    <!-- Form -->
    <KelasForm
      v-if="showForm"
      :mode="formMode"
      :dataEdit="dataEdit"
      @close="showForm = false"
      @saved="handleSaved"
    />

    <!-- Konfirmasi Hapus -->
    <ConfirmModal
      v-if="showConfirm"
      :message="'Yakin ingin menghapus kelas ini?'"
      @confirm="hapus"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script>
import axios from '@/utils/axios'
import KelasForm from './KelasForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
  components: { KelasForm, ConfirmModal },
  data() {
    return {
      list: [],
      showForm: false,
      formMode: 'tambah',
      dataEdit: null,
      notif: '',
      showConfirm: false,
      kelasDihapus: null,
      loading: false
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const res = await axios.get('/kelas')
        this.list = res.data
      } catch (err) {
        console.error('Gagal memuat data kelas:', err)
      } finally {
        this.loading = false
      }
    },
    tambah() {
      this.formMode = 'tambah'
      this.dataEdit = null
      this.showForm = true
    },
    edit(data) {
      this.formMode = 'edit'
      this.dataEdit = data
      this.showForm = true
    },
    konfirmasiHapus(data) {
      this.kelasDihapus = data
      this.showConfirm = true
    },
    async hapus() {
      try {
        await axios.delete(`/kelas/${this.kelasDihapus.id}`)
        await this.fetchData()
        this.notif = 'Kelas berhasil dihapus!'
      } catch (err) {
        console.error('Gagal hapus:', err)
      } finally {
        this.showConfirm = false
        setTimeout(() => (this.notif = ''), 3000)
      }
    },
    async handleSaved() {
      this.showForm = false
      await this.fetchData()
      this.notif = this.formMode === 'tambah' ? 'Berhasil menambahkan!' : 'Berhasil diperbarui!'
      setTimeout(() => (this.notif = ''), 3000)
    }
  },
  mounted() {
    this.fetchData()
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
