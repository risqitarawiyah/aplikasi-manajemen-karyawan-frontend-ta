<template>
    <div class="walikelas-list">
        <h3 class="fw-bold">
        Wali Kelas <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
        </h3>

        <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-primary" @click="tambah">
            <i class="bi bi-plus-circle"></i> Tambah Wali Kelas
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
            <th>Nama Guru</th>
            <th>Kelas</th>
            <th>Jumlah Siswa</th>
            <th>Aksi</th>
            </tr>
        </thead>
                <tbody>
        <tr v-for="(wali, index) in list" :key="wali.id">
            <td>{{ index + 1 }}</td>
            <td>{{ wali.guru?.karyawan?.nama || '-' }}</td>
            <td>{{ formatKelas(wali.kelas) }}</td>
            <td>{{ wali.kelas?.jumlah_siswa || '-' }}</td>
            <td>
            <button class="btn btn-sm btn-warning me-2" @click="edit(wali)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(wali)">Hapus</button>
            </td>
        </tr>
        <tr v-if="!loading && list.length === 0">
            <td colspan="5" class="text-center text-muted">Belum ada data wali kelas</td>
        </tr>
        </tbody>
        </table>

        <!-- Form -->
        <WaliKelasForm
        v-if="showForm"
        :mode="formMode"
        :dataEdit="dataEdit"
        @close="showForm = false"
        @saved="handleSaved"
        />

        <!-- Konfirmasi Hapus -->
        <ConfirmModal
        v-if="showConfirm"
        :message="'Yakin ingin menghapus wali kelas ini?'"
        @confirm="hapus"
        @cancel="showConfirm = false"
        />
    </div>
</template>

<script>
import axios from '@/utils/axios'
import WaliKelasForm from './WaliKelasForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
    components: { WaliKelasForm, ConfirmModal },
    data() {
        return {
        list: [],
        showForm: false,
        formMode: 'tambah',
        dataEdit: null,
        notif: '',
        showConfirm: false,
        waliDihapus: null,
        loading: false
        }
    },
    methods: {
        formatKelas(kelas) {
            if (!kelas) return '-'
            return `${kelas.tingkat} ${kelas.jurusan} - ${kelas.ruang}`
        },

        async fetchData() {
        this.loading = true
        try {
            const res = await axios.get('/walikelas')
            this.list = res.data
        } catch (err) {
            console.error('Gagal memuat data wali kelas:', err)
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
        this.waliDihapus = data
        this.showConfirm = true
        },
        async hapus() {
        try {
            await axios.delete(`/walikelas/${this.waliDihapus.id}`)
            await this.fetchData()
            this.notif = 'Wali kelas berhasil dihapus!'
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
