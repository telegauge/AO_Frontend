<template lang="pug">
  #GUITAR

    .row.justify-center.q-my-lg.q-col-gutter-md
      .col-1(v-for="chord in Object.keys(chords)" :key="chord")
        q-btn.fit(:label="chord" color="primary" @click="setChord(chord)")

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
                q-btn(label="V" round color="primary" @click="sendCmd('POST','pluck',{string:s})").mouseoverflash
            tr.bg-grey-2
              th.text-right Strum
              td(v-for="(name,s) in strings" :key="s")
                q-btn(label=">" color="primary" round @mouseleave="sendCmd('POST','pluck',{string:s})").mouseoverflash

            tr.bg-grey-2
              th.text-right Interval
              td(:colspan="strings.length")
                q-slider(v-model="interval"  type="number" :min="0" :step="100" :max="5000" label="Interval")


    q-page-sticky(position="bottom-right" :offset="[18, 18]")
      div(style="width: 100px;")
        q-linear-progress(:value="batt_percent/100" size="xl" color="primary" class="q-mt-md" width="100px")
          .absolute-full.flex.flex-center
            q-badge.text-white.text-bold {{ batt_percent }}%
          q-tooltip Battery: {{ batt_percent }}%


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
import { computed, watch, ref, onMounted, onUnmounted } from 'vue'

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
const batt_percent = ref(0)
const timer = ref(null)
onMounted(async () => {
  timer.value = setInterval(async () => {batt_percent.value = await sendCmd("GET", "battery")}, 60000)
  batt_percent.value = await sendCmd("GET", "battery")
})
onUnmounted(() => clearInterval(timer.value))

const interval = ref(0)
let intervalTimer = null
watch(interval, (newVal) => {
    clearInterval(intervalTimer)
  if (newVal > 0) {
    intervalTimer = setInterval(() => {
      sendCmd("POST", "strum")
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
  sendCmd("POST", "fret", { fret: fret, pressed: state.value[fret] })
}

const toggleFret = (fret, string) => {
	setFretAt(fret, string, !getFretAt(fret, string) )
}

const setChord = (chord) => {
  for (var f = 0; f < 2; f++) {
    var pressed = chords[chord][f]
    sendCmd("POST", "fret", { fret: f, pressed: pressed })
    for (var s = 0; s < strings.value.length; s++) {
      state.value[f] = state.value[f].substring(0, s) + pressed[s] + state.value[f].substring(s + 1)
    }
  }
}

const sendCmd = (method, cmd, args) => {
	if (!instrument.value) return
  const arg = typeof args === 'object'
    ? Object.entries(args).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')
    : args

  const url = `http://${instrument.value.ip}/api/${cmd}?${arg}`
  return fetch(url, { method })
    .then((response) => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response.text()
    })
    .then((data) => {
      if (method === 'GET') return data
      console.log('Command sent:', cmd, 'Response:', data)
    })
    .catch((error) => {
      console.error('Error sending command:', error)
    })
}


const chords = {
  "A": ["0100", "1000", "0000", "000", "0000", "0000"],
  "B": ["0000", "0011", "0100", "1000", "0000", "0000"],
  "C": ["0000", "0000", "0001", "0000", "0000", "0000"],
  "D": ["0000", "1110", "0000", "0000", "0000", "0000"],
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
