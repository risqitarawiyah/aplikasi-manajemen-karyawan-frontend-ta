<template>
  <div id="print-area">
    <div class="laporan-absensi-list">
      <h3 class="fw-bold">
        Laporan Absensi <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
      </h3>

      <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div style="max-width: 300px; flex: 1;">
          <input
            type="text"
            v-model="search"
            class="form-control"
            placeholder="Cari karyawan, bulan/tahun..."
          >
        </div>

        <div class="d-flex gap-2">
          <button class="btn btn-primary" @click="showGenerateModal = true">
            <i class="bi bi-lightning"></i> Generate Otomatis
          </button>
          <button class="btn btn-danger" @click="printLaporan">
            <i class="bi bi-printer"></i> Cetak PDF
          </button>
          <button class="btn btn-success" @click="exportToExcel">
            <i class="bi bi-file-earmark-excel"></i> Unduh Excel
          </button>
        </div>
      </div>

      <!-- Notifikasi -->
      <transition name="fade">
        <div
          v-if="notif"
          class="alert alert-success modern-notif"
          role="alert"
        >
          {{ notif }}
        </div>
      </transition>

      <!-- Tabel -->
      <div ref="laporanTable">
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
            </tr>
            <tr v-if="!loading && filteredList.length === 0">
              <td colspan="7" class="text-center text-muted">Data tidak ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>

      <GenerateLaporanModal
        v-if="showGenerateModal"
        @close="showGenerateModal = false"
        @generated="handleGenerated"
      />
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios'
import GenerateLaporanModal from './GenerateLaporanModal.vue'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default {
  components: {
    GenerateLaporanModal
  },
  data() {
    return {
      list: [],
      notif: '',
      search: '',
      loading: false,
      laporanData: [],
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
    handleGenerated() {
      this.showGenerateModal = false
      this.fetchData()
      this.showNotif('Laporan berhasil digenerate!')
    },
    showNotif(message) {
      this.notif = message
      setTimeout(() => {
        this.notif = ''
      }, 3000)
    },
    printLaporan() {
      const originalContents = document.body.innerHTML;
      const printContents = document.getElementById('print-area').innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      location.reload();
    },
    exportToExcel() {
      console.log('Tombol diklik'); // ← ini sekarang akan muncul di console
      if (!this.filteredList || this.filteredList.length === 0) {
        alert('Tidak ada data untuk diunduh.');
        return;
      }

      const wsData = this.filteredList.map((lap, index) => ({
        No: index + 1,
        'Nama Karyawan': lap.karyawan?.nama || '-',
        Bulan: lap.bulan,
        Tahun: lap.tahun,
        Hadir: lap.jumlah_hadir,
        'Tidak Hadir': lap.jumlah_tidak_hadir,
        Persentase: `${lap.persentase}%`
      }));

      const worksheet = XLSX.utils.json_to_sheet(wsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `laporanabsensi-${new Date().toISOString().slice(0,10)}.xlsx`);
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

/* Notifikasi modern */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.modern-notif {
  margin-bottom: 15px;
  border-left: 5px solid #1b8ed1;
  background-color: #eaf6ff;
  color: #13598c;
  font-weight: 500;
}

/* Cetak PDF */
@media print {
  body * {
    visibility: hidden;
  }

  #print-area,
  #print-area * {
    visibility: visible;
  }

  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  .btn,
  .sidebar,
  nav,
  .logout,
  input,
  .modern-notif {
    display: none !important;
  }

  @page {
    size: A4 portrait;
    margin: 20mm;
  }
}
</style>
