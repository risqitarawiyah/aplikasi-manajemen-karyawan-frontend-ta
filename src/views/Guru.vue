<template>
    <div class="guru-view">
        <GuruList />
    </div>
</template>

<script>
import GuruList from "@/components/guru/GuruList.vue";

export default {
    name: "GuruView",
    components: {
        GuruList,
    },
};
</script>

<style scoped>
.divisi-view {
    padding: 20px;
}
</style>
