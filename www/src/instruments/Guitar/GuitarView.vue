<template lang="pug">
#GUITAR.row.q-col-gutter-md
	.col-xl-6.col-12: q-card
		q-card-section
			q-toolbar
				q-toolbar-title {{ instrument.name }} ({{ instrument.variant }})
		q-card-section(v-if="instrument.config")
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

					tr
						th.text-right Pluck
						td(v-for="s in instrument.config.string_count", :key="s")
							q-btn.fit.mouseoverflash(label="V" color="secondary" @click="Pluck(s)")
					tr.desktop-only
						th.text-right Swipe
						td(v-for="s in instrument.config.string_count", :key="s")
							q-btn.fit(label=">" color="secondary" @mouseenter="FlashEl" @mouseleave="Pluck(s)")
					tr.desktop-only
						th.text-right Commands
						td(:colspan="instrument.config.string_count")
							.row.q-col-gutter-md
								.col-6: q-btn.fit(label="Home" color="secondary" @click="Home")
								.col-6: q-btn.fit(label="Strum" color="secondary" @click="Strum")

	.col-xl-6.col-12: q-card
		q-card-section
			q-toolbar
				q-toolbar-title {{ instrument.variant }} Chords
		q-card-section(v-if="instrument.config")
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
						th(v-for="note in instrument.instrument.notes", :key="note") {{ note }}
				tbody
					tr(v-for="(value, label) in instrument.instrument.variations", :key="v")
						th {{ label }}
						td(v-for="note in instrument.instrument.notes", :key="note")
							q-btn.fit(
								:label="note + value"
								color="primary"
								no-caps
								@click="setChord(note + value)",
								:disabled="!(note + value)"
							)
</template>

<script setup>
import { computed, watch, ref, onMounted, onUnmounted } from "vue"
import { useInstrument } from "../useInstrument.js"
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
const { instrument, sendCmd, sendRestCmd, ws_online, rest_online } = useInstrument(instrument_id)

const strum_delay = ref(10)

const strum_chord = useStorage("strum_chord", true)
const strum_fret = useStorage("strum_fret", true)

const state = ref("0000") // e.g., "4322" for 4 strings

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
const Home = () => {
	sendCmd("POST", "home", {})
}

const setChord = (chord) => {
	// chord is a string like "4322"
	state.value = instrument.value.instrument.chords[chord]
	sendCmd("POST", "chord", { pressed: state.value, chord: chord })
	if (strum_chord.value) {
		sendCmd("POST", "strum", { delay: strum_delay.value })
	}
}

const FlashEl = (e) => {
	const target = e.target || e.currentTarget
	target.style.opacity = "0.5"
	setTimeout(() => {
		target.style.opacity = "1"
	}, 1000)
}
</script>
<style scoped lang="scss">
.mouseoverflash {
	transition: opactiy 0.3s;
}
</style>
