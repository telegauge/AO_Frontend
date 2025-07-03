<template lang="pug">
q-page(padding)
	q-toolbar.bg-secondary
		q-btn-group
			q-btn(label="Play" color="primary" icon="play_arrow" @click="play", :disabled="isPlaying")
			q-btn(label="Pause" color="primary" icon="pause" @click="pause", :disabled="!isPlaying")
			q-btn(label="Stop" color="primary" icon="stop" @click="stop")
		q-toolbar-title {{ track.name }}
		q-input(
			v-model.number="track.bpm"
			type="number"
			label="BPM"
			dense
			filled
			style="width: 80px",
			:min="5",
			:step="1"
		)
		q-tabs
			q-route-tab(name="view" label="View", :to="`/tracks/${id}`")
			q-route-tab(name="edit" label="Edit", :to="`/tracks/${id}/edit`")

	router-view
</template>
<script setup>
import { useTracksStore } from "stores/tracks"

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
})

const tracksStore = useTracksStore()
const track_id = computed(() => props.id)
const track = computed(() => tracksStore.getById(track_id.value) || { name: "Dunno", rows: [], instruments: [] })
// const instrumentsStore = useInstrumentsStore()

// const trackInstruments = computed(() => {
// 	return (track.value.instruments || []).map((id) => instrumentsStore.getById(id)).filter(Boolean)
// })

// const instrumentOptions = computed(() => {
// 	return trackInstruments.value.map((inst) => ({ label: inst.name, value: inst.id }))
// })

// const activeInstruments = ref(trackInstruments.value.map((i) => i.id))
// const tempo = ref(track.value.tempo || 120)
// const isPlaying = ref(false)
// const currentRow = ref(-1)
// let intervalId = null
// const instrumentComms = ref({})
</script>
