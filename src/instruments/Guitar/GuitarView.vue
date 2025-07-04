<template lang="pug">
#GUITAR.row.q-col-gutter-md
	.col-md-6.col-12: q-card
		q-card-section
			q-toolbar
				q-toolbar-title {{ instrument.name }} ({{ instrument.variant }})
		q-card-section
			q-markup-table(dense)
				thead
					tr
						th
							q-checkbox(
								v-model="strum_fret"
								color="primary"
								checked-icon="mdi-guitar-pick"
								unchecked-icon="mdi-guitar-pick-outline"
							)
								q-tooltip Auto-pluck when setting frets
						th(v-for="s in instrument.config.string_count", :key="s") {{ s }}
				tbody(v-if="true")
					tr(v-for="f in instrument.config.fret_count", :key="f")
						th.text-right Fret {{ f }}
						td(v-for="s in instrument.config.string_count", :key="s")
							q-btn.fit(:label="getFretAt(f, s) ? '⏺' : '|'" color="primary" @click="toggleFret(f, s)")

					tr.bg-grey-2
						th.text-right Pluck
						td(v-for="s in instrument.config.string_count", :key="s")
							q-btn.fit.mouseoverflash(label="V" color="secondary" @click="Pluck(s)")
					tr.bg-grey-2.desktop-only
						th.text-right Swipe
						td(v-for="s in instrument.config.string_count", :key="s")
							q-btn.fit(label=">" color="secondary" @mouseenter="FlashEl" @mouseleave="Pluck(s)")
					tr.bg-grey-2.desktop-only
						th.text-right Strum
						td(colspan="4")
							q-btn.fit(label="strum" color="secondary" @click="Strum")

	.col-md-6.col-12: q-card
		q-card-section
			q-toolbar
				q-toolbar-title {{ instrument.variant }} Chords
		q-card-section
			q-markup-table(dense)
				thead
					tr
						th
							q-checkbox(
								v-model="strum_chord"
								color="primary"
								checked-icon="mdi-guitar-pick"
								unchecked-icon="mdi-guitar-pick-outline"
							)
								q-tooltip Strum when setting chords
						th(v-for="note in notes", :key="note") {{ note }}
				tbody
					tr(v-for="v in instrument.config.fret_count + 2", :key="v")
						th {{ variations[v - 1]?.label }}
						td(v-for="note in notes", :key="note")
							q-btn.fit(
								:label="note + variations[v - 1].value"
								color="primary"
								no-caps
								@click="setChord(note + variations[v].value)",
								:disabled="!chords[note + variations[v].value]"
							)

	q-page-sticky(position="bottom-right", :offset="[18, 18]")
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

	//- q-page-sticky(position="bottom-left", :offset="[18, 18]")
	//- 	q-btn(color="primary" flat icon="mdi-cog" round @click="showPrefs = true")

	q-dialog(v-model="showPrefs")
		q-card(style="min-width: 350px")
			q-card-section
				.text-h6 Preferences
			q-card-section
				.text-subtitle2 Strum Delay
				q-input(
					v-model.number="strum_delay"
					type="number"
					label="Delay"
					filled
					suffix="ms"
					hint="Time between each note on the strum",
					:max="5000",
					:min="0"
				)
			q-card-actions(align="right")
				q-btn(label="Close" color="primary" flat v-close-popup)
</template>

<script setup>
import { computed, watch, ref, onMounted, onUnmounted } from "vue"
import { useInstrument } from "src/pages/Instruments/useInstrument.js"
import { useStorage } from "@vueuse/core"

// import { notes, variations, chords } from "./Ukulele.js"

const props = defineProps({
	id: {
		type: [String, Number],
		required: true,
	},
	def: {
		type: Object,
		required: true,
	},
})

const instrument_id = computed(() => Number(props.id))
const { instrument, sendCmd, sendRestCmd, connect, disconnect, ws_online, rest_online } = useInstrument(instrument_id)

const strum_delay = ref(10)

const strum_chord = useStorage("strum_chord", true)
const strum_fret = useStorage("strum_fret", true)

const state = ref("0000") // e.g., "4322" for 4 strings

let last_batt_percent = 0
const batt_percent = ref(0)
const timer = ref(null)

const notes = ref([])
const variations = ref([])
const chords = ref({})

watch(
	() => instrument.value.variant,
	async (variant) => {
		if (!variant) return
		try {
			const mod = await import(`./${variant}.js`)
			notes.value = mod.notes
			variations.value = mod.variations
			chords.value = mod.chords
		} catch (e) {
			notes.value = []
			variations.value = []
			chords.value = {}
			console.error(`Failed to load variant module: ./` + variant + `.js`, e)
		}
	},
	{ immediate: true },
)

onMounted(async () => {
	// connect()
	timer.value = setInterval(updateBattery, 120000)
	updateBattery()
})

onUnmounted(() => {
	// disconnect()
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

const interval = ref(0)
let intervalTimer = null
watch(interval, (newVal) => {
	clearInterval(intervalTimer)
	if (newVal > 0) {
		intervalTimer = setInterval(() => {
			sendCmd("POST", "strum", { delay: strum_delay.value })
		}, newVal)
	}
})

const updateBattery = async () => {
	const batt = await sendRestCmd("GET", "battery")
	if (batt) {
		last_batt_percent = batt_percent.value
		batt_percent.value = batt.percent
	}
}

const getFretAt = (fret, string) => {
	// Returns true if the string is pressed at this fret
	// console.log("getFretAt", fret, string, state.value)
	return parseInt(state.value[string - 1] || 0) === fret
}
const setFretAt = (fret, string, value) => {
	// If value is true, set this string to this fret, else set to 0 (open)
	console.log("setFretAt", fret, string, value)
	let arr = state.value.split("")
	arr[string - 1] = value ? fret.toString() : "0"
	state.value = arr.join("")
	sendCmd("POST", "fret", { fret, pressed: state.value })
}
const toggleFret = (fret, string) => {
	console.log("toggleFret", fret, string)
	const isPressed = getFretAt(fret, string)
	setFretAt(fret, string, !isPressed)
	if (strum_fret.value) {
		Pluck(string)
	}
}

const Pluck = (string) => {
	const config = instrument.value.config.strings[string - 1]
	const cal = [config.swing_left, config.home_left, config.home_right, config.swing_right]
	sendCmd("POST", "pluck", { string: string, calibrate: cal.join(",") })
}

const Strum = () => {
	sendCmd("POST", "strum", {})
}

const setChord = (chord) => {
	// chord is a string like "4322"
	state.value = chords.value[chord]
	sendCmd("POST", "chord", { pressed: state.value, chord: chord })
	if (strum_chord.value) {
		sendCmd("POST", "strum", { delay: strum_delay.value })
	}
}

const showPrefs = ref(false)

const FlashEl = (e) => {
	const target = e.target || e.currentTarget
	target.style.opacity = "0.5"
	setTimeout(() => {
		target.style.opacity = "1"
	}, 1000)
}

const handleTouchMove = (e, string) => {
	const touch = e.touches[0]
	const target = document.elementFromPoint(touch.clientX, touch.clientY)
	if (target && target.classList.contains("q-btn")) {
		FlashEl({ target })
		Pluck(string)
	}
}
</script>
<style scoped lang="scss">
.mouseoverflash {
	transition: opactiy 0.3s;
}
</style>
