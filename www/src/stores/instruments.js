import { defineStore } from "pinia"

export const Defs = [
	{
		label: "Guitar",
		description: "A stringed instrument with pluckable or strummed strings.",
		variants: ["Guitar", "Banjo", "Ukulele"],
		value: "Guitar",
		icon: "guitar",
		cmd: ["pluck", "strum", "chord"],
		defaults: { string_count: 6, strings: [], fret_count: 4, frets: [] },
	},
	{
		label: "Piano",
		description: "A keyboard instrument with keys that produce different pitches.",
		variants: ["Piano", "Organ", "Keyboard"],
		disabled: true,
		value: "Piano",
		icon: "piano",
		cmd: ["key", "pedal", "chord"],
	},
	{
		label: "Drums",
		description: "A percussion instrument with drums and cymbals.",
		variants: ["Drums", "Percussion"],
		disabled: true,
		value: "drums",
		icon: "drum",
		cmd: [],
	},
	{
		label: "Bowed",
		description: "A stringed instrument with a sliding bow",
		variants: ["Violin", "Cello", "Viola"],
		disabled: true,
		value: "Bow",
		icon: "bow",
		cmd: [],
	},
	{
		label: "Wind",
		description: "An instrument that uses air and valves",
		variants: ["Flute", "Saxophone", "Trumpet"],
		disabled: true,
		value: "Wind",
		icon: "wind",
		cmd: [],
	},
	{
		label: "Other",
		description: "An instrument that doesn't fit into the other categories",
		variants: ["Synthesizer", "Sampler", "Drum Machine"],
		disabled: true,
		value: "Misc",
		icon: "mdi-music-note",
		cmd: [],
	},
]

export const useInstrumentsStore = defineStore("instruments", {
	state: () => ({
		instruments: [
			{
				id: 1,
				name: "Ukulele",
				type: "guitar",
				ip: "192.168.7.127",
				config: {},
				state: {
					neck: { 0: "0010", 1: "0000" },
				},
			},
		],
	}),
	getters: {
		getById: (state) => (id) => {
			return state.instruments.find((inst) => inst.id == unref(id))
		},
		getDefById: (state) => (id) => {
			return Defs.find((type) => type.value === state.instruments.find((inst) => inst.id == unref(id)).type)
		},
	},
	actions: {
		addInstrument(instrument) {
			this.instruments.push({
				id: instrument.id || Date.now(),
				...instrument,
			})
		},
		updateInstrument(id, updates) {
			const idx = this.instruments.findIndex((inst) => inst.id === id)
			if (idx !== -1) {
				this.instruments[idx] = { ...this.instruments[idx], ...updates }
			}
		},
		removeInstrument(id) {
			const idx = this.instruments.findIndex((inst) => inst.id === id)
			if (idx !== -1) {
				this.instruments.splice(idx, 1)
			}
		},
	},
	persist: true,
})
