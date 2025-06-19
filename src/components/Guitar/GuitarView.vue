<template lang="pug">
  #GUITAR

    .row.justify-center.q-my-lg
      .col-12.col-lg-4
        .row.justify-center.q-my-lg
          .col-shrink
            q-markup-table
              thead
                tr
                  th
                  th(v-for="(s) in strings" :key="s") {{ s }}
              tbody(v-if="instrument.state.neck")
                tr(v-for="f in frets" :key="f")
                  th.text-right Fret {{ f }}
                  td(v-for="(name,s) in strings" :key="s")
                    q-btn.fit(color="primary" :label="getFretAt(f-1,s) ? '⏺' : ''" @click="toggleFret(f-1,s)")

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
                  td(:colspan="strings")
                    q-slider(v-model="interval"  type="number" :min="0" :step="100" :max="5000" label="Interval")

      .col-12.col-lg-8
        .row.justify-center.q-my-lg
          .col-shrink
            q-markup-table
              thead
                tr
                  th
                    q-checkbox(v-model="strum_it")
                      q-tooltip Strum when setting chords
                  th(v-for="note in notes" :key="note") {{ note }}
              tbody
                tr(v-for="variation in variations" :key="variation")
                  th {{ variation.label }}
                  td(v-for="note in notes" :key="note")
                    q-btn.fit(:label="note+variation.value" :disabled="!chords[note+variation.value]" no-caps color="primary" @click="setChord(note + variation.value)")


    q-page-sticky(position="bottom-right" :offset="[18, 18]")
      .row
        q-chip.col-shrink(v-if="online" color="positive" text-color="white" icon="mdi-wifi") Online
        q-chip.col-shrink(v-else color="negative" text-color="white" icon="mdi-wifi-off") Offline
        q-chip.col-shrink(icon="mdi-battery" text-color="white" :color="batt_percent > 20 ? 'positive' : batt_percent > 10 ? 'warning' : 'negative'") {{ batt_percent }}%


    q-page-sticky(position="bottom-left" :offset="[18, 18]")
      q-btn(icon="mdi-cog" flat color="primary" round @click="showPrefs = true")

    q-dialog(v-model="showPrefs")
      q-card(style="min-width: 350px")
        q-card-section
          .text-h6 Preferences
        q-card-section
          .text-subtitle2 Strum Delay
          q-slider(v-model="strum_delay" type="number" :min="0" :max="5000" label="Delay")
        q-card-actions(align="right")
          q-btn(flat label="Close" color="primary" v-close-popup)



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

const online = ref(false)
const strings = ref(4)
const frets = ref(6)
const strum_delay = ref(1000)

const strum_it = ref(false)

const batt_percent = ref(0)
const timer = ref(null)
onMounted(async () => {
  timer.value = setInterval(async () => {batt_percent.value = await sendCmd("GET", "battery")}, 6000)
  batt_percent.value = await sendCmd("GET", "battery")
})

onMounted(async () => {
  const info = await sendCmd("GET", "info")
  strings.value = info.strings
  frets.value = info.fretters + 4
  if (info.instrument) {
      online.value = true
  }
})
onUnmounted(() => clearInterval(timer.value))

const interval = ref(0)
let intervalTimer = null
watch(interval, (newVal) => {
    clearInterval(intervalTimer)
  if (newVal > 0) {
    intervalTimer = setInterval(() => {
      sendCmd("POST", "strum", { delay: strum_delay.value })
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
  var out = ""
  for (var f = 0; f < frets.value; f++) {
    var pressed = chords[chord][f]
    out += pressed
    for (var s = 0; s < strings.value; s++) {
      console.log(pressed, f, s, out[s])
      state.value[f] = state.value[f].substring(0, s) + pressed[s] + state.value[f].substring(s + 1)
    }
  }
  console.log(out)
  sendCmd("POST", "chord", { pressed: out, chord: chord })
  if (strum_it.value) {
    sendCmd("POST", "strum", { delay: strum_delay.value })
  }
}

const sendCmd = (method, cmd, args) => {
	if (!instrument.value) return
  const arg = typeof args === 'object'
    ? Object.entries(args).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')
    : args

  let url = `http://${instrument.value.ip}/api/${cmd}`
  if (args) {
    url += `?${arg}`
  }
  return fetch(url, { method })
    .then((response) => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response.text()
    })
    .then((data) => {
      console.log('Command sent:', cmd, 'Response:', data)
      if (method === 'GET') return JSON.parse(data)
    })
    .catch((error) => {
      console.error('Error sending command:', error)
    })
}

const notes = ["C", "D", "E", "F", "G", "A", "B"]
const variations = [{ label: "Major", value: "" }, { label: "Minor", value: "m" }, { label: "7", value: "7" }, { label: "Flat", value: "b" }, { label: "Major 7", value: "maj7" }, { label: "9", value: "9" }]

const chords = {
  "A": ["0100", "1000", "0000", "00000", "0000", "0000"],
  "Am": ["0000", "1000", "0000", "0000", "0000", "0000"],
  "A7": ["0100", "0000", "0000", "0000", "0000", "0000"],
  "B": ["0000", "0011", "0100", "1000", "0000", "0000"],
  "C": ["0000", "0000", "0001", "0000", "0000", "0000"],
  "Cm": ["0000", "0000", "0111", "0000", "0000", "0000"],
  "C7": ["0001", "0000", "0000", "0000", "0000", "0000"],
  "C9": ["0001", "0100", "0000", "0000", "0000", "0000"],
  "Cmaj7": ["0000", "0001", "0000", "0000", "0000", "0000"],
  "D": ["0000", "1110", "0000", "0001", "0000", "0000"],
  "D7": ["0000", "1110", "0001", "0000", "0000", "0000"],
  "Db": ["1110", "0000", "0000", "0001", "0000", "0000"],
  "Dm": ["0010", "1100", "0000", "0000", "0000", "0000"],
  "E": ["0000", "0001", "0000", "1110", "0000", "0000"],
  "F": ["0010", "1000", "0000", "0000", "0000", "0000"],
  "G": ["0000", "0101", "0010", "0000", "0000", "0000"],
  "G7": ["0010", "0101", "0000", "0000", "0000", "0000"],

}

const showPrefs = ref(false)
</script>
<style scoped lang="scss">
.mouseoverflash {
	transition: background-color 0.3s;
	&:hover {
		background-color: #ff0000;
	}
}
</style>
