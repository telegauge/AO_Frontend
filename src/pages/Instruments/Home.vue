<template lang="pug">
q-page(padding)
	.text-h6.text-center Add to the Band
	.row.q-gutter-md
		q-btn.col.q-mt-md(
			v-for="t of Defs",
			:key="t.value",
			:label="t.label"
			color="primary"
			stack,
			:icon="t.icon"
			@click="AddInstrument(t.value)",
			:disabled="t.disabled"
		)
			q-tooltip(v-if="t.examples") {{ t.examples.join(", ") }}...
	.row.q-mt-md.q-col-gutter-md
		.col-6.col-md-4.col-lg-3(v-for="instrument in instruments", :key="instrument.id")
			InstrumentCard(:instrument="instrument")
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useInstrumentsStore, Defs } from "stores/instruments"

import InstrumentCard from "./components/Card.vue"

const router = useRouter()
const store = useInstrumentsStore()
const instruments = store.instruments

function AddInstrument(type) {
	var instrument = ref({
		id: Date.now(),
		config_version: 1,
		name: `New ${type} Instrument`,
		type: type,
		ip: "",
		cmds: [],
		config: {},
	})
	store.instruments.push(instrument.value)
	router.push({ path: `/instruments/${instrument.value.id}/edit` })
}
</script>
