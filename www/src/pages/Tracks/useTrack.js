import { computed, unref } from "vue"
import { useTracksStore } from "stores/tracks"
import { useInstrument } from "../../instruments/useInstrument.js"

const id = ref(null)
const is_playing = ref(false)
const beat = ref(0)

const tracksStore = useTracksStore()
console.log("useTrack")

let last_ms = 0

const instruments = {}

export function useTrack(track_id) {
	id.value = unref(track_id)

	const track = computed(() => tracksStore.getById(id.value) || {})
	const current_row = computed(() => (beat.value % track.value.rows?.length) + 0)

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
		Beat()
		is_playing.value = true
		clearInterval(intervalId)
		intervalId = setInterval(Beat, 60000 / track.value.bpm)
	}

	function Stop() {
		clearInterval(intervalId)
		is_playing.value = false
		beat.value = 0

		for (var id in instruments) {
			instruments[id].sendRestCmd("POST", "home", {})
		}
	}
	onUnmounted(Stop)
	watch(
		() => track.value.bpm,
		(bpm) => {
			clearInterval(intervalId)
			intervalId = setInterval(Beat, 60000 / bpm)
		},
	)

	function Beat() {
		const ms = Date.now()
		var row = track.value.rows[current_row.value - 0]
		for (var id in row) {
			const instrument = instruments[id]
			if (instrument) {
				console.log(
					"  beat: ",
					current_row.value,
					instrument.instrument.value.name,
					instrument.instrument.value.ip,
					ms - last_ms,
				)
				if (!instrument) continue
				const cmd = row[id].action
				const args = { ...row[id] }
				delete args.action
				delete args.id
				instruments[id].sendCmd("POST", cmd, args)
			}
		}
		beat.value++

		last_ms = ms
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
