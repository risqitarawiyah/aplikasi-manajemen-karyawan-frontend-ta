<template>
    <div class="absensi-view">
        <AbsensiList />
    </div>
</template>

<script>
import AbsensiList from "@/components/absensi/AbsensiList.vue";

export default {
    name: "AbsensiView",
    components: {
        AbsensiList,
    },
};
</script>

<style scoped>
.divisi-view {
    padding: 20px;
}
</style>
