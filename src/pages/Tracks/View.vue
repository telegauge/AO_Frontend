<template lang="pug">
q-page(padding)
	q-markup-table.q-mt-md(bordered flat)
		thead
			tr
				th Time
				th(v-for="instrument in trackInstruments", :key="instrument.id") {{ instrument.name }}
		tbody
			tr(v-for="(row, rowIndex) in track.rows", :key="rowIndex", :class="{ 'bg-yellow-2': currentRow === rowIndex }")
				td.text-center
					.text-caption {{ rowIndex + 1 }}
				td(v-for="instrument in trackInstruments", :key="instrument.id")
					| {{ getCellDisplay(row[instrument.id]) }}
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from "vue"
import { useTracksStore } from "stores/tracks"
import { useInstrumentsStore } from "stores/instruments"
import { useInstrument } from "src/pages/Instruments/useInstrument.js"

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
})

const tracksStore = useTracksStore()
const instrumentsStore = useInstrumentsStore()

const track = computed(() => tracksStore.getById(props.id) || { rows: [], instruments: [] })

const trackInstruments = computed(() => {
	return (track.value.instruments || []).map((id) => instrumentsStore.getById(id)).filter(Boolean)
})

const instrumentOptions = computed(() => {
	return trackInstruments.value.map((inst) => ({ label: inst.name, value: inst.id }))
})

const activeInstruments = ref(trackInstruments.value.map((i) => i.id))
const tempo = ref(track.value.tempo || 120)
const isPlaying = ref(false)
const currentRow = ref(-1)
let intervalId = null
const instrumentComms = ref({})

watch(
	trackInstruments,
	(newInstruments) => {
		// Disconnect old instruments
		Object.values(instrumentComms.value).forEach((comm) => comm.disconnect())
		instrumentComms.value = {}

		// Connect new instruments
		newInstruments.forEach((inst) => {
			const comms = useInstrument(inst.id)
			// comms.connect()
			instrumentComms.value[inst.id] = comms
		})

		// Set active instruments
		activeInstruments.value = newInstruments.map((i) => i.id)
	},
	{ immediate: true },
)

watch(tempo, (newTempo) => {
	tracksStore.updateTrack(props.id, { tempo: newTempo })
	if (isPlaying.value) {
		clearInterval(intervalId)
		const interval = (60 / newTempo / 4) * 1000 // 16th notes
		clearInterval(intervalId)
		intervalId = setInterval(tick, interval)
	}
})

const play = () => {
	if (isPlaying.value) return
	isPlaying.value = true
	currentRow.value = -1
	const interval = (60 / tempo.value / 4) * 1000 // 16th notes
	clearInterval(intervalId)
	intervalId = setInterval(tick, interval)
}

const pause = () => {
	isPlaying.value = false
	clearInterval(intervalId)
	intervalId = null
}

const stop = () => {
	pause()
	currentRow.value = -1
}

const tick = () => {
	if (!isPlaying.value) return

	currentRow.value = (currentRow.value + 1) % (track.value.rows.length || 1)

	const rowData = track.value.rows[currentRow.value]
	if (!rowData) return

	trackInstruments.value.forEach((instrument) => {
		if (activeInstruments.value.includes(instrument.id)) {
			const noteData = rowData[instrument.id]
			if (noteData && noteData.action !== "rest") {
				const comms = instrumentComms.value[instrument.id]
				if (comms) {
					const action = noteData.action
					let payload = {}
					switch (action) {
						case "pluck":
							payload = { string: noteData.string }
							break
						case "chord":
							if (noteData.chord) payload.chord = noteData.chord
							if (noteData.note) payload.note = noteData.note
							if (noteData.mode) payload.mode = noteData.mode
							break
						case "note":
							payload = { note: noteData.note }
							break
						default:
							const { action, id, ...rest } = noteData
							payload = rest
					}
					comms.sendCmd("POST", action, payload)
				}
			}
		}
	})
}

const getCellDisplay = (cellData) => {
	if (!cellData) return ""
	switch (cellData.action) {
		case "pluck":
			return "String " + cellData.string
		case "note":
			return "Note: " + cellData.note
		case "chord":
			return "Chord: " + cellData.note || cellData.chord
		case "rest":
			return ""
		default:
			return ""
	}
}

// // Ensure there are always a certain number of rows
// watch(() => track.value.id, () => {
//   if (track.value && track.value.rows.length < 64) {
//     const currentLength = track.value.rows.length
//     for (let i = 0; i < 64 - currentLength; i++) {
//       const newRow = {}
//       trackInstruments.value.forEach(inst => {
//         if (inst && inst.id) {
//           newRow[inst.id] = { action: 'rest' }
//         }
//       })
//       track.value.rows.push(newRow)
//     }
//   }
// }, { immediate: true })

onUnmounted(() => {
	if (intervalId) {
		clearInterval(intervalId)
	}
	Object.values(instrumentComms.value).forEach((comm) => comm.disconnect())
})
</script>
