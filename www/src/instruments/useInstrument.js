import { computed, unref } from "vue"
import { useInstrumentsStore } from "stores/instruments"
import { useComms } from "../composables/useComms"

export function useInstrument(id) {
	id = unref(id)
	const instrumentsStore = useInstrumentsStore()
	const instrument = computed(() => instrumentsStore.getById(id) || {})
	console.log("instrument", instrument.value)
	const comms = useComms(instrument)

	const type = computed(() => instrument.value.type)
	const variant = computed(() => instrument.value.variant)
	LoadVariant(type.value, variant.value)

	async function LoadVariant(type, variant) {
		console.log("LoadVariant", type, variant)
		if (!variant) return
		try {
			const mod = await import(`./${type}/variants/${variant}.js`)
			// notes.value = mod.notes
			// variations.value = mod.variations
			// chords.value = mod.chords
			console.log("Loaded variant", variant, mod)
		} catch (e) {
			// notes.value = []
			// variations.value = []
			// chords.value = {}
			console.error(`Failed to load variant module: ./` + variant + `.js`, e)
		}
	}

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
