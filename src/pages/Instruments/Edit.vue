<template lang="pug">
q-page.q-pa-md
  h2 {{ isNew ? 'Add Instrument' : 'Edit Instrument' }}
  q-form(v-if="instrument")
    q-btn-toggle.q-my-sm(spread v-model="instrument.type" :options="Defs" label="Type" outlined)
    q-input.q-my-sm(v-model="instrument.name" filled label="Name" outlined)
    q-input.q-my-sm(v-model="instrument.ip" filled   label="IP Address" outlined)
    q-input.q-my-sm(v-model="instrument.config" filled label="Config" outlined type="textarea")
    q-page-sticky(position="bottom-right" :offset="[18, 18]")
      q-btn(label="Delete" color="negative" @click="onDelete")
    q-page-sticky(position="bottom-left" :offset="[18, 18]")
      q-btn(label="<<" round color="primary" :to="`/instruments/${props.id}`")
  div(v-else)
    p Instrument not found

  pre {{ instrument }}
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInstrumentsStore, Defs } from 'stores/instruments'
import { useRouter } from 'vue-router'

import { useInstrument } from './useInstrument.js'

const props = defineProps({
	id: {
		type: [String, Number],
		required: true,
	},
})
const id = computed(() => Number(props.id))
const store = useInstrumentsStore()
const router = useRouter()
const { instrument } = useInstrument(id)

// let instrument = null
// instrument = ref(store.instruments.find((i) => i.id === id.value))

function onDelete() {
	store.removeInstrument(id.value)
	router.push({ name: 'instruments' })
}
</script>
