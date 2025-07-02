<template lang="pug">
q-page(padding)
	div(v-if="!instrument")
		q-banner Instrument not found
	div(v-else)
		component(:def="def", :id="instrument_id", :is="views[instrument.type]")
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from "vue"
import { useInstrumentsStore } from "stores/instruments"
import { useInstrument } from "../Instruments/useInstrument.js"

const views = {
	guitar: defineAsyncComponent(() => import("../../instruments/Guitar/GuitarView.vue")),
}

const store = useInstrumentsStore()

const props = defineProps({
	id: {
		type: [String, Number],
		required: true,
	},
})
const instrument_id = computed(() => unref(props.id))
const instrument = computed(() => store.getById(instrument_id))
const { sendCmd } = useInstrument(instrument_id)

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
