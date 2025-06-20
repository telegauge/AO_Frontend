<template lang="pug">
q-page(padding)
  div(v-if="!instrument")
    q-banner Instrument not found
  div(v-else)
    //- q-toolbar.bg-secondary
    //-   q-avatar
    //-     q-icon(:name="instrument.type")
    //-   q-toolbar-title {{ instrument.name }}
    //-   q-btn(:href="`http://${instrument.ip}`" flat target="_blank") {{ instrument.ip }}
    //-   q-btn(icon="edit" flat :to="`/instruments/${props.id}/edit`")

    q-expansion-item(
        v-if="instrument.id"
        header-class="bg-secondary"
        :label="instrument.name"
        :caption="instrument.type"
        :icon="instrument.type"
        expand-separator)
      q-card
        q-card-section
          li Type: {{ instrument.type }}
          li IP: {{ instrument.ip }}
          li Config: {{ instrument.config }}
          li Actions:
            ul
              li(v-for="cmd in def.cmd" :key="cmd") {{ cmd }}
        q-card-actions
          q-space
          q-btn(icon="edit" label="Edit" color="primary" :to="`/instruments/${props.id}/edit`")

    component(:is="views[instrument.type]" :def="def" :instrument="instrument")

    //- q-page-sticky(position="bottom-left" :offset="[18, 18]")
    //-   q-btn(
    //-     icon="edit"
    //-     round
    //-     color="primary"
    //-     :to="`/instruments/${props.id}/edit`"
    //-   )
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useInstrumentsStore } from 'stores/instruments'

const views = {
	guitar: defineAsyncComponent(() => import('../../components/Guitar/GuitarView.vue')),
}

const store = useInstrumentsStore()

const props = defineProps({
	id: {
		type: [String, Number],
		required: true,
	},
})
const instrument = computed(() => store.getById(props.id))
const def = computed(() => store.getDefById(props.id))

// const sendCmd = (cmd, arg) => {
// 	if (!instrument.value) return
// 	const url = `http://${instrument.value.ip}/api/${cmd}?arg=${arg}`
// 	fetch(url, {
// 		method: 'POST',
// 	})
// 		.then((response) => {
// 			if (!response.ok) throw new Error('Network response was not ok')
// 			return response.text()
// 		})
// 		.then((data) => {
// 			console.log('Command sent:', cmd, 'Response:', data)
// 		})
// 		.catch((error) => {
// 			console.error('Error sending command:', error)
// 		})
// }
</script>
<style scoped lang="scss">
.mouseoverflash {
	transition: background-color 0.3s;
	&:hover {
		background-color: #ff0000;
	}
}
</style>
