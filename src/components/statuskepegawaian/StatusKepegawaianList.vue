<template>
  <div class="status-kepegawaian-list">
    <h3 class="fw-bold">
      Status Kepegawaian <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
    </h3>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <div style="max-width: 300px; width: 100%;">
        <input
          type="text"
          v-model="search"
          class="form-control"
          placeholder="Cari status kepegawaian..."
        />
      </div>

      <button class="btn btn-primary ms-2" @click="tambahStatus">
        <i class="bi bi-plus-circle"></i> Tambah Status
      </button>
    </div>

    <div v-if="notifPesan" class="alert alert-success" role="alert">
      {{ notifPesan }}
    </div>

    <div class="table-wrapper">
      <table class="table table-bordered table-striped">
        <thead class="tabel-header-soft">
          <tr>
            <th>No</th>
            <th>Nama Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(status, index) in filteredStatusList" :key="status.id">
            <td>{{ index + 1 }}</td>
            <td>{{ status.nama }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="editStatus(status)">Edit</button>
              <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(status)">Hapus</button>
            </td>
          </tr>
          <tr v-if="statusList.length === 0">
            <td colspan="3" class="text-center text-muted">Tidak ada data status kepegawaian</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form dan Konfirmasi -->
    <StatusKepegawaianForm
      v-if="tampilkanForm"
      :mode="formMode"
      :dataStatus="dataEdit"
      @close="handleFormClose"
      @saved="handleFormSaved"
    />

    <ConfirmModal
      v-if="showConfirm"
      :message="`Yakin ingin menghapus status ini?`"
      @confirm="hapusStatus"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script>
import axios from '@/utils/axios'
import StatusKepegawaianForm from './StatusKepegawaianForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
  components: { StatusKepegawaianForm, ConfirmModal },
  data() {
    return {
      statusList: [],
      search: '',
      notifPesan: '',
      tampilkanForm: false,
      formMode: 'tambah',
      dataEdit: null,
      showConfirm: false,
      statusDihapus: null
    }
  },
  computed: {
    filteredStatusList() {
      const keyword = this.search.toLowerCase()
      return this.statusList.filter(status =>
        status.nama?.toLowerCase().includes(keyword)
      )
    }
  },
  methods: {
    async ambilData() {
      try {
        const res = await axios.get('/statuskepegawaian')
        this.statusList = res.data
      } catch (err) {
        console.error('Gagal mengambil data status kepegawaian:', err)
      }
    },
    tambahStatus() {
      this.formMode = 'tambah'
      this.dataEdit = null
      this.tampilkanForm = true
    },
    editStatus(status) {
      this.formMode = 'edit'
      this.dataEdit = status
      this.tampilkanForm = true
    },
    konfirmasiHapus(status) {
      this.statusDihapus = status
      this.showConfirm = true
    },
    async hapusStatus() {
      try {
        await axios.delete(`/statuskepegawaian/${this.statusDihapus.id}`)
        this.ambilData()
        this.tampilkanNotifikasi('Status kepegawaian berhasil dihapus!')
      } catch (err) {
        console.error('Gagal menghapus status:', err)
      } finally {
        this.showConfirm = false
      }
    },
    tampilkanNotifikasi(pesan) {
      this.notifPesan = pesan
      setTimeout(() => (this.notifPesan = ''), 3000)
    },
    handleFormClose() {
      this.tampilkanForm = false
    },
    async handleFormSaved() {
      const mode = this.formMode
      this.tampilkanForm = false
      await this.ambilData()
      this.tampilkanNotifikasi(
        mode === 'tambah' ? 'Status berhasil ditambahkan!' : 'Status berhasil diperbarui!'
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
