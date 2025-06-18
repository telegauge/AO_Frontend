<template lang="pug">
q-page(padding)
  div(v-if="!instrument")
    q-banner Instrument not found
  div(v-else)
    h2 {{ instrument.name }}
    p
      strong Type:
      |  {{ instrument.type }}
    p
      strong IP Address:
      |  {{ instrument.ip }}
    pre {{ instrument.config }}
    q-page-sticky(position="bottom-left" :offset="[18, 18]")
      q-btn(
        icon="edit"
        round
        color="primary"
        :to="`/instruments/${props.id}/edit`"
      )
</template>

<script setup>
import { computed } from 'vue'
import { useInstrumentsStore } from 'stores/instruments'

const store = useInstrumentsStore()

const props = defineProps({
	id: {
		type: [String, Number],
		required: true,
	},
})
const instrument = computed(() => store.getById(props.id))
</script>

<style scoped lang="scss">
.q-fab-bottom-right {
	position: fixed;
	right: 24px;
	bottom: 24px;
	z-index: 100;
}
</style>
