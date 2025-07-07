<template lang="pug">
q-page(padding)
	h1 Track Home
	.row
		.col-12(v-for="track in tracks")
			TrackCard(:track="track")
	pre {{ tracks }}

	q-page-sticky(position="bottom", :offset="[18, 18]")
		q-btn(label="Add Track" color="primary" icon="mdi-plus" @click="addTrack")
</template>
<script setup>
import { useRouter } from "vue-router"
import { useTracksStore } from "stores/tracks"
import TrackCard from "./components/Card.vue"

const store = useTracksStore()
const router = useRouter()
const tracks = store.tracks

function addTrack() {
	const id = store.addTrack({ name: "New Track", bpm: 120 })
	router.push(`/tracks/${id}/edit`)
}
</script>
