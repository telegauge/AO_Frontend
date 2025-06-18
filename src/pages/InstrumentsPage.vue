<template lang="pug">
q-page.q-pa-md
  q-list(bordered separator)
    q-item(v-for="instrument in instruments" :key="instrument.id" clickable :to="`/instruments/${instrument.id}`")
      q-item-section
        q-item-label {{ instrument.name }}
        q-item-label(caption) {{ instrument.type }} - {{ instrument.ip }}
  q-separator.q-mt-lg
  .text-h5 Add Instrument
  .row.q-gutter-md
    q-btn.col(v-for="t of Types" :key="t.value" :label="t.label" :icon="t.icon" color="primary" class="q-mt-md" @click="AddInstrument(t.value)")
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInstrumentsStore, Types } from 'stores/instruments'

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
	router.push({ path: `/instruments/${instrument.value.id}/edit` })
}
</script>
