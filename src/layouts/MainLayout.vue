<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header(elevated)
    q-toolbar
      q-btn(flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer")
      q-toolbar-title Actuator Orchestra
      div Quasar v{{ $q.version }}

  q-drawer(v-model="leftDrawerOpen" show-if-above bordered)
    LeftMenu
  q-page-container
    router-view
</template>

<script setup>
import { ref } from 'vue'

import LeftMenu from './LeftMenu.vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
	leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
