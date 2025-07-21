<template>
    <div class="guru-list">
        <h3 class="fw-bold">
        Guru <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
        </h3>

        <div class="d-flex justify-content-between align-items-center mb-3">
        <div style="max-width: 300px; width: 100%;">
            <input
            type="text"
            v-model="search"
            class="form-control"
            placeholder="Cari nama guru..."
            >
        </div>

        <button class="btn btn-primary ms-2" @click="tambahGuru">
            <i class="bi bi-plus-circle"></i> Tambah Guru
        </button>
        </div>

        <div v-if="notifPesan" class="alert alert-success" role="alert">
        {{ notifPesan }}
        </div>

        <div class="table-wrapper">
        <table class="table table-bordered table-striped">
            <thead class="tabel-header-soft">
            <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Mapel</th>
                <th>Jumlah JTM</th>
                <th>Penempatan</th>
                <th>Aksi</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(guru, index) in filteredGuru" :key="guru.id">
                <td>{{ index + 1 }}</td>
                <td>{{ guru.karyawan?.nama }}</td>
                <td>{{ guru.mapel?.nama || '-' }}</td>
                <td>{{ guru.jumlahJtm ?? '-' }}</td>
                <td>{{ guru.penempatan }}</td>
                <td>
                <button class="btn btn-sm btn-warning me-2" @click="editGuru(guru)">Edit</button>
                <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(guru)">Hapus</button>
                </td>
            </tr>
            <tr v-if="guruList.length === 0">
                <td colspan="6" class="text-center text-muted">Tidak ada data guru</td>
            </tr>
            </tbody>
        </table>
        </div>

        <!-- Form dan Konfirmasi -->
        <GuruForm
        v-if="tampilkanForm"
        :mode="formMode"
        :dataGuru="dataEdit"
        @close="handleFormClose"
        @saved="handleFormSaved"
        />

        <ConfirmModal
        v-if="showConfirm"
        :message="`Yakin ingin menghapus guru ini?`"
        @confirm="hapusGuru"
        @cancel="showConfirm = false"
        />
    </div>
</template>

<script>
import axios from '@/utils/axios'
import GuruForm from './GuruForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
    components: { GuruForm, ConfirmModal },
    data() {
        return {
        guruList: [],
        search: '',
        notifPesan: '',
        tampilkanForm: false,
        formMode: 'tambah',
        dataEdit: null,
        showConfirm: false,
        guruDihapus: null
        }
    },
    computed: {
        filteredGuru() {
        const keyword = this.search.toLowerCase()
        return this.guruList.filter(g =>
            g.karyawan?.nama?.toLowerCase().includes(keyword)
        )
        }
    },
    methods: {
        async ambilData() {
        try {
            const res = await axios.get('/guru')
            this.guruList = res.data
        } catch (err) {
            console.error('Gagal mengambil data guru:', err)
        }
        },
        tambahGuru() {
        this.formMode = 'tambah'
        this.dataEdit = null
        this.tampilkanForm = true
        },
        editGuru(guru) {
        this.formMode = 'edit'
        this.dataEdit = guru
        this.tampilkanForm = true
        },
        konfirmasiHapus(guru) {
        this.guruDihapus = guru
        this.showConfirm = true
        },
        async hapusGuru() {
        try {
            await axios.delete(`/guru/${this.guruDihapus.id}`)
            this.ambilData()
            this.tampilkanNotifikasi('Guru berhasil dihapus!')
        } catch (err) {
            console.error('Gagal menghapus guru:', err)
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
            mode === 'tambah' ? 'Guru berhasil ditambahkan!' : 'Guru berhasil diperbarui!'
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
