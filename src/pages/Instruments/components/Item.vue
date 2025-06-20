<template lang="pug">
q-item( clickable :to="{ name: 'instrument', params: { id: instrument.id } }")
  q-item-section(avatar)
      q-icon(:name="instrument.type")
  q-item-section
    q-item-label {{ instrument.name }}
    q-item-label(caption) {{ instrument.type }} - {{ instrument.ip }}

</template>
<script setup>

 defineProps({
  instrument: {
    type: Object,
    required: true
  }
})
</script>