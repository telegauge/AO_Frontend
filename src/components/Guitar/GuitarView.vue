<template lang="pug">
  #GUITAR

    .row.justify-center.q-my-lg
      .col-shrink
        q-markup-table
          thead
            tr
              th
              th(v-for="(name,s) in strings" :key="s")
                .text-h6 {{ name }}
          tbody(v-if="instrument.state.neck")
            tr(v-for="f in frets" :key="f")
              th.text-right Fret {{ f }}
              td(v-for="(name,s) in strings" :key="s")
                q-btn.fit(color="primary" :label="getFretAt(f-1,s) ? 'x' : ' '" @click="toggleFret(f-1,s)")

            tr.bg-grey-2
              th.text-right Pluck
              td(v-for="(name,s) in strings" :key="s")
                q-btn(label="V" round color="primary" @click="sendCmd('pluck',{string:s})").mouseoverflash
            tr.bg-grey-2
              th.text-right Strum
              td(v-for="(name,s) in strings" :key="s")
                q-btn(label=">" color="primary" round @mouseleave="sendCmd('pluck',{string:s})").mouseoverflash

            tr.bg-grey-2
              th.text-right Interval
              td(:colspan="strings.length")
                q-slider(v-model="interval"  type="number" :min="0" :step="100" :max="5000" label="Interval")

    //- q-btn-group.q-ma-lg
    //-   q-btn(v-for="cmd in def.cmd" :key="cmd" :label="cmd" @click="sendCmd(cmd)")

    //- .text-bold Puck-o-regular (clickxx)
    //- .row.q-ma-lg
    //-   .col-shrink(v-for="i in 4" :key="i")
    //-     q-btn(:label="i" @click="sendCmd('pluck',i-1)").mouseoverflash

    //- .text-bold Puck-o-matic (strum)
    //- .row.q-ma-lg
    //-   .col-shrink(v-for="i in 4" :key="i")
    //-     q-btn(:label="i" @mouseleave="sendCmd('pluck',i-1)").mouseoverflash


  </template>

<script setup>
import { computed, watch, ref, onBeforeMount } from 'vue'

const props = defineProps({
	instrument: {
		type: Object,
		required: true,
	},
	def: {
		type: Object,
		required: true,
	},
})
const instrument = computed(() => props.instrument)

const strings = ref(['G', 'C', 'A', 'E'])
const frets = ref(6)

const interval = ref(0)
let intervalTimer = null
watch(interval, (newVal) => {
    clearInterval(intervalTimer)
  if (newVal > 0) {
    intervalTimer = setInterval(() => {
      sendCmd("strum")
    }, newVal)
  }
})

const state = ref(["0000", "0000", "0000", "0000", "0000", "0000"])

const getFretAt = (fret, string) => {
	return state.value[fret][string] == 1
}
const setFretAt = (fret, string, value) => {
  var set = value ? "1" : "0"
	state.value[fret] = state.value[fret].substring(0, string) + set + state.value[fret].substring(string + 1)
  sendCmd("fret", { fret: fret, pressed: state.value[fret] })
}

const toggleFret = (fret, string) => {
	setFretAt(fret, string, !getFretAt(fret, string) )
}

onBeforeMount(() => {
  console.log(instrument.value)
	for (let f = 0; f < frets.value; f++) {
		if (!instrument.value.state.neck[f]) {
			instrument.value.state.neck[f] = []
    }
		for (let s = 0; s < strings.value.length; s++) {
      // console.log(f, s, instrument.value.state)
			instrument.value.state.neck[f][s] = false
		}
	}
})

const sendCmd = (cmd, args) => {
	if (!instrument.value) return
  const arg = typeof args === 'object' ?
    Object.entries(args)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
    : args

	const url = `http://${instrument.value.ip}/api/${cmd}?${arg}`
  // console.log(url)
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
