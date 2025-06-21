<template lang="pug">
td
  q-btn(:icon="actions.find(a => a.value === track.action)?.icon" :color="track.action === 'rest' ? 'grey' : 'primary'")
    q-menu
      q-list
        q-item(v-for="a in actions" v-close-popup :key="a.value" clickable :value="a.value" @click="track.action = a.value")
          q-item-section(avatar)
            q-icon(:name="a.icon")
          q-item-section
            q-item-label {{ a.label }}

td(v-if="track.action === 'note'")
  q-input(v-model="track.note" filled label="Play Note" dense )
td(v-else-if="track.action === 'chord'")
  q-input(v-model="track.chord" filled label="Strum Chord" dense )
td(v-else-if="track.action === 'pluck'")
  q-input(v-model.number="track.string" type="number" filled label="Pluck String" dense )
td(v-else-if="track.action === 'rest'").text-center --
td(v-else)

td(v-if="['note', 'chord'].includes(track.action)")
  q-btn(:icon="modes.find(m => m.value === track.mode)?.icon")
    q-tooltip {{ modes.find(m => m.value === track.mode)?.description }}
    q-menu
      q-list
        q-item(v-for="i in modes" v-close-popup :key="i.label" clickable :value="i.label" @click="track.mode = i.value")
          q-tooltip(v-if="i.description") {{ i.description }}
          q-item-section(avatar)
            q-icon(:name="i.icon")
          q-item-section
            q-item-label {{ i.label }}
td(v-else)
</template>
<script setup>
import { computed } from 'vue'
import { useInstrumentsStore } from 'stores/instruments'

const instrumentsStore = useInstrumentsStore()
const instruments = instrumentsStore.instruments

const props = defineProps({
  track: {
    type: Object,
    required: true
  },
  instrument: {
    type: Object,
    required: true
  }
})

const track = computed(() => props.track)

const actions = [
  { label: "Note", value: "note", icon: "mdi-music-note" },
  { label: "Chord", value: "chord", icon: "mdi-guitar-acoustic" },
  { label: "Pluck", value: "pluck", icon: "mdi-guitar-pick" },
  { label: "Rest", value: "rest", icon: "mdi-music-note-off" },
]

const modes = [
  { label: "", value: undefined, icon: "mdi-minus", description: "Set an optional mode" },
  { label: "Sustain", value: "sus", icon: "mdi-arrow-expand-down", description: "Hold the note past the end of the measure" },
  { label: "Stacatto", value: "stac", icon: "mdi-arrow-collapse-vertical", description: "Play the note quickly and stop" },
]
</script>