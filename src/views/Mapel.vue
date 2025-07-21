<template>
    <div class="mapel-view">
        <MapelList />
    </div>
</template>

<script>
import MapelList from "@/components/mapel/MapelList.vue";

export default {
    name: "MapelView",
    components: {
        MapelList,
    },
};
</script>

<style scoped>
.divisi-view {
    padding: 20px;
}
</style>
