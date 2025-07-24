<template>
  <div class="dashboard">
    <h3 class="fw-bold">
        Dashboard <small class="text-muted">Aplikasi Manajemen Data Karyawan</small>
    </h3>

    <!-- Kartu Utama -->
    <div class="card-container">
      <div class="card red" @click="$router.push('/karyawan')">
        <div class="card-icon">👥</div>
        <div class="card-data">
          <h2>{{ count.karyawan }}</h2>
          <p>Karyawan</p>
        </div>
      </div>

      <div class="card green" @click="$router.push('/guru')">
        <div class="card-icon">👩‍🏫</div>
        <div class="card-data">
          <h2>{{ count.guru }}</h2>
          <p>Guru</p>
        </div>
      </div>

      <div class="card yellow" @click="$router.push('/walikelas')">
        <div class="card-icon">🧑‍🏫</div>
        <div class="card-data">
          <h2>{{ count.walikelas }}</h2>
          <p>Wali Kelas</p>
        </div>
      </div>

      <div class="card orange" @click="$router.push('/laporanabsensi')">
        <div class="card-icon">📊</div>
        <div class="card-data">
          <h2>{{ count.laporanAbsensi }}</h2>
          <p>Laporan Absensi</p>
        </div>
      </div>
    </div>

    <!-- Detail Lainnya -->
    <details class="mt-4">
      <summary class="summary-link">📂 Detail Lainnya</summary>
      <div class="card-container mt-3">
        <div class="card teal" @click="$router.push('/absensi')">
          <div class="card-icon">📘</div>
          <div class="card-data">
            <h2>{{ count.absensi }}</h2>
            <p>Absensi</p>
          </div>
        </div>

        <div class="card blue" @click="$router.push('/divisi')">
          <div class="card-icon">🏢</div>
          <div class="card-data">
            <h2>{{ count.divisi }}</h2>
            <p>Divisi</p>
          </div>
        </div>

        <div class="card purple" @click="$router.push('/jabatan')">
          <div class="card-icon">🧰</div>
          <div class="card-data">
            <h2>{{ count.jabatan }}</h2>
            <p>Jabatan</p>
          </div>
        </div>

        <div class="card teal" @click="$router.push('/mapel')">
          <div class="card-icon">📘</div>
          <div class="card-data">
            <h2>{{ count.mapel }}</h2>
            <p>Mapel</p>
          </div>
        </div>

        <div class="card gray" @click="$router.push('/kelas')">
          <div class="card-icon">🏫</div>
          <div class="card-data">
            <h2>{{ count.kelas }}</h2>
            <p>Kelas</p>
          </div>
        </div>

        <div class="card dark" @click="$router.push('/statuskepegawaian')">
          <div class="card-icon">📑</div>
          <div class="card-data">
            <h2>{{ count.statusKepegawaian }}</h2>
            <p>Status Kepegawaian</p>
          </div>
        </div>
      </div>
    </details>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'Dashboard',
  data() {
    return {
      count: {
        karyawan: 0,
        guru: 0,
        walikelas: 0,
        absensi: 0,
        laporanAbsensi: 0,
        divisi: 0,
        jabatan: 0,
        mapel: 0,
        kelas: 0,
        statusKepegawaian: 0,
      },
    };
  },
  mounted() {
    this.fetchCounts();
  },
  methods: {
    async fetchCounts() {
      try {
        const res = await axios.get('/dashboard');
        this.count = res.data;
      } catch (error) {
        console.error('Gagal mengambil data dashboard:', error);
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 20px;
}

.card {
  padding: 20px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.card-data h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.card-data p {
  margin: 0;
  font-size: 14px;
  color: #555;
}

/* Warna kartu */
.red { background-color: #ffdddd; }
.green { background-color: #ddffdd; }
.yellow { background-color: #fffacc; }
.orange { background-color: #ffe6cc; }
.blue { background-color: #ddeeff; }
.purple { background-color: #e5ddff; }
.teal { background-color: #ddfff3; }
.gray { background-color: #f0f0f0; }
.dark { background-color: #e0e0e0; }

/* Dropdown summary */
details summary {
  font-weight: 600;
  font-size: 16px;
  color: #007bff;
  outline: none;
  cursor: pointer;
}

details[open] summary {
  margin-bottom: 10px;
}
</style>
