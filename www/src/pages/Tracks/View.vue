<template lang="pug">
q-page(padding)
	q-markup-table.q-mt-md(bordered flat)
		thead
			tr
				th Beat
				th.text-left(v-for="instrument in instruments", :key="instrument.id") {{ instrument.name }}
		tbody
			tr(v-for="(row, rowIndex) in track.rows", :key="rowIndex", :class="{ 'bg-yellow-2': current_row === rowIndex }")
				td.text-center
					.text-caption {{ rowIndex + 1 }}
				td(v-for="instrument in instruments", :key="instrument.id")
					//- pre {{ row[instrument.id] }}
					| {{ getCellDisplay(row[instrument.id]) }}
</template>

<script setup>
// import { ref, computed, onUnmounted, watch } from "vue"
// import { useTracksStore } from "stores/tracks"
import { useInstruments } from "src/instruments/useInstrument.js"
import { useTrack } from "./useTrack"

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
})

const track_id = computed(() => props.id)
const { track, current_row } = useTrack(track_id)

const { instruments: all_instruments } = useInstruments()

const instruments = computed(() =>
	track.value.instruments.map((instrument) => all_instruments.find((inst) => inst.id === instrument)),
)

// const tracksStore = useTracksStore()

// const track = computed(() => tracksStore.getById(props.id) || { rows: [], instruments: [] })

// const trackInstruments = computed(() => {
// 	return (track.value.instruments || []).map((id) => instrumentsStore.getById(id)).filter(Boolean)
// })

// const tick = () => {
// 	if (!isPlaying.value) return

// 	currentRow.value = (currentRow.value + 1) % (track.value.rows.length || 1)

// 	const rowData = track.value.rows[currentRow.value]
// 	if (!rowData) return

// 	trackInstruments.value.forEach((instrument) => {
// 		if (activeInstruments.value.includes(instrument.id)) {
// 			const noteData = rowData[instrument.id]
// 			if (noteData && noteData.action !== "rest") {
// 				const comms = instrumentComms.value[instrument.id]
// 				if (comms) {
// 					const action = noteData.action
// 					let payload = {}
// 					switch (action) {
// 						case "pluck":
// 							payload = { string: noteData.string }
// 							break
// 						case "chord":
// 							if (noteData.chord) payload.chord = noteData.chord
// 							if (noteData.note) payload.note = noteData.note
// 							if (noteData.mode) payload.mode = noteData.mode
// 							break
// 						case "note":
// 							payload = { note: noteData.note }
// 							break
// 						default:
// 							const { action, id, ...rest } = noteData
// 							payload = rest
// 					}
// 					comms.sendCmd("POST", action, payload)
// 				}
// 			}
// 		}
// 	})
// }

const getCellDisplay = (cell) => {
	if (!cell) return ""
	switch (cell.action) {
		case "pluck":
			if (cell.strings.length > 0) {
				return "Strings: " + cell.strings.join(", ")
			}
			return "String: " + cell.string
		case "note":
			return "Note: " + cell.note
		case "chord":
			return "Chord: " + cell.chord
		case "rest":
			return ""
		default:
			return ""
	}
}

// // // Ensure there are always a certain number of rows
// // watch(() => track.value.id, () => {
// //   if (track.value && track.value.rows.length < 64) {
// //     const currentLength = track.value.rows.length
// //     for (let i = 0; i < 64 - currentLength; i++) {
// //       const newRow = {}
// //       trackInstruments.value.forEach(inst => {
// //         if (inst && inst.id) {
// //           newRow[inst.id] = { action: 'rest' }
// //         }
// //       })
// //       track.value.rows.push(newRow)
// //     }
// //   }
// // }, { immediate: true })

// onUnmounted(() => {
// 	if (intervalId) {
// 		clearInterval(intervalId)
// 	}
// 	Object.values(instrumentComms.value).forEach((comm) => comm.disconnect())
// })
</script>
