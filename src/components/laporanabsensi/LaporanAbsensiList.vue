<template>
  <div>
    <!-- Tombol & Input Pencarian (tidak ikut dicetak karena di luar #print-area) -->
    <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2 no-print">
      <div style="max-width: 300px; flex: 1;">
        <input
          type="text"
          v-model="search"
          class="form-control"
          placeholder="Cari karyawan, bulan/tahun..."
        >
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-primary" @click="showModal = true">
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

    <!-- Notifikasi (disembunyikan saat cetak) -->
    <transition name="fade">
      <div
        v-if="notif"
        class="alert alert-success modern-notif no-print"
        role="alert"
      >
        {{ notif }}
      </div>
    </transition>
    <div v-if="notifPesan" class="alert alert-success no-print" role="alert">
      {{ notifPesan }}
    </div>

    <!-- Bagian yang Dicetak -->
    <div id="print-area">
      <div class="laporan-absensi-list">
        <h3 class="text-center fw-bold mb-4" style="font-size: 20px;">
          LAPORAN ABSENSI<br>
          <small class="text-muted" style="font-size: 14px;">
            Aplikasi Manajemen Data Karyawan
          </small>
        </h3>

        <div class="table-wrapper">
          <table class="table table-bordered table-striped">
            <thead class="tabel-header-soft">
              <tr>
                <th>No</th>
                <th>Nama Karyawan</th>
                <th>Bulan</th>
                <th>Tahun</th>
                <th>Hadir</th>
                <th>Tidak Hadir</th>
                <th>Persentase</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(lap, index) in filteredList" :key="lap.id">
                <td>{{ index + 1 }}</td>
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
      </div>
    </div>

    <!-- Modal -->
    <GenerateLaporanModal
      v-if="showModal"
      @close="showModal = false"
      @generated="fetchData"
      @notif="tampilkanNotifikasi"
    />
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
      showModal: false,
      notif: '',
      notifPesan: '',
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
      this.tampilkanNotifikasi('Laporan berhasil digenerate');
    },
    showNotif(message) {
      this.notif = message
      setTimeout(() => {
        this.notif = ''
      }, 3000)
    },
    tampilkanNotifikasi(pesan) {
      this.notifPesan = pesan;
      setTimeout(() => {
        this.notifPesan = '';
      }, 3000);
    },
    printLaporan() {
      const printWindow = window.open('', '', 'width=800,height=600');
      const printContent = document.getElementById('print-area').innerHTML;
      const style = `
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 10px;
            color: #000;
          }
          h3 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
            page-break-inside: avoid;
          }
          th {
            background-color: #dbeeff;
          }
          .laporan-info {
            margin-bottom: 10px;
            font-size: 13px;
          }
        </style>
      `;

      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Laporan Absensi</title>
            ${style}
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    },
    exportToExcel() {
      console.log('Tombol diklik'); // ← ini sekarang akan muncul di console
      if (!this.filteredList || this.filteredList.length === 0) {
        this.tampilkanNotifikasi('Tidak ada data untuk diunduh.');
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
/* ==========================
   GAYA UMUM (TAMPILAN WEB)
========================== */
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

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modern-notif {
  margin-bottom: 15px;
  border-left: 5px solid #1b8ed1;
  background-color: #eaf6ff;
  color: #13598c;
  font-weight: 500;
}

  /* ==========================
    GAYA CETAK (PDF / PRINT)
========================== */
@media print {
  /* SEMUA ELEMEN DISEMBUNYIKAN DULU */
  body * {
    visibility: hidden;
  }

  /* ==============
    KELAS NO-PRINT
    Untuk menyembunyikan elemen saat cetak
  ================ */
  .no-print {
    display: none !important;
  }

  /* HANYA AREA PRINT YANG TAMPIL */
  #print-area,
  #print-area * {
    visibility: visible;
  }

  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 20px;
    font-size: 12px;
  }

  /* SEMBUNYIKAN ELEMEN UI DENGAN CLASS TERTENTU */
  .btn,
  .sidebar,
  nav,
  .logout,
  input,
  .modern-notif,
  .no-print {
    display: none !important;
  }

  /* PAKSA TABEL AGAR CETAK PENUH */
  .table-wrapper {
    overflow: visible !important;
    max-height: none !important;
  }

  /* JUDUL LEBIH KONSISTEN */
  h3, h4, h5 {
    font-size: 16px !important;
    text-align: center;
    margin: 10px 0;
  }

  /* TABEL RAPAT & TERATUR */
  table {
    font-size: 12px;
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    padding: 6px;
    border: 1px solid #000;
    page-break-inside: avoid !important;
  }

  th {
    background-color: #dbeeff;
  }

  @page {
    size: A4 portrait;
    margin: 20mm;
  }
}
</style>