<template>
    <div class="jabatan-list">
        <h3 class="fw-bold">
        Jabatan <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
        </h3>

        <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- Search -->
        <div style="max-width: 300px; width: 100%;">
            <input
            type="text"
            v-model="search"
            class="form-control"
            placeholder="Cari nama jabatan..."
            />
        </div>

        <!-- Tombol tambah -->
        <button class="btn btn-primary" @click="tambahJabatan">
            <i class="bi bi-plus-circle"></i> Tambah Jabatan
        </button>
        </div>

        <!-- Notifikasi -->
        <div v-if="notifPesan" class="alert alert-success" role="alert">
        {{ notifPesan }}
        </div>

        <table class="table table-bordered table-striped">
        <thead class="tabel-header-soft">
            <tr>
            <th>ID</th>
            <th>Nama Jabatan</th>
            <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="jabatan in filteredJabatans" :key="jabatan.id">
            <td>{{ jabatan.id }}</td>
            <td>{{ jabatan.nama }}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" @click="editJabatan(jabatan)">Edit</button>
                <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(jabatan)">Hapus</button>
            </td>
            </tr>
            <tr v-if="filteredJabatans.length === 0">
            <td colspan="3" class="text-center text-muted">Belum ada data jabatan</td>
            </tr>
        </tbody>
        </table>

        <!-- Form -->
        <JabatanForm
        v-if="tampilkanForm"
        :mode="modeForm"
        :dataEdit="dataEdit"
        @close="tampilkanForm = false"
        @saved="handleFormSaved"
        />

        <!-- Konfirmasi -->
        <ConfirmModal
        v-if="showConfirm"
        :message="`Yakin ingin menghapus jabatan ini?`"
        @confirm="hapusJabatan"
        @cancel="showConfirm = false"
        />
    </div>
</template>

<script>
import axios from '@/utils/axios'
import JabatanForm from './JabatanForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
    components: { JabatanForm, ConfirmModal },
    data() {
        return {
        jabatans: [],
        tampilkanForm: false,
        modeForm: 'tambah',
        dataEdit: null,
        jabatanDihapus: null,
        showConfirm: false,
        notifPesan: '',
        search: ''
        }
    },
    computed: {
        filteredJabatans() {
        const keyword = this.search.toLowerCase()
        return this.jabatans.filter(j =>
            j.nama?.toLowerCase().includes(keyword)
        )
        }
    },
    methods: {
        async loadJabatans() {
        try {
            const res = await axios.get('/jabatans')
            this.jabatans = res.data
        } catch (err) {
            console.error('Gagal memuat data jabatan:', err)
        }
        },
        tambahJabatan() {
        this.modeForm = 'tambah'
        this.dataEdit = null
        this.tampilkanForm = true
        },
        editJabatan(jabatan) {
        this.modeForm = 'edit'
        this.dataEdit = jabatan
        this.tampilkanForm = true
        },
        konfirmasiHapus(jabatan) {
        this.jabatanDihapus = jabatan
        this.showConfirm = true
        },
        async hapusJabatan() {
        try {
            await axios.delete(`/jabatans/${this.jabatanDihapus.id}`)
            this.loadJabatans()
            this.tampilkanNotifikasi('Jabatan berhasil dihapus!')
        } catch (err) {
            console.error('Gagal menghapus jabatan:', err)
            alert('Gagal menghapus jabatan.')
        } finally {
            this.showConfirm = false
        }
        },
        tampilkanNotifikasi(pesan) {
        this.notifPesan = pesan
        setTimeout(() => {
            this.notifPesan = ''
        }, 3000)
        },
        async handleFormSaved() {
        const mode = this.modeForm
        this.tampilkanForm = false
        await this.loadJabatans()
        this.tampilkanNotifikasi(
            mode === 'tambah' ? 'Jabatan berhasil ditambahkan!' : 'Jabatan berhasil diperbarui!'
        )
        }
    },
    mounted() {
        this.loadJabatans()
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
