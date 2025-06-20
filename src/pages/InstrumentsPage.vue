<template lang="pug">
q-page.q-pa-md
  .row
    .col-6.col-md-4.col-lg-3(v-for="instrument in instruments" :key="instrument.id" )
      InstrumentCard(:instrument="instrument")

  q-page-sticky(position="bottom" :offset="[18, 18]")
    .text-h6.text-center Add to the Band
    .row.q-gutter-md
      q-btn.col(
        v-for="t of Defs"
        stack
        :disabled="t.disabled"
        :key="t.value"
        :label="t.label"
        :icon="t.icon"
        color="primary"
        class="q-mt-md"
        @click="AddInstrument(t.value)"
      )
        q-tooltip(v-if="t.examples") {{ t.examples.join(', ') }}...
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInstrumentsStore, Defs } from 'stores/instruments'

import InstrumentCard from '../components/InstrumentCard.vue'

const router = useRouter()
const store = useInstrumentsStore()
const instruments = store.instruments

function AddInstrument(type) {
	var instrument = ref({
		id: Date.now(),
		name: `New ${type} Instrument`,
		type: type,
		ip: '',
		config: '',
	})
	store.instruments.push(instrument.value)
	router.push({ path: `/instrument/${instrument.value.id}/edit` })
}
</script>
