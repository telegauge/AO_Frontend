import { computed, unref } from "vue"
import { useInstrumentsStore } from "../stores/instruments"
import { useComms } from "../composables/useComms.js"

export function useInstrument(id) {
	id = unref(id)
	const instrumentsStore = useInstrumentsStore()
	const instrument = computed(() => instrumentsStore.getById(id) || {})
	const comms = useComms(instrument)

	const type = computed(() => instrument.value.type)
	const variant = computed(() => instrument.value.variant)
	LoadVariant(type.value, variant.value)

	async function LoadVariant(type, variant) {
		console.log("LoadVariant", type, variant)
		if (!variant) return
		try {
			const inst = await import(`./${type}/variants/${variant}.js`)
			instrument.value.instrument = inst.default
			// console.log("Loaded variant", variant, inst.default)
		} catch (e) {
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
