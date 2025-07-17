<!-- src/views/Laporan.vue -->
<template>
    <div class="laporanabsensi-view">
        <LaporanAbsensiList />
    </div>
</template>

<script>
import LaporanAbsensiList from '@/components/laporanabsensi/LaporanAbsensiList.vue';

export default {
    components: { LaporanAbsensiList }
}
</script>

<style scoped>
.laporan-view {
    padding: 20px;
}
</style>
