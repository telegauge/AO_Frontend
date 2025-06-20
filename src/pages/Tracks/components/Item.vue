<template lang="pug">
q-item(clickable :to="{ name: 'track', params: { id: track.id } }")
  q-item-section(avatar)
    q-icon(:name="track.type")
  q-item-section
    q-item-label {{ track.name }}
    q-item-label(caption) {{ track.ip }}
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  track: {
    type: Object,
    required: true
  }
})

const track = computed(() => props.track)
</script>