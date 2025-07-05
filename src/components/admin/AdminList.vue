<template>
  <div class="admin-list">
    <h3 class="fw-bold">
      Admin <small class="text-muted">Aplikasi Manajemen Data Karyawan</small></h3>

    <button class="btn btn-primary mb-3" @click="tambahAdmin">
      <i class="bi bi-plus-circle"></i> Tambah Admin
    </button>

    <table class="table table-bordered table-striped">
      <thead class="tabel-header-soft">
        <tr>
          <th>ID</th>
          <th>Nama</th>
          <th>Email</th>
          <th>Peran</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in admins" :key="admin.admin_id">
          <td>{{ admin.admin_id }}</td>
          <td>{{ admin.username }}</td>
          <td>{{ admin.email    }}</td>
          <td>{{ admin.peran    }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="editAdmin(admin)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="hapusAdmin(admin.admin_id)">Hapus</button>
          </td>
        </tr>
        <tr v-if="admins.length === 0">
          <td colspan="3" class="text-center text-muted">Tidak ada data admin</td>
        </tr>
      </tbody>
    </table>

    <!-- Form Modal -->
    <AdminForm v-if="showForm" :admin="selectedAdmin" @close="tutupForm" @saved="fetchAdmins" />
  </div>
</template>

<script>
import axios from '@/utils/axios'
import AdminForm from './AdminForm.vue'

export default {
  components: { AdminForm },
  data() {
    return {
      admins: [],
      showForm: false,
      selectedAdmin: null
    }
  },
  methods: {
    async fetchAdmins() {
      try {
        const res = await axios.get('/admins')
        this.admins = res.data
      } catch (err) {
        console.error('Gagal mengambil data admin:', err)
      }
    },
    tambahAdmin() {
      this.selectedAdmin = null
      this.showForm = true
    },
    editAdmin(admin) {
      this.selectedAdmin = { ...admin }
      this.showForm = true
    },
    async hapusAdmin(id) {
      if (confirm('Yakin ingin menghapus admin ini?')) {
        try {
          await axios.delete(`/admins/${admin_id}`)
          this.fetchAdmins()
        } catch (err) {
          console.error('Gagal menghapus admin:', err)
        }
      }
    },
    tutupForm() {
      this.showForm = false
      this.selectedAdmin = null
    }
  },
  mounted() {
    this.fetchAdmins()
  }
}
</script>

<style scoped>
.tabel-header-soft {
  background-color: #dbeeff; /* biru soft */
  color: #0d47a1; /* teks biru tua */
}

.table th {
  vertical-align: middle;
  text-align: center;
}

.table td {
  vertical-align: middle;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}
</style>