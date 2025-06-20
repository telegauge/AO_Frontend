<template lang="pug">
q-page(padding)
  .row.q-col-gutter-md
    .col
      q-input(v-model="track.name" label="Name" filled)
    .col
      q-select(v-model="track.timesignature" :options="timesignatures" map-options emit-value label="Time Signature" filled)

  q-markup-table(bordered).q-my-md
    thead
      tr
        th
        th(v-for="i in track.instruments" :key="i.id" colspan="3")
          q-chip.fit(size="lg" color="secondary" :icon="instrumentsStore.getById(i).type" square) {{ instrumentsStore.getById(i)?.name }}
        th
          q-select(
            map-options
            emit-value
            :options="instruments"
            label="Add Instrument..."
            filled
            @update:model-value="addInstrument"
          )
            template(#prepend)
              q-icon(name="mdi-plus")
            template(#option="scope")
              q-item(v-bind="scope.itemProps" :disable="track.instruments.includes(scope.opt.id)")
                q-item-section(avatar)
                  q-icon(:name="scope.opt.type")
                q-item-section
                  q-item-label {{ scope.opt.name }}
    tbody
      tr(v-for="(t,i) in track.rows" :key="i" :class="{ 'bottom_separator': i % 4 === 0 }")
        th {{ i+1 }}
        Row(v-for="(i) in track.instruments" :key="i" :track="t[i] || {}" :instrument="instrumentsStore.getById(i) || {}")
        th
          q-btn(label="Action")
    tfoot
      tr
        td(colspan="100%")
          q-btn(label="Add Measure" color="primary" @click="addRow")

  pre {{ track }}

  q-page-sticky(position="bottom-right" :offset="[18,18]")
    .row.q-col-gutter-md
      .col
        q-btn.fit(label="Delete the whole thing" color="negative" @click="deleteTrack")
      .col
        q-btn.fit(label="Delete Rows" color="negative" @click="deleteRows")


</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTracksStore } from 'stores/tracks'
import { useInstrumentsStore } from 'stores/instruments'

import Row from './components/Row.vue'

const store = useTracksStore()
const router = useRouter()
const instrumentsStore = useInstrumentsStore()
const instruments = instrumentsStore.instruments

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const track = computed(() => store.getById(props.id))

function deleteTrack() {
  store.removeTrack(props.id)
  router.push('/tracks')
}

function deleteRows() {
  track.value.rows = []
}

function addRow() {
  if (!track.value.rows) track.value.rows = []
  var rows = track.value.timesignature.split('/')[0] || 4
  for (var r = 0; r < rows; r++) {
    var push = {}
    for (var iid of track.value.instruments) {
      push[iid] = {
        id: Date.now(),
        action: "rest"
      }
    }
    track.value.rows.push(push)
  }
}

function addInstrument(instrument) {
  track.value.instruments.push(instrument.id)
  for (var i = 0; i < track.value.rows.length; i++) {
    track.value.rows[i][instrument.id] = {
      id: Date.now(),
      action: "rest"
    }
  }
}


const timesignatures = [
  { label: "4/4", value: "4/4" },
  { label: "3/4", value: "3/4" },
  { label: "2/4", value: "2/4" },
  { label: "1/4", value: "1/4" },
]
</script>
<style lang="scss">
.q-markup-table tr.bottom_separator > td,
.q-markup-table tr.bottom_separator > th {
  border-top: 1px solid #888;
}
</style>