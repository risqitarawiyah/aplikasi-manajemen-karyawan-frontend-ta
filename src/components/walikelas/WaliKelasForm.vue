<template>
    <div class="modal-backdrop">
        <div class="modal-box">
        <!-- Header -->
        <div class="modal-header">
            <h5 class="modal-title">
            {{ mode === 'tambah' ? 'Tambah Wali Kelas' : 'Edit Wali Kelas' }}
            </h5>
            <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit">
            <div class="modal-body">
            <!-- Guru -->
            <div class="mb-3">
                <label class="form-label">Guru</label>
                <select v-model="form.guruId" class="form-select text-black" required>
                <option disabled value="">-- Pilih Guru --</option>
                <option v-for="g in guruList" :key="g.id" :value="g.id">
                    {{ g.karyawan?.nama }}
                </option>
                </select>
            </div>

            <!-- Kelas -->
            <div class="mb-3">
            <label class="form-label">Kelas</label>
            <select v-model="form.kelasId" class="form-select text-black" required>
                <option disabled value="">-- Pilih Kelas --</option>
                <option
                v-for="kelas in kelasList"
                :key="kelas.id"
                :value="kelas.id"
                >
                {{ kelas.tingkat }} {{ kelas.jurusan }} - {{ kelas.ruang }}
                </option>
            </select>
            </div>

            <!-- Tahun Ajaran -->
            <div class="mb-3">
                <label class="form-label">Tahun Ajaran</label>
                <input
                type="text"
                v-model="form.tahun_ajaran"
                class="form-control"
                required
                placeholder="Contoh: 2024/2025"
                pattern="^[0-9]{4}/[0-9]{4}$"
                title="Format harus seperti 2024/2025"
                />
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
        mode: { type: String, default: 'tambah' },
        dataEdit: { type: Object, default: null }
    },
    data() {
        return {
        form: {
            guruId: '',
            kelasId: '',
            tahun_ajaran: ''
        },
        guruList: [],
        kelasList: []
        }
    },
    methods: {
        async ambilGuru() {
        try {
            const res = await axios.get('/guru')
            this.guruList = res.data
        } catch (err) {
            console.error('Gagal mengambil data guru:', err)
        }
        },
        async ambilKelas() {
        try {
            const res = await axios.get('/kelas')
            this.kelasList = res.data
        } catch (err) {
            console.error('Gagal ambil data kelas:', err)
        }
        },
        async handleSubmit() {
        try {
            if (this.mode === 'tambah') {
            await axios.post('/walikelas', this.form)
            } else {
            await axios.put(`/walikelas/${this.dataEdit.id}`, this.form)
            }
            this.$emit('saved')
            this.$emit('close')
        } catch (err) {
            console.error('Gagal menyimpan data wali kelas:', err)
            alert('Terjadi kesalahan saat menyimpan.')
        }
        },
        isiFormEdit() {
        if (this.mode === 'edit' && this.dataEdit) {
            this.form = {
            guruId: this.dataEdit.guruId,
            kelasId: this.dataEdit.kelasId,
            tahun_ajaran: this.dataEdit.tahun_ajaran
            }
        }
        }
    },
    mounted() {
        this.ambilGuru()
        this.ambilKelas()
        this.isiFormEdit()
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
/* Tambahan agar option dropdown selalu terbaca */
select option {
    color: #000;
}
.form-select {
    color: #000 !important;
}
</style>