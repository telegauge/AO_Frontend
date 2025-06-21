<template lang="pug">
q-page(padding)
  .row.items-center.q-gutter-md
    .col-auto
      q-btn-group
        q-btn(icon="play_arrow" @click="play" :disabled="isPlaying" color="primary" label="Play")
        q-btn(icon="pause" @click="pause" :disabled="!isPlaying" color="primary" label="Pause")
        q-btn(icon="stop" @click="stop" color="primary" label="Stop")
    .col-auto
      .text-caption Tempo
      q-slider(v-model="tempo" :min="5" :max="100" :step="1" label :label-value="tempo + ' BPM'" style="width: 200px")
    .col
      q-option-group(
        v-model="activeInstruments"
        :options="instrumentOptions"
        type="checkbox"
        inline
      )
    q-space
    q-btn(icon="edit" :to="`/tracks/${props.id}/edit`" color="primary" label="Edit")
  q-markup-table(flat bordered).q-mt-md
    thead
      tr
        th Time
        th(v-for="instrument in trackInstruments" :key="instrument.id") {{ instrument.name }}
    tbody
      tr(v-for="(row, rowIndex) in track.rows" :key="rowIndex" :class="{ 'bg-yellow-2': currentRow === rowIndex }")
        td.text-center
          .text-caption {{ rowIndex + 1 }}
        td(v-for="instrument in trackInstruments" :key="instrument.id")
          | {{ getCellDisplay(row[instrument.id]) }}
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'
import { useTracksStore } from 'stores/tracks'
import { useInstrumentsStore } from 'stores/instruments'
import { useInstrument } from 'src/pages/Instruments/useInstrument.js'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const tracksStore = useTracksStore()
const instrumentsStore = useInstrumentsStore()

const track = computed(() => tracksStore.getById(props.id) || { rows: [], instruments: [] })

const trackInstruments = computed(() => {
  return (track.value.instruments || []).map(id => instrumentsStore.getById(id)).filter(Boolean)
})

const instrumentOptions = computed(() => {
  return trackInstruments.value.map(inst => ({ label: inst.name, value: inst.id }))
})

const activeInstruments = ref(trackInstruments.value.map(i => i.id))
const tempo = ref(track.value.tempo || 120)
const isPlaying = ref(false)
const currentRow = ref(-1)
let intervalId = null
const instrumentComms = ref({})

watch(trackInstruments, (newInstruments) => {
  // Disconnect old instruments
  Object.values(instrumentComms.value).forEach(comm => comm.disconnect())
  instrumentComms.value = {}

  // Connect new instruments
  newInstruments.forEach(inst => {
    const comms = useInstrument(inst.id)
    comms.connect()
    instrumentComms.value[inst.id] = comms
  })

  // Set active instruments
  activeInstruments.value = newInstruments.map(i => i.id)

}, { immediate: true })

watch(tempo, (newTempo) => {
  tracksStore.updateTrack(props.id, { tempo: newTempo })
  if (isPlaying.value) {
    clearInterval(intervalId)
    const interval = (60 / newTempo / 4) * 1000 // 16th notes
    intervalId = setInterval(tick, interval)
  }
})

const play = () => {
  if (isPlaying.value) return
  isPlaying.value = true
  currentRow.value = -1
  const interval = (60 / tempo.value / 4) * 1000 // 16th notes
  intervalId = setInterval(tick, interval)
}

const pause = () => {
  isPlaying.value = false
  clearInterval(intervalId)
  intervalId = null
}

const stop = () => {
  pause()
  currentRow.value = -1
}

const tick = () => {
  if (!isPlaying.value) return

  currentRow.value = (currentRow.value + 1) % (track.value.rows.length || 1)

  const rowData = track.value.rows[currentRow.value]
  if (!rowData) return

  trackInstruments.value.forEach((instrument) => {
    if (activeInstruments.value.includes(instrument.id)) {
      const noteData = rowData[instrument.id]
      if (noteData && noteData.action !== 'rest') {
        const comms = instrumentComms.value[instrument.id]
        if (comms) {
          console.log(`Playing ${JSON.stringify(noteData)} on ${instrument.name}`)
          comms.sendCmd('POST', noteData.action, noteData)
        }
      }
    }
  })
}

const getCellDisplay = (cellData) => {
  if (!cellData) return ''
  switch (cellData.action) {
    case 'pluck':
      return "String " + cellData.string
    case 'note':
      return "Note: " + cellData.note
    case 'chord':
      return "Chord: " + cellData.note || cellData.chord
    case 'rest':
      return ''
    default:
      return ''
  }
}

// // Ensure there are always a certain number of rows
// watch(() => track.value.id, () => {
//   if (track.value && track.value.rows.length < 64) {
//     const currentLength = track.value.rows.length
//     for (let i = 0; i < 64 - currentLength; i++) {
//       const newRow = {}
//       trackInstruments.value.forEach(inst => {
//         if (inst && inst.id) {
//           newRow[inst.id] = { action: 'rest' }
//         }
//       })
//       track.value.rows.push(newRow)
//     }
//   }
// }, { immediate: true })


onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  Object.values(instrumentComms.value).forEach(comm => comm.disconnect())
})

</script>
