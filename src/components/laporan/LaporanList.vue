<template>
  <div class="laporan-list">
    <h3 class="fw-bold">Laporan <small class="text-muted">Aplikasi Manajemen Data Karyawan</small></h3>

    <!-- Filter Tanggal -->
    <div class="bg-white border p-3 my-3 rounded shadow-sm">
      <h5 class="mb-3">Filter Laporan</h5>
      <div class="row">
        <div class="col-md-3 mb-2">
          <label for="dariTanggal" class="form-label fw-bold">Dari Tanggal</label>
          <input type="date" id="dariTanggal" v-model="filter.dari" class="form-control" />
        </div>
        <div class="col-md-3 mb-2">
          <label for="sampaiTanggal" class="form-label fw-bold">Sampai Tanggal</label>
          <input type="date" id="sampaiTanggal" v-model="filter.sampai" class="form-control" />
        </div>
        <div class="col-md-3 d-flex align-items-end mb-2">
          <button class="btn btn-primary me-2" @click="fetchLaporan">Terapkan</button>
          <button class="btn btn-secondary" @click="resetFilter">Reset</button>
        </div>
      </div>
    </div>

    <!-- Notifikasi -->
    <div v-if="notif" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ notif }}
      <button type="button" class="btn-close" @click="notif = ''"></button>
    </div>

    <!-- Ringkasan + Tombol Cetak -->
    <div class="bg-white border p-3 mb-3 rounded shadow-sm">
      <h5 class="mb-3">Ringkasan Rentang Tanggal</h5>
      <table class="table">
        <tbody>
          <tr>
            <th>DARI TANGGAL</th>
            <td>: {{ formatTanggal(filter.dari) }}</td>
          </tr>
          <tr>
            <th>SAMPAI TANGGAL</th>
            <td>: {{ formatTanggal(filter.sampai) }}</td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-danger btn-sm" @click="cetakPDF" :disabled="laporanList.length === 0">
        <i class="bi bi-file-earmark-pdf"></i> CETAK PDF
      </button>
    </div>

    <!-- Tabel Web -->
    <div class="bg-white border rounded shadow-sm">
      <table class="table table-bordered text-center align-middle">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Tipe Laporan</th>
            <th>Dibuat Oleh</th>
            <th>Tanggal</th>
            <th>Isi Laporan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="laporan in laporanList" :key="laporan.laporan_id">
            <td>{{ laporan.laporan_id }}</td>
            <td>{{ laporan.tipe_laporan }}</td>
            <td>{{ laporan.created_by }}</td>
            <td>{{ formatTanggalWaktu(laporan.created_at) }}</td>
            <td><pre class="text-wrap text-start small">{{ formatIsi(laporan.isi_laporan) }}</pre></td>
          </tr>
          <tr v-if="laporanList.length === 0">
            <td colspan="5" class="text-muted">Tidak ada data laporan ditemukan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bagian yang Dicetak -->
    <div ref="laporanPDF" class="print-area-hidden">
      <h4 class="text-center fw-bold mb-4">
        LAPORAN APLIKASI MANAJEMEN MASDA<br />
        <small class="fw-normal text-muted">Periode: {{ formatPeriode(filter.dari, filter.sampai) }}</small>
      </h4>

      <table class="table table-bordered text-center align-middle small">
        <thead class="table-light">
          <tr>
            <th>No</th>
            <th>Tanggal & Waktu</th>
            <th>Admin</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(laporan, index) in laporanList" :key="laporan.laporan_id">
            <td>{{ index + 1 }}</td>
            <td>{{ formatTanggalWaktu(laporan.created_at) }}</td>
            <td>{{ laporan.created_by }}</td>
            <td class="text-start">{{ laporan.isi_laporan }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios'
import html2pdf from 'html2pdf.js'

export default {
  data() {
    return {
      filter: {
        dari: '',
        sampai: ''
      },
      laporanList: [],
      notif: '' // Notifikasi tampil di atas
    }
  },
  methods: {
    async fetchLaporan() {
      const { dari, sampai } = this.filter

      // ✅ Cek apakah tanggal belum dipilih
      if (!dari || !sampai) {
        this.notif = 'Silakan pilih rentang tanggal terlebih dahulu sebelum menerapkan filter.'
        setTimeout(() => {
          this.notif = ''
        }, 3000)
        return
      }

      try {
        const res = await axios.get(`/laporans/filter?dari=${dari}&sampai=${sampai}`)
        this.laporanList = res.data.data || []

        this.notif = 'Filter laporan berhasil diterapkan!'
        setTimeout(() => {
          this.notif = ''
        }, 3000)
      } catch (err) {
        console.error('Gagal mengambil data laporan:', err)
      }
    },

    resetFilter() {
      this.filter.dari = ''
      this.filter.sampai = ''
      this.fetchLaporan()
    },

    formatTanggal(tgl) {
      return tgl ? new Date(tgl).toLocaleDateString('id-ID') : '-'
    },

    formatTanggalWaktu(tgl) {
      return tgl ? new Date(tgl).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }) : '-'
    },

    formatIsi(isi) {
      return typeof isi === 'object' ? JSON.stringify(isi, null, 2) : isi
    },

    formatPeriode(dari, sampai) {
      if (!dari || !sampai) return '-'
      const format = tgl => new Date(tgl).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      return `${format(dari)} s/d ${format(sampai)}`
    },

    cetakPDF() {
      if (this.laporanList.length === 0) {
        alert('Tidak ada data untuk dicetak.')
        return
      }

      this.$nextTick(() => {
        const element = this.$refs.laporanPDF
        const opt = {
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: `laporan-${this.filter.dari || 'awal'}-sd-${this.filter.sampai || 'akhir'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().set(opt).from(element).save()
      })
    }
  },
  mounted() {
    this.fetchLaporan()
  }
}
</script>

<style scoped>
.laporan-list {
  padding: 20px;
}
pre {
  white-space: pre-wrap;
  margin: 0;
}
table {
  font-size: 15px;
}
.print-area-hidden {
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 1000px;
  background-color: #fff;
}
</style>