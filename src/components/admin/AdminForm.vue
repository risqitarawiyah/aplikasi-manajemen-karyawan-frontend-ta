<template>
<div class="admin-form p-4 border rounded shadow-sm bg-light">
    <h5 class="fw-bold mb-3">{{ admin ? 'Edit Admin' : 'Tambah Admin' }}</h5>
    <form @submit.prevent="submitForm">
    <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="form.username" type="text" class="form-control" required />
    </div>
    <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="form.password" type="password" class="form-control" :required="!admin" />
    </div>
    <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">{{ admin ? 'Simpan Perubahan' : 'Tambah' }}</button>
        <button type="button" class="btn btn-secondary" @click="$emit('close')">Batal</button>
    </div>
    </form>
</div>
</template>

<script>
import axios from '@/utils/axios'

export default {
    props: ['admin'],
    data() {
        return {
        form: {
            username: '',
            password: ''
        }
        }
    },
    watch: {
        admin: {
        immediate: true,
        handler(value) {
            if (value) {
            this.form.username = value.username
            this.form.password = ''
            }
        }
        }
    },
    methods: {
        async submitForm() {
        try {
            if (this.admin) {
            await axios.put(`/admins/${this.admin.admin_id}`, this.form)
            } else {
            await axios.post('/admins', this.form)
            }
            this.$emit('saved')
            this.$emit('close')
        } catch (err) {
            console.error('Gagal menyimpan admin:', err)
        }
        }
    }
}
</script>
