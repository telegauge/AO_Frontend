<template lang="pug">
.row.q-col-gutter-md
	.col-12.col-md-6
		.text-h6 Number of Strings
		q-btn-toggle(v-model="instrument.instrument.string_count" spread, :options="count_opts")
		.row.q-col-gutter-sm
			.col-12
				.row.q-col-gutter-sm.bg-secondary.q-my-md
					.col-1
					.col-10
						.row
							.col-5.text-h6.text-right < Swing Left
							.col-2.text-h6.text-center Home
							.col-5.text-h6.text-left Swing Right >
					.col-1
						q-radio(v-model="auto_pluck" checked-icon="mdi-cancel" unchecked-icon="mdi-cancel", :val="0")
			.col-12
				.row(v-for="(string, i) in instrument.instrument.string_count", :key="string.label")
					.col-shrink
						//- .text-h6 {{ i + 1 }}
						PinPicker(v-model:i2c="instrument.config.strings[i].i2c" v-model:pin="instrument.config.strings[i].pin")
					.col-10
						.row.q-col-gutter-sm
							.col-5
								q-slider(
									v-model="instrument.config.strings[string - 1].swing_left"
									label="Swing Left"
									reverse,
									:max="100",
									:min="0",
									:step="1"
								)
							.col-1
								q-slider(
									v-model.number="instrument.config.strings[string - 1].home_right",
									:max="30",
									:min="-30",
									:step="1"
								)
							.col-1
								q-slider(
									v-model.number="instrument.config.strings[string - 1].home_left"
									reverse,
									:max="30",
									:min="-30",
									:step="1"
								)
							.col-5
								q-slider(
									v-model="instrument.config.strings[string - 1].swing_right"
									label="Swing Right",
									:max="100",
									:min="0",
									:step="1"
								)
					.col
						q-radio(
							v-model="auto_pluck"
							checked-icon="mdi-guitar-pick"
							unchecked-icon="mdi-guitar-pick-outline",
							:val="i + 1"
						)

	.col-12.col-md-6
		.text-h6 Number of Frets
		q-btn-toggle(v-model="instrument.config.fret_count" spread, :options="count_opts")
		.row.q-col-gutter-sm
			.col-12
				.row.q-col-gutter-sm.bg-secondary.q-my-md
					.col-1
					.col-8
						.row
							.col-3.text-h6.text-center 00
							.col-3.text-h6.text-center 01
							.col-3.text-h6.text-center 10
							.col-3.text-h6.text-center 11
					.col-3
						q-radio(v-model="auto_pluck" checked-icon="mdi-cancel" unchecked-icon="mdi-cancel", :val="0")
			.col-12
				.row.q-col-gutter-sm(v-for="fret in instrument.config.fret_count", :key="fret.label")
					.col-shrink
						PinPicker(
							v-model:i2c="instrument.config.frets[fret - 1].i2c_left"
							v-model:pin="instrument.config.frets[fret - 1].pin_left"
						)
					.col-8
						.row.q-col-gutter-sm
							.col-3: q-slider(
								v-model="instrument.config.frets[fret - 1].pos[0]"
								selection-color="transparent",
								:max="0 + 30",
								:min="0 - 30"
							)
							.col-3: q-slider(
								v-model="instrument.config.frets[fret - 1].pos[1]"
								selection-color="transparent",
								:max="60 + 30",
								:min="60 - 30"
							)
							.col-3: q-slider(
								v-model="instrument.config.frets[fret - 1].pos[2]"
								selection-color="transparent",
								:max="90 + 30",
								:min="90 - 30"
							)
							.col-3: q-slider(
								v-model="instrument.config.frets[fret - 1].pos[3]"
								selection-color="transparent",
								:max="120 + 30",
								:min="120 - 30"
							)
					.col-shrink
						PinPicker(
							v-model:i2c="instrument.config.frets[fret - 1].i2c_right"
							v-model:pin="instrument.config.frets[fret - 1].pin_right"
						)
					.col
						.row
							.col-6
								q-checkbox(v-model="instrument.config.frets[fret - 1].pos[0]")
							.col-6
								q-checkbox(v-model="instrument.config.frets[fret - 1].pos[1]")
						.row
						//- q-checkbox(v-model="instrument.config.frets[fret - 1].pos[0]")
						//- q-checkbox(v-model="instrument.config.frets[fret - 1].pos[1]")
						//- q-checkbox(v-model="instrument.config.frets[fret - 1].pos[2]")
						//- q-checkbox(v-model="instrument.config.frets[fret - 1].pos[3]")
						//- q-checkbox(v-model="auto_pluck" checked-icon="mdi-cancel" unchecked-icon="mdi-cancel", :val="0")
</template>
<script setup>
import { ref, watch, onMounted, onUnmounted, onBeforeMount } from "vue"

import { useInstrument } from "../useInstrument.js"

import PinPicker from "@/components/PinPicker.vue"

const props = defineProps({
	instrument_id: {
		type: [String, Number],
		required: true,
	},
	instrument: {
		type: Object,
		required: true,
		default: () => ({}),
	},
})

const { sendCmd } = useInstrument(props.instrument_id)
const auto_pluck = ref(0)

var beat_tmr = ref(null)
onMounted(() => {
	beat_tmr.value = setInterval(Beat, 700)
})
onUnmounted(() => {
	clearInterval(beat_tmr.value)
})
function Beat() {
	if (auto_pluck.value > 0) {
		const string = props.instrument.config.strings[auto_pluck.value - 1]
		const cal = [string.swing_left, string.home_left, string.home_right, string.swing_right]
		sendCmd("POST", "pluck", { string: auto_pluck.value, calibrate: cal.join(",") })
	}
}

const auto_strum = ref(0)

onBeforeMount(VerifyConfig)

watch(
	() => props.instrument?.instrument?.string_count,
	(count) => {
		VerifyConfig()
	},
)

watch(
	() => props.instrument?.instrument?.fret_count,
	(count) => {
		console.log("fret count", count)
		VerifyConfig()
	},
)

function VerifyConfig() {
	if (!props.instrument?.instrument) return
	if (!props.instrument.config) props.instrument.config = {}
	var f
	if (!props.instrument.config.string_count)
		props.instrument.config.string_count = props.instrument.instrument.string_count || 1
	const string_count = props.instrument.config.string_count
	if (!props.instrument.config?.strings) props.instrument.config.strings = []
	for (f = 0; f < string_count; f++) {
		if (!props.instrument.config.strings[f])
			props.instrument.config.strings[f] = {
				label: "String " + (f + 1),
				swing_left: 30,
				swing_right: 30,
				home_left: 2,
				home_right: 2,
				i2c: "0x40",
				pin: 0,
			}
	}

	if (!props.instrument.config.fret_count)
		props.instrument.config.fret_count = props.instrument.instrument.fret_count || 1
	if (!props.instrument.config.frets) props.instrument.config.frets = []
	for (f = 0; f < props.instrument.config.fret_count; f++) {
		if (!props.instrument.config.frets[f])
			props.instrument.config.frets[f] = {
				label: "Fret " + (f + 1),
				pos: [0, 60, 90, 120],
				i2c_left: "0x40",
				pin_left: 0,
				i2c_right: "0x40",
				pin_right: 1,
			}
	}
}

const count_opts = [
	{ label: "1", value: 1 },
	{ label: "2", value: 2 },
	{ label: "3", value: 3 },
	{ label: "4", value: 4 },
	{ label: "5", value: 5 },
	{ label: "6", value: 6 },
	{ label: "7", value: 7 },
	{ label: "8", value: 8 },
	{ label: "9", value: 9 },
	{ label: "10", value: 10 },
	{ label: "11", value: 11 },
	{ label: "12", value: 12 },
]

const cmd_opts = [
	{ label: "Pluck", value: "pluck" },
	{ label: "Strum", value: "strum" },
]
</script>
