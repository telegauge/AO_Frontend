import { defineStore } from 'pinia'

export const Types = [
	{ label: 'Guitar', value: 'guitar', icon: 'guitar' },
	{ label: 'Piano', value: 'piano', icon: 'piano' },
	{ label: 'Drums', value: 'drums', icon: 'drums' },
	{ label: 'Bow', value: 'bow', icon: 'bow' },
	{ label: 'Wind', value: 'wind', icon: 'wind' },
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
			},
		],
	}),
	getters: {
		getById: (state) => (id) => {
			return state.instruments.find((inst) => inst.id == id)
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
