<template lang="pug">
q-page(padding)
	q-toolbar.bg-secondary
		q-btn-group
			q-btn(label="Play" color="primary" icon="play_arrow" @click="Play", :disabled="is_playing")
			q-btn(label="Pause" color="primary" icon="pause" @click="Pause", :disabled="!is_playing")
			q-btn(label="Stop" color="primary" icon="stop" @click="Stop")
		q-toolbar-title {{ track.name }} {{ beat }} = {{ current_row }}
		q-input(
			v-model.number="track.bpm"
			type="number"
			label="BPM"
			dense
			filled
			style="width: 80px",
			:min="5",
			:step="5"
		)
		q-tabs
			q-route-tab(name="view" label="View", :to="`/tracks/${id}`")
			q-route-tab(name="edit" label="Edit", :to="`/tracks/${id}/edit`")

	router-view

	pre {{ track }}
</template>
<script setup>
// import { useTracksStore } from "stores/tracks"
import { useTrack } from "./useTrack"

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
})

const track_id = computed(() => props.id)
const { track, is_playing, beat, current_row, Pause, Play, Stop } = useTrack(track_id)

// const tracksStore = useTracksStore()
// const track = computed(() => tracksStore.getById(track_id.value) || { name: "Dunno", rows: [], instruments: [] })
</script>
