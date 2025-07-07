<template lang="pug">
#LEFT-MENU
q-toggle(v-model="dark_mode" label="Dark Mode" checked-icon="mdi-weather-night" unchecked-icon="mdi-weather-sunny")
q-expansion-item(
	label="Instruments"
	default-opened
	expand-icon-class="text-white"
	header-class="text-h6 bg-primary text-white"
	icon="mdi-guitar-acoustic"
)
	q-list
		//- router-link(to="/instruments")
		//-   q-item-label(header ) Instruments
		InstrumentItem(v-for="instrument in instruments", :key="instrument.id", :instrument="instrument")
	.full-width.row.justify-center.q-pa-md
		q-btn.fit(label="Add Instrument" color="primary" icon="mdi-plus" rounded to="/instruments" @click="AddInstrument")

q-expansion-item(
	label="Tracks"
	default-opened
	expand-icon-class="text-white"
	header-class="text-h6 bg-primary text-white"
	icon="mdi-music-clef-treble"
)
	q-list
		TrackItem(v-for="track in tracks", :key="track.id", :track="track")

	.full-width.row.justify-center.q-pa-md
		q-btn.fit(label="Add Track" color="primary" icon="mdi-plus" rounded to="/tracks" @click="AddInstrument")
</template>
<script setup>
import { useInstrumentsStore } from "stores/instruments"
import { useTracksStore } from "stores/tracks"
import InstrumentItem from "pages/Instruments/components/Item.vue"
import TrackItem from "pages/Tracks/components/Item.vue"

const store = useInstrumentsStore()
const tracksStore = useTracksStore()

const instruments = store.instruments
const tracks = tracksStore.tracks

const dark_mode = useStorage("dark_mode", false)
</script>
