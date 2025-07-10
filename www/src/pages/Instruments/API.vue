<template lang="pug">
iframe.fill.q-my-md(:src="`http://${instrument.ip}`")
q-btn(
	:label="`http://${instrument.ip}`"
	color="primary"
	icon="open_in_new"
	no-caps,
	:href="`http://${instrument.ip}`"
	target="_blank"
)
</template>
<script setup>
import { useInstrument } from "../../instruments/useInstrument.js"
const props = defineProps({
	id: {
		type: String,
		required: true,
	},
})
const instrument_id = computed(() => Number(props.id))
const { instrument } = useInstrument(instrument_id)
</script>
<style lang="scss">
.fill {
	height: calc(100vh - 220px);
	width: 100%;
}
</style>
