<template lang="pug">
#LEFT-MENU
  q-expansion-item(
    label="Instruments"
    default-opened
    header-class="text-h6 bg-primary text-white"
    expand-icon-class="text-white"
    icon="mdi-guitar-acoustic")
    q-list
      //- router-link(to="/instruments")
      //-   q-item-label(header ) Instruments
      InstrumentItem(v-for="instrument in instruments" :key="instrument.id" :instrument="instrument")
    .full-width.row.justify-center.q-pa-md
      q-btn.fit(icon="mdi-plus" to="/instruments" color="primary" rounded label="Add Instrument" @click="AddInstrument")

  q-expansion-item(
    label="Tracks"
    default-opened
    header-class="text-h6 bg-primary text-white"
    expand-icon-class="text-white"
    icon="mdi-music-clef-treble")
    q-list
      TrackItem(v-for="track in tracks" :key="track.id" :track="track")

    .full-width.row.justify-center.q-pa-md
      q-btn.fit(icon="mdi-plus" rounded to="/tracks" color="primary"  label="Add Track" @click="AddInstrument")



</template>
<script setup>
import { useInstrumentsStore } from 'stores/instruments'
import { useTracksStore } from 'stores/tracks'
import InstrumentItem from 'pages/Instruments/components/Item.vue'
import TrackItem from 'pages/Tracks/components/Item.vue'

const store = useInstrumentsStore()
const tracksStore = useTracksStore()

const instruments = store.instruments
const tracks = tracksStore.tracks


</script>