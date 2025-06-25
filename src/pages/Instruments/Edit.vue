<template lang="pug">
q-page.q-pa-md
	h2 {{ isNew ? "Add Instrument" : "Edit Instrument" }}
	.row.q-col-gutter-md(v-if="instrument")
		.col-6: q-input(v-model="instrument.name" label="Name" filled outlined)
		.col-6: q-input(v-model="instrument.ip" label="IP Address" filled outlined)
		.text-h6 Type
		.col-12: q-btn-toggle(v-model="instrument.type" label="Type" outlined spread, :options="Defs")

		.col-12: component(:config="instrument.config", :instrument_id="id", :is="views[instrument.type]")

		q-page-sticky(position="bottom-right", :offset="[18, 18]")
			q-btn(label="Delete" color="negative" @click="onDelete")
		q-page-sticky(position="bottom-left", :offset="[18, 18]")
			q-btn(label="<<" color="primary" round, :to="`/instruments/${props.id}`")
	div(v-else)
		p Instrument not found

	q-expansion-item.bg-secondary.q-mt-xl(label="Config" icon="code")
		pre {{ instrument.config }}
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from "vue"
import { useInstrumentsStore, Defs } from "stores/instruments"
import { useRouter } from "vue-router"

import { useInstrument } from "./useInstrument.js"

const views = {
	guitar: defineAsyncComponent(() => import("./forms/guitar.vue")),
}

const props = defineProps({
	id: {
		type: [String, Number],
		required: true,
	},
})
const id = computed(() => Number(props.id))
const store = useInstrumentsStore()
const router = useRouter()
const { instrument } = useInstrument(id)

// let instrument = null
// instrument = ref(store.instruments.find((i) => i.id === id.value))

function onDelete() {
	store.removeInstrument(id.value)
	router.push({ name: "instruments" })
}
</script>
