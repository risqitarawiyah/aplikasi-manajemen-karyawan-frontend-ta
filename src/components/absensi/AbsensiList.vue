<template>
    <div class="absensi-list">
        <h3 class="fw-bold">
        Absensi <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
        </h3>

        <div class="d-flex justify-content-between align-items-center mb-3">
        <div style="max-width: 300px; width: 100%;">
            <input
            type="text"
            v-model="search"
            class="form-control"
            placeholder="Cari nama karyawan..."
            />
        </div>

        <button class="btn btn-primary ms-2" @click="tambahAbsensi">
            <i class="bi bi-plus-circle"></i> Tambah Absensi
        </button>
        </div>

        <div v-if="notif" class="alert alert-success" role="alert">
        {{ notif }}
        </div>

        <div class="table-wrapper">
            <table class="table table-bordered table-striped">
            <thead class="tabel-header-soft">
                <tr>
                <th>ID</th>
                <th>Nama Karyawan</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="absen in filteredList" :key="absen.id">
                <td>{{ absen.id }}</td>
                <td>{{ absen.karyawan?.nama || '-' }}</td>
                <td>{{ formatTanggal(absen.tanggal) }}</td>
                <td>{{ absen.status }}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" @click="edit(absen)">Edit</button>
                    <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(absen)">Hapus</button>
                </td>
                </tr>
                <tr v-if="!loading && list.length === 0">
                <td colspan="5" class="text-center text-muted">Belum ada data absensi</td>
                </tr>
            </tbody>
            </table>
        </div>

        <!-- Form -->
        <AbsensiForm
        v-if="showForm"
        :mode="formMode"
        :dataEdit="dataEdit"
        @close="showForm = false"
        @saved="handleSaved"
        />

        <!-- Konfirmasi Hapus -->
        <ConfirmModal
        v-if="showConfirm"
        :message="'Yakin ingin menghapus data absensi ini?'"
        @confirm="hapus"
        @cancel="showConfirm = false"
        />
    </div>
</template>

<script>
import axios from '@/utils/axios'
import AbsensiForm from './AbsensiForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
    components: { AbsensiForm, ConfirmModal },
    data() {
        return {
        list: [],
        loading: false,
        search: '',
        showForm: false,
        formMode: 'tambah',
        dataEdit: null,
        notif: '',
        showConfirm: false,
        absenDihapus: null
        }
    },
    computed: {
        filteredList() {
        const keyword = this.search.toLowerCase()
        return this.list.filter(item =>
            item.karyawan?.nama?.toLowerCase().includes(keyword)
        )
        }
    },
    methods: {
        async fetchData() {
        this.loading = true
        try {
            const res = await axios.get('/absensis')
            this.list = res.data
        } catch (err) {
            console.error('Gagal memuat absensi:', err)
        } finally {
            this.loading = false
        }
        },
        formatTanggal(tgl) {
        return new Date(tgl).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        })
        },
        tambahAbsensi() {
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
        this.absenDihapus = data
        this.showConfirm = true
        },
        async hapus() {
        try {
            await axios.delete(`/absensis/${this.absenDihapus.id}`)
            await this.fetchData()
            this.notif = 'Absensi berhasil dihapus!'
        } catch (err) {
            console.error('Gagal hapus absensi:', err)
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
</style>
