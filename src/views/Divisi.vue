<template>
  <div class="divisi-view">
    <DivisiList />
  </div>
</template>

<script>
import DivisiList from "@/components/divisi/DivisiList.vue";

export default {
  name: "DivisiView",
  components: {
    DivisiList,
  },
};
</script>

<style scoped>
.divisi-view {
  padding: 20px;
}
</style>
