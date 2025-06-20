import { defineStore } from 'pinia'

export const Defs = [
	{
		label: 'Guitar',
		examples: ['Guitar', 'Banjo', 'Ukulele'],
		value: 'guitar',
		icon: 'guitar',
		cmd: ['pluck', 'strum', 'fret', 'chord'],
	},
	{
		label: 'Piano',
		examples: ['Piano', 'Organ', 'Keyboard'],
		disabled: true,
		value: 'piano',
		icon: 'piano',
		cmd: [],
	},
	{
		label: 'Drums',
		examples: ['Drums', 'Percussion'],
		disabled: true,
		value: 'drums',
		icon: 'drum',
		cmd: [],
	},
	{
		label: 'Bowed',
		examples: ['Violin', 'Cello', 'Viola'],
		disabled: true,
		value: 'bow',
		icon: 'bow',
		cmd: [],
	},
	{
		label: 'Wind',
		examples: ['Flute', 'Saxophone', 'Trumpet'],
		disabled: true,
		value: 'wind',
		icon: 'wind',
		cmd: [],
	},
  { label: 'Brass',
    examples: ['Trumpet', 'Trombone', 'Tuba'],
    disabled: true,
    value: 'brass',
    icon: 'mdi-bugle',
    cmd: [],
  },
  { label: "Other",
    examples: ['Synthesizer', 'Sampler', 'Drum Machine'],
    disabled: true,
    value: 'misc',
    icon: 'mdi-music-note',
    cmd: [],
  },
]

export const useInstrumentsStore = defineStore('instruments', {
	state: () => ({
		instruments: [
			{
				id: 1,
				name: 'Ukulele',
				type: 'guitar',
				ip: '192.168.7.127',
				config: {},
        state: {
          neck: { 0: "0010", 1: "0000" }
        }
			},
		],
	}),
	getters: {
		getById: (state) => (id) => {
			return state.instruments.find((inst) => inst.id == id)
		},
		getDefById: (state) => (id) => {
			return Defs.find((type) => type.value === state.instruments.find((inst) => inst.id == id).type)
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
