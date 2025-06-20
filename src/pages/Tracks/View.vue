<template lang="pug">
q-page(padding)
  h1 Track View
  q-btn(label="Edit" :to="`/tracks/${id}/edit`" color="primary" )
</template>
<script setup>
import { computed } from 'vue'
import { useTracksStore } from 'stores/tracks'

const store = useTracksStore()

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const track = computed(() => store.getById(props.id))
</script>