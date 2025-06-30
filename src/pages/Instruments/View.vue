<template lang="pug">
q-page(padding)
	div(v-if="!instrument")
		q-banner Instrument not found
	div(v-else)
		//- //- q-toolbar.bg-secondary
		//- //-   q-avatar
		//- //-     q-icon(:name="instrument.type")
		//- //-   q-toolbar-title {{ instrument.name }}
		//- //-   q-btn(:href="`http://${instrument.ip}`" flat target="_blank") {{ instrument.ip }}
		//- //-   q-btn(icon="edit" flat :to="`/instruments/${props.id}/edit`")

		//- q-expansion-item(
		//- 	v-if="instrument.id",
		//- 	:label="instrument.name"
		//- 	expand-separator
		//- 	header-class="bg-secondary",
		//- 	:caption="instrument.type",
		//- 	:icon="instrument.type"
		//- 	@before-show="GetInfo"
		//- )
		//- 	q-card
		//- 		q-card-section(horizontal)
		//- 			q-card-section
		//- 				.text-h6 From Store
		//- 				li Type: {{ instrument.type }}
		//- 				li IP: {{ instrument.ip }}
		//- 				li Actions:
		//- 					ul
		//- 						li(v-for="cmd in def.cmd", :key="cmd") {{ cmd }}
		//- 			q-card-section(v-if="info")
		//- 				.text-h6 From API
		//- 				pre {{ info }}
		//- 			q-card-section(v-if="info")
		//- 				.text-h6 I2C Device Lookup
		//- 				q-badge.q-ma-xs(v-for="c in info?.devices?.split(',').filter((c) => c)", :key="c" color="primary") {{ c }}: {{ i2c_lookup[c] }}
		//- 		q-card-actions
		//- 			q-space
		//- 			q-btn(label="Edit" color="primary" icon="edit", :to="`/instruments/${props.id}/edit`")

		component(:def="def", :id="instrument.id", :is="views[instrument.type]")

		//- q-page-sticky(position="bottom-left" :offset="[18, 18]")
		//-   q-btn(
		//-     icon="edit"
		//-     round
		//-     color="primary"
		//-     :to="`/instruments/${props.id}/edit`"
		//-   )
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from "vue"
import { useInstrumentsStore } from "stores/instruments"
import { useInstrument } from "../Instruments/useInstrument.js"

const views = {
	guitar: defineAsyncComponent(() => import("./view/GuitarView.vue")),
}

const store = useInstrumentsStore()

const props = defineProps({
	id: {
		type: [String, Number],
		required: true,
	},
})
const instrument = computed(() => store.getById(props.id))
const { sendCmd } = useInstrument(props.id)

const info = ref(null)
const i2c = ref(null)

const GetInfo = async () => {
	console.log("GetInfo")
	info.value = await sendCmd("GET", "info")
}
const GetI2C = async () => {
	i2c.value = await sendCmd("GET", "scani2c")
}

const def = computed(() => store.getDefById(props.id))

const i2c_lookup = {
	"0x3C": "OLED",
	"0x40": "Servo",
	"0x41": "Servo",
	"0x42": "Servo",
	"0x43": "Servo",
	"0x44": "Servo",
	"0x45": "Servo",
	"0x46": "Servo",
	"0x47": "Servo",
	"0x48": "Servo",
	"0x70": "ESP32",
}

// const sendCmd = (cmd, arg) => {
// 	if (!instrument.value) return
// 	const url = `http://${instrument.value.ip}/api/${cmd}?arg=${arg}`
// 	fetch(url, {
// 		method: 'POST',
// 	})
// 		.then((response) => {
// 			if (!response.ok) throw new Error('Network response was not ok')
// 			return response.text()
// 		})
// 		.then((data) => {
// 			console.log('Command sent:', cmd, 'Response:', data)
// 		})
// 		.catch((error) => {
// 			console.error('Error sending command:', error)
// 		})
// }
</script>
<style scoped lang="scss">
.mouseoverflash {
	transition: background-color 0.3s;
	&:hover {
		background-color: #ff0000;
	}
}
</style>
