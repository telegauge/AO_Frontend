<template lang="pug">
	q-page.q-pa-md
		div(v-if="instrument")
			q-btn(@click="editMode = !editMode" :label="editMode ? 'Cancel' : 'Edit'" color="primary" flat)
			InstrumentEdit(v-if="editMode" :instrument="instrument" @save="onSave" @delete="onDelete")
			InstrumentView(v-else :instrument="instrument")
		div(v-else)
			q-banner(color="negative") Instrument not found.
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useInstrumentsStore } from 'stores/instruments'
import { computed, ref } from 'vue'
import InstrumentView from 'components/Instrument/View.vue'
import InstrumentEdit from 'components/Instrument/Edit.vue'

const route = useRoute()
const router = useRouter()
const store = useInstrumentsStore()
const id = Number(route.params.id)
const editMode = ref(false)
const instrument = computed(() => store.instruments.find((inst) => inst.id === id))

function onSave(updated) {
	store.updateInstrument(id, updated)
	editMode.value = false
}
function onDelete() {
	store.removeInstrument(id)
	router.push({ name: 'instruments' })
}
</script>
