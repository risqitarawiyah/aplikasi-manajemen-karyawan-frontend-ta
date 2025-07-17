<template>
    <div class="walikelas-view">
        <WaliKelasList />
    </div>
</template>

<script>
import WaliKelasList from "@/components/walikelas/WaliKelasList.vue";

export default {
    name: "WaliKelasView",
    components: {
        WaliKelasList,
    },
};
</script>

<style scoped>
.divisi-view {
    padding: 20px;
}
</style>
