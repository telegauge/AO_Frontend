<template lang="pug">
q-page(padding)
	//- h2 {{ isNew ? "Add Instrument" : "Edit Instrument" }}
	div(v-if="instrument")
		.row.q-col-gutter-md
			.col-12.col-md-4
				q-select(
					v-model="instrument.type"
					label="Type"
					emit-value
					filled
					map-options
					outlined
					spread,
					:options="Defs"
				)
					template(#prepend)
						q-icon(:name="Defs.find((d) => d.value === instrument.type).icon")
					template(#option="scope")
						q-item(v-bind="scope.itemProps" clickable)
							q-item-section(v-if="scope.opt.icon" avatar)
								q-icon(:name="scope.opt.icon")
							q-item-section
								q-item-label {{ scope.opt.label }}
								q-item-label(caption) {{ scope.opt.description }}
			.col-12.col-md-4
				q-input(
					v-model="instrument.name"
					label="Name"
					counter
					filled
					lazy-rules
					outlined,
					:rules="[(v) => v.length <= 11 || 'Name should be 11 characters or less to be fully displayed on the instrument.']"
				)
			.col-12.col-md-4
				q-input(v-model="instrument.ip" label="IP Address" placeholder="192.168.1.1" filled outlined)
					template(#prepend)
						q-icon(name="mdi-wifi")

			//- .col-12
			//- 	q-btn-toggle(v-model="instrument.type" label="Type" outlined spread, :options="Defs")

			.col-12
				component(:config="instrument.config", :instrument_id="id", :is="views[instrument.type]")

			.col-8
				q-btn.fit(
					:label="`Download Config to '${instrument.ip}'`"
					color="primary"
					icon="mdi-playlist-music"
					rounded
					size="lg"
					@click="onSendConfig",
					:loading="config_working"
				)
			.col-4
				q-btn.fit(
					:label="`Upload from '${instrument.ip}'`"
					color="secondary"
					icon="mdi-upload"
					rounded
					size="lg"
					@click="onUploadConfig",
					:loading="config_working"
				)
		q-page-sticky(position="bottom-right", :offset="[18, 18]")
			q-btn(label="Delete" color="negative" @click="onDelete")
	div(v-else)
		p Instrument not found

	q-expansion-item.bg-secondary.q-mt-xl(label="Config" icon="code")
		Raw(:raw="instrument")
</template>

<script setup>
import { ref, computed, defineAsyncComponent, watch } from "vue"
import { useInstrumentsStore, Defs } from "stores/instruments"
import { useRouter } from "vue-router"
import { useInstrument } from "./useInstrument.js"
import { Notify } from "quasar"

import Raw from "@/components/Raw.vue"

const views = {
	guitar: defineAsyncComponent(() => import("../../instruments/Guitar/GuitarEdit.vue")),
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
const { instrument, sendCmd } = useInstrument(id)

function onDelete() {
	store.removeInstrument(id.value)
	router.push("/instruments")
}

const config_working = ref(false)
async function onSendConfig() {
	config_working.value = true
	console.log("send config", instrument.value)
	var result = await sendCmd("POST", "save_config", { config: JSON.stringify(instrument.value) })
	console.log(">>", result)
	Notify.create({
		message: result.result,
		color: result.status ? "positive" : "negative",
	})
	config_working.value = false
}

async function onUploadConfig() {
	config_working.value = true
	console.log("upload config", instrument.value)
	var result = await sendCmd("GET", "load_config", {})
	console.log(">>", result)
	if (result) {
		var config = JSON.parse(JSON.stringify(result))
		delete config.id
		delete config.name
		Object.assign(instrument.value, config, { deep: true })
		// instrument.value.config = config
	}
	config_working.value = false
}
</script>
