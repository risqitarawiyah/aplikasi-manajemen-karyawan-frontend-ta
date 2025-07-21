<template>
    <div class="modal-backdrop">
        <div class="modal-box">
        <!-- Header -->
        <div class="modal-header">
            <h5 class="modal-title">
            {{ mode === 'tambah' ? 'Tambah Mapel' : 'Edit Mapel' }}
            </h5>
            <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="mode === 'tambah' ? tambahMapel() : updateMapel()">
            <div class="modal-body">
            <div class="mb-3">
                <label>Nama Mapel</label>
                <input
                type="text"
                v-model="form.nama"
                class="form-control"
                required
                placeholder="Contoh: Matematika, Bahasa Indonesia, Fisika"
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
        async tambahMapel() {
        if (!this.form.nama) {
            alert('Nama mapel wajib diisi!')
            return
        }

        try {
            await axios.post('/mapel', this.form)
            this.$emit('saved')
            this.$emit('close')
        } catch (err) {
            console.error('Gagal tambah mapel:', err)
            alert('Gagal menambah mapel.')
        }
        },

        async updateMapel() {
        if (!this.form.nama) {
            alert('Nama mapel wajib diisi!')
            return
        }

        try {
            await axios.put(`/mapel/${this.dataEdit.id}`, this.form)
            this.$emit('saved')
            this.$emit('close')
        } catch (err) {
            console.error('Gagal update mapel:', err)
            alert('Gagal memperbarui mapel.')
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
