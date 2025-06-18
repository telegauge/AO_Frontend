<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header(elevated)
    q-toolbar
      q-btn(flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer")
      q-toolbar-title Actuator Orchestra
      div Quasar v{{ $q.version }}
  q-drawer(v-model="leftDrawerOpen" show-if-above bordered)
    q-list
      router-link(to="/instruments")
        q-item-label(header ) Instruments
      q-item(v-for="instrument in instruments" :key="instrument.id" clickable :to="{ name: 'instrument', params: { id: instrument.id } }")
        q-item-section(avatar)
          q-icon(:name="instrument.type")
        q-item-section
          q-item-label {{ instrument.name }}
          q-item-label(caption) {{ instrument.type }} - {{ instrument.ip }}
  q-page-container
    router-view
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInstrumentsStore } from 'stores/instruments'

const leftDrawerOpen = ref(false)
const router = useRouter()
const store = useInstrumentsStore()
const instruments = store.instruments

function toggleLeftDrawer() {
	leftDrawerOpen.value = !leftDrawerOpen.value
}

function goToInstrument(id) {
	router.push({ name: 'instrument', params: { id } })
}
</script>
