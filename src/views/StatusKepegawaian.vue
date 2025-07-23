<template>
    <div class="status-view">
        <StatusKepegawaianList />
    </div>
</template>

<script>
import StatusKepegawaianList from "@/components/statuskepegawaian/StatusKepegawaianList.vue";

export default {
    name: "StatusView",
    components: {
        StatusKepegawaianList,
    },
};
</script>

<style scoped>
.divisi-view {
    padding: 20px;
}
</style>
