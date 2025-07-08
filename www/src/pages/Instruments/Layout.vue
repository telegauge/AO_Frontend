<template lang="pug">
q-page(padding)
	q-toolbar.bg-secondary
		q-avatar
			q-icon(:name="instrument.type")
		q-toolbar-title {{ instrument.name }}
		q-space
		q-tabs
			q-route-tab(name="view" label="View", :to="`/instrument/${id}`")
			q-route-tab(name="edit" label="Edit", :to="`/instrument/${id}/edit`")
			q-route-tab(name="api" label="API", :to="`/instrument/${id}/api`")
		q-space
		.row
			q-chip.col-shrink(
				:label="rest_status.label",
				:color="rest_status.color"
				text-color="white",
				:icon="rest_status.icon"
			)
			q-chip.col-shrink(:label="ws_status.label", :color="ws_status.color" text-color="white", :icon="ws_status.icon")
			q-chip.col-shrink(
				:label="batt_status.label",
				:color="batt_status.color"
				text-color="white",
				:icon="batt_status.icon"
			)
	router-view
</template>
<script setup>
import { useInstrument } from "../../instruments/useInstrument.js"
import { useRoute } from "vue-router"

const route = useRoute()

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
})
const instrument_id = computed(() => Number(props.id))
const { instrument, sendRestCmd, ws_online, rest_online } = useInstrument(instrument_id)

let last_batt_percent = 0
const batt_percent = ref(0)
const timer = ref(null)

onMounted(async () => {
	timer.value = setInterval(updateBattery, 120000)
	updateBattery()
})

onUnmounted(() => {
	clearInterval(timer.value)
})

const rest_status = computed(() => ({
	color: rest_online.value ? "positive" : "negative",
	label: "REST",
	icon: rest_online.value ? "mdi-wifi" : "mdi-wifi-alert",
}))
const ws_status = computed(() => ({
	color: ws_online.value ? "positive" : "negative",
	label: "WS",
	icon: ws_online.value ? "mdi-wifi-arrow-left-right" : "mdi-wifi-alert",
}))
const batt_status = computed(() => {
	var batt = "mdi-battery-"
	if (batt_percent.value > last_batt_percent) batt = "mdi-battery-charging-"
	return {
		color: batt_percent.value > 20 ? "positive" : batt_percent.value > 10 ? "warning" : "negative",
		label: batt_percent.value + "%",
		icon:
			batt_percent.value < 10
				? "mdi-battery-alert-variant-outline"
				: batt_percent.value >= 100
					? "mdi-battery-check"
					: batt + ((batt_percent.value / 10) | 0) + "0",
	}
})

const updateBattery = async () => {
	const batt = await sendRestCmd("GET", "battery")
	if (batt) {
		last_batt_percent = batt_percent.value
		batt_percent.value = batt.percent
	}
}
</script>
