import { computed, unref } from "vue"
import { useTracksStore } from "stores/tracks"

const id = ref(null)
const is_playing = ref(false)
const beat = ref(0)

const tracksStore = useTracksStore()

export function useTrack(track_id) {
	id.value = unref(track_id)

	const track = computed(() => tracksStore.getById(id.value) || {})
	const current_row = computed(() => beat.value % track.value.rows?.length)

	let intervalId = null

	function Pause() {
		clearInterval(intervalId)
		is_playing.value = false
	}
	function Play() {
		beat.value++
		is_playing.value = true
		clearInterval(intervalId)
		console.log(beat.value, 60000 / track.value.bpm, ">", current_row.value)
		intervalId = setTimeout(Play, 60000 / track.value.bpm)
	}

	function Stop() {
		clearInterval(intervalId)
		is_playing.value = false
		beat.value = 0
	}

	onUnmounted(() => {
		clearInterval(intervalId)
	})

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
