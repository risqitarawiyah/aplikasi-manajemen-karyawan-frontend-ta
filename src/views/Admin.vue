<template>
    <div class="admin-view">
        <AdminList />
    </div>
</template>

<script>
import AdminList from '@/components/admin/AdminList.vue'

export default {
    name: 'AdminView',
    components: {
        AdminList
    }
}
</script>

<style scoped>
.admin-view {
    padding: 20px;
}
</style>
