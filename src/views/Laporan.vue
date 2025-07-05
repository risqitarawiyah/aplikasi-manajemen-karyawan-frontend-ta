<!-- src/views/Laporan.vue -->
<template>
    <div class="laporan-view">
        <LaporanList />
    </div>
</template>

<script>
import LaporanList from '@/components/laporan/LaporanList.vue';

export default {
    components: { LaporanList }
}
</script>

<style scoped>
.laporan-view {
    padding: 20px;
}
</style>
