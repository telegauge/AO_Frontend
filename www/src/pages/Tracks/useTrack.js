import { computed, unref } from "vue"
import { useTracksStore } from "stores/tracks"
import { useInstrument } from "../../instruments/useInstrument.js"

const id = ref(null)
const is_playing = ref(false)
const beat = ref(-1)

const tracksStore = useTracksStore()
console.log("useTrack")

const instruments = {}

export function useTrack(track_id) {
	id.value = unref(track_id)

	const track = computed(() => tracksStore.getById(id.value) || {})
	const current_row = computed(() => beat.value % track.value.rows?.length)

	let intervalId = null

	function Load() {
		for (var instrument_id of track.value.instruments) {
			if (!instruments[instrument_id]) {
				console.log("  track init: ", instrument_id)
				instruments[instrument_id] = useInstrument(instrument_id)
			}
		}
	}
	Load()

	function Pause() {
		clearInterval(intervalId)
		is_playing.value = false
	}
	function Play() {
		beat.value++
		Beat()
		is_playing.value = true
		clearInterval(intervalId)
		intervalId = setTimeout(Play, 60000 / track.value.bpm)
	}

	function Stop() {
		clearInterval(intervalId)
		is_playing.value = false
		beat.value = -1

		for (var id in instruments) {
			instruments[id].sendRestCmd("POST", "home", {})
		}
	}
	// onUnmounted(Stop)

	function Beat() {
		var row = track.value.rows[current_row.value]
		for (var id in row) {
			const instrument = instruments[id]
			console.log("  beat: ", id, instrument)
			if (!instrument) continue
			const cmd = row[id].action
			const args = { ...row[id] }
			delete args.action
			delete args.id
			instruments[id].sendCmd("POST", cmd, args)
		}
	}

	return {
		track,
		is_playing,
		beat,
		current_row,
		Pause,
		Play,
		Stop,
	}
}
