<template>
  <div class="karyawan-list">
    <h3 class="fw-bold">
      Karyawan <small class="text-muted">Aplikasi Manajemen Data Karyawan</small></h3>

    <button class="btn btn-primary mb-3" @click="tambahKaryawan">
      <i class="bi bi-plus-circle"></i> Tambah Karyawan
    </button>

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
        <tr v-for="karyawan in karyawanList" :key="karyawan.karyawan_id">
          <td>{{ karyawan.karyawan_id }}</td>
          <td>{{ karyawan.nama_karyawan }}</td>
          <td>{{ karyawan.jenis_kelamin }}</td>
          <td>{{ karyawan.email }}</td>
          <td>{{ karyawan.no_hp }}</td>
          <td>{{ karyawan.alamat }}</td>
          <td>{{ karyawan.status_kepegawaian }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" @click="editKaryawan(karyawan)">
              <i class="bi bi-pencil"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(karyawan)">
              <i class="bi bi-trash"></i> Hapus
            </button>
          </td>
        </tr>
        <tr v-if="karyawanList.length === 0">
          <td colspan="4" class="text-muted">Tidak ada data karyawan</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Konfirmasi -->
    <ConfirmModal
      v-if="showConfirm"
      :message="'Yakin ingin menghapus karyawan ini?'"
      @confirm="hapusKaryawan"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script>
import axios from '@/utils/axios'
import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
  components: { ConfirmModal },
  data() {
    return {
      karyawanList: [],
      karyawanDihapus: null,
      showConfirm: false,
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
      this.$router.push('/karyawan/tambah')
    },
    editKaryawan(karyawan) {
      this.$router.push(`/karyawan/edit/${karyawan.karyawan_id}`)
    },
    konfirmasiHapus(karyawan) {
      this.karyawanDihapus = karyawan
      this.showConfirm = true
    },
    async hapusKaryawan() {
      try {
        await axios.delete(`/karyawans/${this.karyawanDihapus.karyawan_id}`)
        this.showConfirm = false
        this.ambilData()
      } catch (err) {
        console.error('Gagal menghapus karyawan:', err)
      }
    }
  },
  mounted() {
    this.ambilData()
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