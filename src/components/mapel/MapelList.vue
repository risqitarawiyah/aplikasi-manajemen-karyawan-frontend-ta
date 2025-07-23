<template>
    <div class="mapel-list">
        <h4 class="fw-bold mb-4">
            Data Mapel <small class="text-muted">Aplikasi Manajemen Data</small>
        </h4>

        <div class="d-flex justify-content-between align-items-center mb-3">
        <div style="max-width: 300px; width: 100%;">
            <input
            type="text"
            v-model="search"
            class="form-control"
            placeholder="Cari nama mapel..."
            >
        </div>

        <button class="btn btn-primary ms-2" @click="tambahMapel">
            <i class="bi bi-plus-circle"></i> Tambah Mapel
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
                <th>Nama Mapel</th>
                <th>Aksi</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(mapel, index) in filteredMapel" :key="mapel.id">
                <td>{{ index + 1 }}</td>
                <td>{{ mapel.nama }}</td>
                <td>
                <button class="btn btn-sm btn-warning me-2" @click="editMapel(mapel)">Edit</button>
                <button class="btn btn-sm btn-danger" @click="konfirmasiHapus(mapel)">Hapus</button>
                </td>
            </tr>
            <tr v-if="mapelList.length === 0">
                <td colspan="3" class="text-center text-muted">Tidak ada data mapel</td>
            </tr>
            </tbody>
        </table>
        </div>

        <!-- Modal Form -->
        <MapelForm
        v-if="tampilkanForm"
        :mode="formMode"
        :dataEdit="dataEdit"
        @close="handleFormClose"
        @saved="handleFormSaved"
        />

        <!-- Konfirmasi Hapus -->
        <ConfirmModal
        v-if="showConfirm"
        :message="`Yakin ingin menghapus mapel ini?`"
        @confirm="hapusMapel"
        @cancel="showConfirm = false"
        />
    </div>
</template>

<script>
import axios from '@/utils/axios'
import ConfirmModal from '@/components/ConfirmModal.vue'
import MapelForm from './MapelForm.vue'

export default {
    components: { ConfirmModal, MapelForm },
    data() {
        return {
        mapelList: [],
        mapelDihapus: null,
        showConfirm: false,
        search: '',
        tampilkanForm: false,
        formMode: 'tambah',
        notifPesan: '',
        dataEdit: null
        }
    },
    computed: {
        filteredMapel() {
        const keyword = this.search.toLowerCase()
        return this.mapelList.filter(m => m.nama?.toLowerCase().includes(keyword))
        }
    },
    methods: {
        async ambilData() {
        try {
            const res = await axios.get('/mapel')
            this.mapelList = res.data
        } catch (err) {
            console.error('Gagal mengambil data mapel:', err)
        }
        },
        tambahMapel() {
        this.formMode = 'tambah'
        this.dataEdit = null
        this.tampilkanForm = true
        },
        editMapel(mapel) {
        this.formMode = 'edit'
        this.dataEdit = mapel
        this.tampilkanForm = true
        },
        konfirmasiHapus(mapel) {
        this.mapelDihapus = mapel
        this.showConfirm = true
        },
        async hapusMapel() {
        try {
            await axios.delete(`/mapel/${this.mapelDihapus.id}`)
            this.ambilData()
            this.tampilkanNotifikasi('Mapel berhasil dihapus!')
        } catch (err) {
            console.error('Gagal menghapus mapel:', err)
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
        handleFormClose() {
        this.tampilkanForm = false
        },
        async handleFormSaved() {
        const mode = this.formMode
        this.tampilkanForm = false
        await this.ambilData()
        this.tampilkanNotifikasi(
            mode === 'tambah' ? 'Mapel berhasil ditambahkan!' : 'Mapel berhasil diperbarui!'
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
