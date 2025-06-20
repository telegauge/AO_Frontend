import { defineStore } from 'pinia'

export const useTracksStore = defineStore('tracks', {
  state: () => ({
    tracks: [
      {
        id: 1,
        name: 'My First Track',
        rows: [],
      }
    ],
  }),
  getters: {
    getTracks: (state) => state.tracks,
    getById: (state) => (id) => {
      return state.tracks.find((track) => track.id == id)
    },
  },
  actions: {
    addTrack() {
      const id = Date.now()
      this.tracks.push({
        id,
        name: 'New Track',
        rows: [],
        instruments: [],
        timesignature: '4/4',
      })
      return id
    },
    updateTrack(id, updates) {
      const idx = this.tracks.findIndex((track) => track.id == id)
      if (idx !== -1) {
        this.tracks[idx] = { ...this.tracks[idx], ...updates }
      }
    },
    removeTrack(id) {
      const idx = this.tracks.findIndex((track) => track.id == id)
      if (idx !== -1) {
        this.tracks.splice(idx, 1)
      }
    },
  },
  persist: true,
})
