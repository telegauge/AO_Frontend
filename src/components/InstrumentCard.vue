<template lang="pug">
q-card.cursor-pointer(@click="router.push(`/instrument/${instrument.id}`)")
  q-card-section(horizontal)
    q-icon(size="100px" :name="instrument.type")
    q-card-section
      .text-h6 {{ instrument.name }}
      .text-subtitle2 {{ instrument.ip }}
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  instrument: {
    type: Object,
    required: true
  }
})
const instrument = computed(() => props.instrument)
</script>