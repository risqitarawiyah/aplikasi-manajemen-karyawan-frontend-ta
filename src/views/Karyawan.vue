<template>
  <div class="karyawan-view">
    <KaryawanList />
  </div>
</template>

<script>
import KaryawanList from "@/components/karyawan/KaryawanList.vue";

export default {
  name: "KaryawanView",
  components: {
    KaryawanList,
  },
};
</script>

<style scoped>
.karyawan-view {
  padding: 20px;
}
</style>
