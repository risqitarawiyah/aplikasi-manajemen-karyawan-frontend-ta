<template>
    <div class="kelas-view">
        <KelasList />
    </div>
</template>

<script>
import KelasList from "@/components/kelas/KelasList.vue";

export default {
    name: "KelasView",
    components: {
        KelasList,
    },
};
</script>

<style scoped>
.divisi-view {
    padding: 20px;
}
</style>
