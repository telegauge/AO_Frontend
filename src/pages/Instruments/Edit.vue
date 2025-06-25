<template lang="pug">
q-page.q-pa-md
  h2 {{ isNew ? 'Add Instrument' : 'Edit Instrument' }}
  .row.q-col-gutter-md(v-if="instrument")
    .col-6: q-input(v-model="instrument.name" filled label="Name" outlined)
    .col-6: q-input(v-model="instrument.ip" filled   label="IP Address" outlined)
    .text-h6 Type
    .col-12: q-btn-toggle(spread v-model="instrument.type" :options="Defs" label="Type" outlined)

    .col-12: component(:is="views[instrument.type]" :config="instrument.config")

    q-page-sticky(position="bottom-right" :offset="[18, 18]")
      q-btn(label="Delete" color="negative" @click="onDelete")
    q-page-sticky(position="bottom-left" :offset="[18, 18]")
      q-btn(label="<<" round color="primary" :to="`/instruments/${props.id}`")
  div(v-else)
    p Instrument not found

  pre {{ instrument.config }}
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { useInstrumentsStore, Defs } from 'stores/instruments'
import { useRouter } from 'vue-router'

import { useInstrument } from './useInstrument.js'

const views = {
	guitar: defineAsyncComponent(() => import('./forms/guitar.vue')),
}

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
