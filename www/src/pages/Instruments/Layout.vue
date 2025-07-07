<template lang="pug">
q-page(padding)
	q-tabs.bg-secondary
		q-route-tab(name="view" label="View", :to="`/instrument/${id}`")
		q-route-tab(name="edit" label="Edit", :to="`/instrument/${id}/edit`")
		q-route-tab(name="api" label="API", :to="`/instrument/${id}/api`")
	router-view
</template>
<script setup>
import { useRoute } from "vue-router"

const route = useRoute()

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
})
</script>
