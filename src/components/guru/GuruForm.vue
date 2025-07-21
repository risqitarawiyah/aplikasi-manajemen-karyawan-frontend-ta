<template>
    <div class="modal-backdrop">
        <div class="modal-box">
        <!-- Header -->
        <div class="modal-header">
            <h5 class="modal-title">
            {{ mode === 'tambah' ? 'Tambah Guru' : 'Edit Guru' }}
            </h5>
            <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="mode === 'tambah' ? tambahGuru() : updateGuru()">
            <div class="modal-body">
            <div class="mb-3">
                <label>Karyawan</label>
                <select v-model="form.karyawanId" class="form-control" required>
                <option disabled value="">Pilih Karyawan</option>
                <option v-for="k in karyawanList" :key="k.id" :value="k.id">
                    {{ k.nama }}
                </option>
                </select>
            </div>

            <div class="mb-3">
                <label>Mapel</label>
                <select v-model="form.mapelId" class="form-control" required>
                <option disabled value="">Pilih Mapel</option>
                <option v-for="m in mapelList" :key="m.id" :value="m.id">
                    {{ m.nama }}
                </option>
                </select>
            </div>

            <div class="mb-3">
                <label>Jumlah JTM</label>
                <input type="number" v-model="form.jumlahJtm" class="form-control" min="0" />
            </div>

            <div class="mb-3">
                <label>Penempatan</label>
                <select v-model="form.penempatan" class="form-control" required>
                <option disabled value="">Pilih</option>
                <option value="SATMINKAL">SATMINKAL</option>
                <option value="NON_SATMINKAL">NON SATMINKAL</option>
                </select>
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
        dataGuru: Object
    },
    data() {
        return {
        form: {
            karyawanId: '',
            mapelId: '',
            jumlahJtm: '',
            penempatan: ''
        },
        karyawanList: [],
        mapelList: []
        }
    },
    methods: {
        async fetchDropdowns() {
        try {
            const [karyawanRes, mapelRes] = await Promise.all([
            axios.get('/karyawans'),
            axios.get('/mapel')
            ])
            this.karyawanList = karyawanRes.data
            this.mapelList = mapelRes.data
        } catch (err) {
            console.error('Gagal memuat karyawan/mapel:', err)
        }
        },
        async tambahGuru() {
        try {
            await axios.post('/guru', this.form)
            this.$emit('saved')
            this.$emit('close')
        } catch (err) {
            console.error('Gagal tambah guru:', err)
            alert('Gagal menambah guru.')
        }
        },
        async updateGuru() {
        try {
            await axios.put(`/guru/${this.dataGuru.id}`, this.form)
            this.$emit('saved')
            this.$emit('close')
        } catch (err) {
            console.error('Gagal update guru:', err)
            alert('Gagal memperbarui data guru.')
        }
        }
    },
    mounted() {
        this.fetchDropdowns()

        if (this.mode === 'edit' && this.dataGuru) {
        const { karyawanId, mapelId, jumlahJtm, penempatan } = this.dataGuru
        this.form = {
            karyawanId,
            mapelId,
            jumlahJtm,
            penempatan
        }
        }
    }
}
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-box {
    background: white;
    width: 500px;
    max-height: 90vh;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-box form {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.modal-body {
    padding: 16px;
    overflow-y: auto;
    flex: 1;
}

.modal-header {
    background-color: #dbeeff;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
}

.modal-footer {
    padding: 12px 16px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    background-color: #f8f9fa;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #000;
    cursor: pointer;
}

select.form-control {
    appearance: auto;
}
</style>
