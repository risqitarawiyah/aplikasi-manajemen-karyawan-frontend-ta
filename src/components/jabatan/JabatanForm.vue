<template>
    <div class="modal-backdrop">
        <div class="modal-box">
        <div class="modal-header">
            <h5 class="modal-title">{{ mode === 'tambah' ? 'Tambah Jabatan' : 'Edit Jabatan' }}</h5>
            <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>

        <form @submit.prevent="mode === 'tambah' ? tambah() : update()">
            <div class="modal-body">
            <div class="mb-3">
                <label>Nama Jabatan</label>
                <input type="text" v-model="form.nama" class="form-control" required />
            </div>
            </div>

            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">Batal</button>
            <button type="submit" class="btn btn-primary">{{ mode === 'tambah' ? 'Tambah' : 'Simpan' }}</button>
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
            nama: ''
        }
        }
    },
    methods: {
        async tambah() {
        if (!this.form.nama) return alert('Nama jabatan harus diisi!')
        try {
            await axios.post('/jabatans', this.form)
            this.$emit('saved')
            this.$emit('close')
        } catch (err) {
            console.error('Gagal tambah jabatan:', err)
            alert('Gagal menambah jabatan.')
        }
        },
        async update() {
        if (!this.form.nama) return alert('Nama jabatan harus diisi!')
        try {
            await axios.put(`/jabatans/${this.dataEdit.id}`, this.form)
            this.$emit('saved')
            this.$emit('close')
        } catch (err) {
            console.error('Gagal update jabatan:', err)
            alert('Gagal memperbarui jabatan.')
        }
        }
    },
    mounted() {
        if (this.mode === 'edit' && this.dataEdit) {
        this.form.nama = this.dataEdit.nama
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
    width: 400px;
    max-height: 90vh;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-header {
    background-color: #dbeeff;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
}

.modal-body {
    padding: 16px;
    flex: 1;
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
</style>
