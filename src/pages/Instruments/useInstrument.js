import { computed, unref } from "vue"
import { useInstrumentsStore } from "stores/instruments"
import { useComms } from "../../composables/useComms"

export function useInstrument(id) {
	id = unref(id)
	const instrumentsStore = useInstrumentsStore()
	const instrument = computed(() => instrumentsStore.getById(id) || {})

	const comms = useComms(instrument)

	return {
		instrument,
		...comms,
	}
}

export function useInstruments() {
	const { instruments } = useInstrumentsStore()

	return {
		instruments,
	}
}
