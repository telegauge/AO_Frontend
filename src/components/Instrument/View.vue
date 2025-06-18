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

    q-btn-group.q-ma-lg
      q-btn(v-for="cmd in Types.find(t => t.value === instrument.type).cmd" :key="cmd" :label="cmd" @click="sendCmd(cmd)")

  .text-bold Puck-o-regular (click)
  .row.q-ma-lg
    .col-shrink(v-for="i in 4" :key="i")
      q-btn(:label="i" @click="sendCmd('pluck',i-1)").mouseoverflash

  .text-bold Puck-o-matic (strum)
  .row.q-ma-lg
    .col-shrink(v-for="i in 4" :key="i")
      q-btn(:label="i" @mouseleave="sendCmd('pluck',i-1)").mouseoverflash


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
import { useInstrumentsStore, Types } from 'stores/instruments'

const store = useInstrumentsStore()

const props = defineProps({
	id: {
		type: [String, Number],
		required: true,
	},
})
const instrument = computed(() => store.getById(props.id))

const sendCmd = (cmd, arg) => {
	if (!instrument.value) return
	const url = `http://${instrument.value.ip}/api/${cmd}?arg=${arg}`
	fetch(url, {
		method: 'POST',
	})
		.then((response) => {
			if (!response.ok) throw new Error('Network response was not ok')
			return response.text()
		})
		.then((data) => {
			console.log('Command sent:', cmd, 'Response:', data)
		})
		.catch((error) => {
			console.error('Error sending command:', error)
		})
}
</script>
<style scoped lang="scss">
.mouseoverflash {
	transition: background-color 0.3s;
	&:hover {
		background-color: #ff0000;
	}
}
</style>
