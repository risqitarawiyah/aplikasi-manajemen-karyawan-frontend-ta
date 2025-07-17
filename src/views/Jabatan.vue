<template>
    <div class="jabatan-view">
        <JabatanList />
    </div>
</template>

<script>
import JabatanList from "@/components/jabatan/JabatanList.vue";

export default {
    name: "JabatanView",
    components: {
        JabatanList,
    },
};
</script>

<style scoped>
.jabatan-view {
    padding: 20px;
}
</style>
