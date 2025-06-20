<template lang="pug">
  q-card.cursor-pointer(@click="router.push(`/tracks/${track.id}`)")
    q-card-section(horizontal)
      q-icon(size="100px" :name="track.type")
      q-card-section
        .text-h6 {{ track.name }}
        .text-subtitle2 {{ track.ip }}
  </template>

  <script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const props = defineProps({
    track: {
      type: Object,
      required: true
    }
  })
  const track = computed(() => props.track)
  </script>