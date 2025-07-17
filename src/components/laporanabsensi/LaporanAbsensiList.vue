<template>
  <div class="laporan-absensi-list">
    <h3 class="fw-bold">
      Laporan Absensi <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
    </h3>

    <div class="d-flex align-items-center justify-content-between mb-3">
      <div style="max-width: 300px; flex: 1;">
        <input
          type="text"
          v-model="search"
          class="form-control"
          placeholder="Cari karyawan, bulan/tahun..."
        >
      </div>
      
      <button class="btn btn-primary" @click="showGenerateModal = true">
        <i class="bi bi-lightning"></i> Generate Otomatis
      </button>
    </div>

    <div v-if="notif" class="alert alert-success" role="alert">
      {{ notif }}
    </div>

    <table class="table table-bordered table-striped">
      <thead class="tabel-header-soft">
        <tr>
          <th>ID</th>
          <th>Nama Karyawan</th>
          <th>Bulan</th>
          <th>Tahun</th>
          <th>Hadir</th>
          <th>Tidak Hadir</th>
          <th>Persentase</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lap in filteredList" :key="lap.id">
          <td>{{ lap.id }}</td>
          <td>{{ lap.karyawan?.nama || '-' }}</td>
          <td>{{ lap.bulan }}</td>
          <td>{{ lap.tahun }}</td>
          <td>{{ lap.jumlah_hadir }}</td>
          <td>{{ lap.jumlah_tidak_hadir }}</td>
          <td>{{ lap.persentase }}%</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="edit(lap)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(lap)">Hapus</button>
          </td>
        </tr>
        <tr v-if="!loading && filteredList.length === 0">
          <td colspan="8" class="text-center text-muted">Data tidak ditemukan</td>
        </tr>
      </tbody>
    </table>

    <ConfirmModal
      v-if="showConfirm"
      :message="'Yakin ingin menghapus laporan ini?'"
      @confirm="hapus"
      @cancel="showConfirm = false"
    />

    <GenerateLaporanModal
      v-if="showGenerateModal"
      @close="showGenerateModal = false"
      @generated="fetchData"
    />
  </div>
</template>

<script>
import axios from '@/utils/axios'
import LaporanAbsensiForm from './LaporanAbsensiForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import GenerateLaporanModal from './GenerateLaporanModal.vue'

export default {
  components: { LaporanAbsensiForm, ConfirmModal, GenerateLaporanModal },
  data() {
    return {
      list: [],
      dataEdit: null,
      notif: '',
      search: '',
      loading: false,
      showConfirm: false,
      itemDihapus: null,
      showGenerateModal: false
    }
  },
  computed: {
    filteredList() {
      if (!this.search) return this.list

      const keyword = this.search.toLowerCase()
      return this.list.filter(lap => {
        const nama = lap.karyawan?.nama?.toLowerCase() || ''
        const bulan = String(lap.bulan)
        const tahun = String(lap.tahun)
        return (
          nama.includes(keyword) ||
          bulan.includes(keyword) ||
          tahun.includes(keyword)
        )
      })
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const res = await axios.get('/laporanabsensi')
        this.list = res.data
      } catch (err) {
        console.error('Gagal mengambil laporan:', err)
      } finally {
        this.loading = false
      }
    },
    edit(data) {
      this.formMode = 'edit'
      this.dataEdit = data
      this.showForm = true
    },
    konfirmasiHapus(data) {
      this.itemDihapus = data
      this.showConfirm = true
    },
    async hapus() {
      try {
        await axios.delete(`/laporanabsensi/${this.itemDihapus.id}`)
        this.fetchData()
        this.notif = 'Laporan berhasil dihapus!'
      } catch (err) {
        console.error('Gagal menghapus:', err)
      } finally {
        this.showConfirm = false
        setTimeout(() => (this.notif = ''), 3000)
      }
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
