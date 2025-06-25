<template lang="pug">
.row.q-col-gutter-md
	.col-12.col-md-6
		.text-h6 Strings
		.row.q-col-gutter-sm
			.col-12
				q-input(
					v-model.number="config.string_count"
					type="number"
					label="Number of Strings"
					filled
					outlined,
					:max="12",
					:min="1"
				)
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
				.row(v-for="(string, i) in config.string_count", :key="string.label")
					.col-shrink
						//- .text-h6 {{ i + 1 }}
						PinPicker(v-model:i2c="config.strings[i].i2c" v-model:pin="config.strings[i].pin")
					.col-10
						.row.q-col-gutter-sm
							.col-5
								q-slider(
									v-model="config.strings[string - 1].swing_left"
									label="Swing Left"
									reverse,
									:max="100",
									:min="0",
									:step="1"
								)
							.col-1
								q-slider(v-model.number="config.strings[string - 1].home_right", :max="30", :min="-30", :step="1")
							.col-1
								q-slider(v-model.number="config.strings[string - 1].home_left" reverse, :max="30", :min="-30", :step="1")
							.col-5
								q-slider(
									v-model="config.strings[string - 1].swing_right"
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
		.text-h6 Frets
		.row.q-col-gutter-sm
			.col-12
				q-input(
					v-model.number="config.fret_count"
					type="number"
					label="Number of Frets"
					filled
					outlined,
					:max="12",
					:min="1"
				)
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
				.row.q-col-gutter-sm(v-for="fret in config.fret_count", :key="fret.label")
					.col-shrink
						PinPicker(v-model:i2c="config.frets[fret - 1].i2c_left" v-model:pin="config.frets[fret - 1].pin_left")
					.col-8
						.row.q-col-gutter-sm
							.col-3: q-slider(v-model="config.frets[fret - 1].pos[0]" selection-color="transparent", :max="200", :min="-20")
							.col-3: q-slider(v-model="config.frets[fret - 1].pos[1]" selection-color="transparent", :max="200", :min="-20")
							.col-3: q-slider(v-model="config.frets[fret - 1].pos[2]" selection-color="transparent", :max="200", :min="-20")
							.col-3: q-slider(v-model="config.frets[fret - 1].pos[3]" selection-color="transparent", :max="200", :min="-20")
					.col-shrink
						PinPicker(v-model:i2c="config.frets[fret - 1].i2c_right" v-model:pin="config.frets[fret - 1].pin_right")
					.col
						.row
							.col-6
								q-checkbox(v-model="config.frets[fret - 1].pos[0]")
							.col-6
								q-checkbox(v-model="config.frets[fret - 1].pos[1]")
						.row
						//- q-checkbox(v-model="config.frets[fret - 1].pos[0]")
						//- q-checkbox(v-model="config.frets[fret - 1].pos[1]")
						//- q-checkbox(v-model="config.frets[fret - 1].pos[2]")
						//- q-checkbox(v-model="config.frets[fret - 1].pos[3]")
						//- q-checkbox(v-model="auto_pluck" checked-icon="mdi-cancel" unchecked-icon="mdi-cancel", :val="0")

pre {{ auto_pluck }}
</template>
<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue"

import { useInstrument } from "../useInstrument.js"

import PinPicker from "@/components/PinPicker.vue"

const props = defineProps({
	instrument_id: {
		type: [String, Number],
		required: true,
	},
	config: {
		type: Object,
		required: true,
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
		const string = props.config.strings[auto_pluck.value - 1]
		const cal = [string.swing_left, string.home_left, string.home_right, string.swing_right]
		sendCmd("POST", "pluck", { string: auto_pluck.value, calibrate: cal.join(",") })
	}
}

const auto_strum = ref(0)

watch(
	() => props.config.string_count,
	(count) => {
		// props.config.strings = []
		if (!props.config.strings) props.config.strings = []
		for (var f = 0; f < count; f++) {
			if (!props.config.strings[f])
				props.config.strings[f] = {
					label: "String " + (f + 1),
					swing_left: 30,
					swing_right: 30,
					home_left: 2,
					home_right: 2,
				}
		}
	},
)

watch(
	() => props.config.fret_count,
	(count) => {
		console.log("fret count", count)
		// props.config.frets = []
		if (!props.config.frets) props.config.frets = []
		for (var f = 0; f < count; f++) {
			if (!props.config.frets[f]) props.config.frets[f] = { label: "Fret " + (f + 1), pos: [0, 60, 90, 120] }
		}
	},
)
</script>
