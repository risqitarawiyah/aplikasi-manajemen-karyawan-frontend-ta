<template>
  <div class="dashboard">
    <h3 class="fw-bold">
      Dashboard <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
    </h3>

    <div class="card-container">
      <div class="card green" @click="$router.push('/admin')">
        <div class="card-icon">👤</div>
        <div class="card-data">
          <h2>{{ count.admin }}</h2>
          <p>Admin</p>
        </div>
      </div>

      <div class="card red" @click="$router.push('/karyawan')">
        <div class="card-icon">👥</div>
        <div class="card-data">
          <h2>{{ count.karyawan }}</h2>
          <p>Karyawan</p>
        </div>
      </div>

      <div class="card blue" @click="$router.push('/divisi')">
        <div class="card-icon">🔗</div>
        <div class="card-data">
          <h2>{{ count.divisi }}</h2>
          <p>Divisi</p>
        </div>
      </div>

      <div class="card purple" @click="$router.push('/laporan')">
        <div class="card-icon">📄</div>
        <div class="card-data">
          <h2>{{ count.laporan }}</h2>
          <p>Laporan</p>
        </div>
      </div>
    </div>

    <div class="calendar-card mt-4">
      <h5 class="mb-3"><i class="bi bi-calendar-event me-2"></i> Kalender</h5>
      <v-calendar 
        :attributes="calendarAttributes"
        is-expanded
        color="blue" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/axios'

const count = ref({
  admin: 0,
  karyawan: 0,
  divisi: 0,
  laporan: 0
})

const fetchCounts = async () => {
  try {
    const [admin, karyawan, divisi, laporan] = await Promise.all([
      axios.get('/admins/count'),         //sesuaikan dengan app.js
      axios.get('/karyawans/count'),
      axios.get('/divisis/count'),
      axios.get('/laporans/count')
    ])
    count.value.admin = admin.data?.count || 0
    count.value.karyawan = karyawan.data?.count || 0
    count.value.divisi = divisi.data?.count || 0
    count.value.laporan = laporan.data?.count || 0
  } catch (err) {
    console.error('Gagal memuat data dashboard:', err)
  }
}

onMounted(() => {
  fetchCounts()
})

const today = new Date().toISOString().split('T')[0]
const calendarAttributes = ref([
  {
    key: 'today',
    highlight: true,
    dates: today,
    customData: { isToday: true },
    contentStyle: {
      backgroundColor: '#66bfff',
      color: 'white',
      borderRadius: '50%'
    }
  }
])
</script>


<style scoped>
.dashboard {
  padding: 20px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.card {
  flex: 1 1 200px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  color: #333;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-3px);
}

.card-icon {
  font-size: 32px;
  margin-right: 15px;
}

.card-data h2 {
  margin: 0;
  font-size: 24px;
}

.card-data p {
  margin: 0;
  color: #888;
}

.card.red {
  background-color: #ffe5e5;
}

.card.blue {
  background-color: #e5e9ff;
}

.card.green {
  background-color: #e5ffec;
}

.card.purple {
  background-color: #f1e5ff;
}

.calendar-card {
  background-color: #f1fbff;
  padding: 20px;
  border-radius: 10px;
  max-width: 350px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.calendar-card h5 {
  color: #333;
  font-weight: 600;
  font-size: 16px;
}
</style>
