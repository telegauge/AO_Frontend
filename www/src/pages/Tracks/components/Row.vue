<template lang="pug">
td(v-if="!track.action" colspan="3")
	q-btn-toggle(v-model="track.action" inline-label spread, :options="actions")
template(v-else)
	td
		q-btn(color="primary", :icon="actions.find((a) => a.value === track.action)?.icon")
			q-menu
				q-list
					q-item(
						v-for="a in actions",
						:key="a.value",
						:value="a.value"
						clickable
						v-close-popup
						@click="track.action = a.value"
					)
						q-item-section(avatar)
							q-icon(:name="a.icon")
						q-item-section
							q-item-label {{ a.label }}

	td(v-if="track.action === 'note'")
		q-input(v-model="track.note" label="Play Note" dense filled)
	td(v-else-if="track.action === 'chord'")
		q-select(v-model="track.chord" label="Strum Chord" dense filled options-dense, :options="Object.keys(chords)")
	td(v-else-if="track.action === 'pluck'")
		//- q-input(v-model.number="track.string" type="number" filled label="Pluck String" dense )
		q-checkbox(v-model="track.strings" label="1", :val="1")
		q-checkbox(v-model="track.strings" label="2", :val="2")
		q-checkbox(v-model="track.strings" label="3", :val="3")
		q-checkbox(v-model="track.strings" label="4", :val="4")
		//- q-radio(v-model="track.mode" :val="5" label="5" )
		//- q-radio(v-model="track.mode" :val="6" label="6" )
	td.text-center(v-else-if="track.action === 'rest'") --
	td(v-else)

	td(v-if="['chord'].includes(track.action)")
		q-checkbox(v-model="track.strum" label="Strum Chord" dense filled options-dense, :options="Object.keys(chords)")
	td(v-else-if="['note'].includes(track.action)")
		q-btn(:icon="modes.find((m) => m.value === track.mode)?.icon")
			q-tooltip {{ modes.find((m) => m.value === track.mode)?.description }}
			q-menu
				q-list
					q-item(
						v-for="i in modes",
						:key="i.label",
						:value="i.label"
						clickable
						v-close-popup
						@click="track.mode = i.value"
					)
						q-tooltip(v-if="i.description") {{ i.description }}
						q-item-section(avatar)
							q-icon(:name="i.icon")
						q-item-section
							q-item-label {{ i.label }}
	td(v-else)
</template>
<script setup>
import { computed } from "vue"
// import { useInstrumentsStore } from "stores/instruments"

// const instrumentsStore = useInstrumentsStore()
// const instruments = instrumentsStore.instruments

const props = defineProps({
	track: {
		type: Object,
		required: true,
	},
	instrument: {
		type: Object,
		required: true,
	},
})

const track = computed(() => props.track)

const actions = [
	{ label: "Note", value: "note", icon: "mdi-music-note" },
	{ label: "Chord", value: "chord", icon: "mdi-guitar-acoustic" },
	{ label: "Pluck", value: "pluck", icon: "mdi-guitar-pick" },
	{ label: "Rest", value: "rest", icon: "mdi-music-note-off" },
]

const modes = [
	{ label: "", value: undefined, icon: "mdi-minus", description: "Set an optional mode" },
	{
		label: "Sustain",
		value: "sus",
		icon: "mdi-arrow-expand-down",
		description: "Hold the note past the end of the measure",
	},
	{
		label: "Stacatto",
		value: "stac",
		icon: "mdi-arrow-collapse-vertical",
		description: "Play the note quickly and stop",
	},
]

watch(
	() => track.value.action,
	(new_action) => {
		console.log("action changed", new_action)
		switch (new_action) {
			case "chord":
				track.value.strum = true
				break
			case "note":
				track.value.strum = false
				break
			case "pluck":
				track.value.strings = []
				break
			case "rest":
				break
		}
	},
)

watch(
	() => track.value.chord,
	(new_chord) => {
		console.log("chord changed", new_chord)
		if (new_chord) {
			track.value.pressed = chords.value[new_chord]
		}
	},
)
const capitalize = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

// Load Variant data
const notes = computed(() => props.instrument.instrument.notes)
const variations = computed(() => props.instrument.instrument.variations)
const chords = computed(() => props.instrument.instrument.chords)
</script>
