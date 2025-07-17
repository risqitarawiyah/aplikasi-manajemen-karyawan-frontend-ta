<template>
    <div class="modal-backdrop">
        <div class="modal-box">
        <!-- Header -->
        <div class="modal-header">
            <h5 class="modal-title">
            {{ mode === 'tambah' ? 'Tambah Absensi' : 'Edit Absensi' }}
            </h5>
            <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="mode === 'tambah' ? tambahAbsensi() : updateAbsensi()">
            <div class="modal-body">
            <div class="mb-3">
                <label for="karyawanId">Nama Karyawan</label>
                <select v-model="form.karyawanId" class="form-select" required>
                <option disabled value="">-- Pilih Karyawan --</option>
                <option v-for="k in karyawanList" :key="k.id" :value="k.id">
                    {{ k.nama }}
                </option>
                </select>
            </div>

            <div class="mb-3">
                <label for="tanggal">Tanggal</label>
                <input type="date" v-model="form.tanggal" class="form-control" required />
            </div>

            <div class="mb-3">
                <label for="status">Status</label>
                <select v-model="form.status" class="form-select" required>
                <option disabled value="">-- Pilih Status --</option>
                <option value="TW">TW</option>
                <option value="TD">TD</option>
                <option value="LP">LP</option>
                <option value="DL">DL</option>
                <option value="S">S</option>
                <option value="I">I</option>
                <option value="A">A</option>
                <option value="C">C</option>
                </select>
                <small class="text-muted d-block mt-1" style="font-size: 0.85rem;">
                <strong>Keterangan:</strong>
                TW = Tepat Waktu, TD = Terlambat Datang, LP = Lekas Pulang, DL = Dinas Luar,
                S = Sakit, I = Izin, A = Alpha, C = Cuti
                </small>
            </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">Batal</button>
            <button type="submit" class="btn btn-primary">
                {{ mode === 'tambah' ? 'Tambah' : 'Simpan Perubahan' }}
            </button>
            </div>
        </form>
        </div>
    </div>
</template>

<script>
import axios from '@/utils/axios'

export default {
    props: {
        mode: String,
        dataEdit: Object
    },
    data() {
        return {
        form: {
            karyawanId: '',
            tanggal: '',
            status: ''
        },
        karyawanList: []
        }
    },
    methods: {
        async ambilKaryawan() {
        try {
            const res = await axios.get('/karyawans')
            this.karyawanList = res.data
        } catch (err) {
            console.error('Gagal mengambil data karyawan:', err)
        }
        },
        async tambahAbsensi() {
        try {
            await axios.post('/absensis', this.form)
            this.$emit('saved')
            this.$emit('close')
        } catch (err) {
            console.error('Gagal tambah absensi:', err)
            alert('Gagal menambah absensi.')
        }
        },
        async updateAbsensi() {
        try {
            await axios.put(`/absensis/${this.dataEdit.id}`, this.form)
            this.$emit('saved')
            this.$emit('close')
        } catch (err) {
            console.error('Gagal update absensi:', err)
            alert('Gagal memperbarui absensi.')
        }
        }
    },
    mounted() {
        this.ambilKaryawan()
        if (this.mode === 'edit' && this.dataEdit) {
        this.form = {
            karyawanId: this.dataEdit.karyawanId,
            tanggal: this.dataEdit.tanggal?.slice(0, 10),
            status: this.dataEdit.status
        }
        }
    }
}
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-box {
    background: white;
    width: 500px;
    border-radius: 8px;
    overflow: hidden;
}

.modal-header {
    background-color: #dbeeff;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-body {
    padding: 16px;
}

.modal-footer {
    padding: 12px 16px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #000;
    cursor: pointer;
}
</style>
