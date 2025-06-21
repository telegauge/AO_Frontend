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
                    q-checkbox(
                      v-model="strum_fret"
                      checked-icon="mdi-guitar-pick"
                      unchecked-icon="mdi-guitar-pick-outline"
                      color="primary"
                    )
                      q-tooltip Auto-pluck when setting frets
                  th(v-for="(s) in strings" :key="s") {{ s }}
              tbody(v-if="instrument.state?.neck")
                tr(v-for="f in frets" :key="f")
                  th.text-right Fret {{ f }}
                  td(v-for="(s) in strings" :key="s")
                    q-btn.fit(color="primary" :label="getFretAt(f-1,s-1) ? '⏺' : ''" @click="toggleFret(f-1,s-1 )")

                tr.bg-grey-2
                  th.text-right Pluck
                  td(v-for="s in strings" :key="s")
                    q-btn(label="V" round color="primary" @click="Pluck(s-1)").mouseoverflash
                tr.bg-grey-2.desktop-only
                  th.text-right Strum
                  td(v-for="s in strings" :key="s")
                    q-btn(
                      label=">"
                      color="primary"
                      round
                      @mouseenter="FlashEl"
                      @mouseleave="Pluck(s-1)"
                    )

      .col-12.col-lg-8
        .row.justify-center.q-my-lg
          .col-shrink
            q-markup-table
              thead
                tr
                  th
                    q-checkbox(
                      v-model="strum_chord"
                      checked-icon="mdi-guitar-pick"
                      unchecked-icon="mdi-guitar-pick-outline"
                      color="primary"
                    )
                      q-tooltip Strum when setting chords
                  th(v-for="note in notes" :key="note") {{ note }}
              tbody
                tr(v-for="variation in variations" :key="variation")
                  th {{ variation.label }}
                  td(v-for="note in notes" :key="note")
                    q-btn.fit(:label="note+variation.value" :disabled="!chords[note+variation.value]" no-caps color="primary" @click="setChord(note + variation.value)")


    q-page-sticky(position="bottom-right" :offset="[18, 18]")
      .row
        q-chip.col-shrink( :color="rest_status.color" text-color="white" :icon="rest_status.icon" :label="rest_status.label")
        q-chip.col-shrink( :color="ws_status.color" text-color="white" :icon="ws_status.icon" :label="ws_status.label")
        q-chip.col-shrink(:icon="batt_status.icon" text-color="white" :color="batt_status.color" :label="batt_status.label")


    q-page-sticky(position="bottom-left" :offset="[18, 18]")
      q-btn(icon="mdi-cog" flat color="primary" round @click="showPrefs = true")

    q-dialog(v-model="showPrefs")
      q-card(style="min-width: 350px")
        q-card-section
          .text-h6 Preferences
        q-card-section
          .text-subtitle2 Strum Delay
          q-input(
            v-model.number="strum_delay"
            filled
            hint="Time between each note on the strum"
            suffix="ms"
            type="number"
            :min="0"
            :max="5000"
            label="Delay")
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
import { useInstrument } from 'src/pages/Instruments/useInstrument.js'

const props = defineProps({
	id: {
		type: [String, Number],
		required: true,
	},
	def: {
		type: Object,
		required: true,
	},
})

const { instrument, sendCmd, sendRestCmd, connect, disconnect, ws_online, rest_online } = useInstrument(props.id)

const strings = ref(4) // overwritten by REST
const frets = ref(6) // overwritten by REST

const strum_delay = ref(10)

const strum_chord = ref(true)
const strum_fret = ref(true)

const state = ref(["0000", "0000", "0000", "0000", "0000", "0000"])

const batt_percent = ref(0)
const timer = ref(null)

onMounted(async () => {
  connect()
  const info = await sendRestCmd("GET", "info")
  if (info) {
    strings.value = info.strings
    frets.value = info.fretters + 4
  }
  timer.value = setInterval(updateBattery, 60000)
  updateBattery()
})

onUnmounted(() => {
  disconnect()
  clearInterval(timer.value)
})

const rest_status = computed(() => ({
  color: rest_online.value ? "positive" : "negative",
  label: "REST",
  icon: rest_online.value ? "mdi-wifi" : "mdi-wifi-alert"
}))
const ws_status = computed(() => ({
  color: ws_online.value ? "positive" : "negative",
  label: "WS",
  icon: ws_online.value ? "mdi-wifi-arrow-left-right" : "mdi-wifi-alert"
}))
const batt_status = computed(() => ({
  color: batt_percent.value > 20 ? "positive" : batt_percent.value > 10 ? "warning" : "negative",
  label: batt_percent.value + "%",
  icon: batt_percent.value < 10 ?
    "mdi-battery-alert-variant-outline" :
    batt_percent.value >= 100 ? 'mdi-battery-check' : "mdi-battery-" + ((batt_percent.value / 10) | 0) + "0"
}))

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


const updateBattery = async () => {
  const batt = await sendRestCmd("GET", "battery")
  if (batt) {
    batt_percent.value = batt.percent
  }
}

const getFretAt = (fret, string) => {
	return state.value[fret][string] == 1
}
const setFretAt = (fret, string, value) => {
  var set = value ? "1" : "0"
  console.log(fret, string, set)
	state.value[fret] = state.value[fret].substring(0, string) + set + state.value[fret].substring(string + 1)
  sendCmd("POST", "fret", { fret: fret, pressed: state.value[fret] })
}

const toggleFret = (fret, string) => {
  const state = !getFretAt(fret, string)
	setFretAt(fret, string, state )
  if (strum_fret.value) {
    sendCmd("POST", "pluck", { string: string })
  }
}

const Pluck = (string) => {
  sendCmd("POST", "pluck", { string: string })
}

const setChord = (chord) => {
  var out = ""
  for (var f = 0; f < frets.value; f++) {
    var pressed = chords[chord][f]
    out += pressed
    for (var s = 0; s < strings.value; s++) {
      state.value[f] = state.value[f].substring(0, s) + pressed[s] + state.value[f].substring(s )
    }
  }
  sendCmd("POST", "chord", { pressed: out, chord: chord })
  if (strum_chord.value) {
    sendCmd("POST", "strum", { delay: strum_delay.value })
  }
}

const notes = ["C", "D", "E", "F", "G", "A", "B"]
const variations = [{ label: "Major", value: "" }, { label: "Minor", value: "m" }, { label: "7", value: "7" }, { label: "Flat", value: "b" }, { label: "Major 7", value: "maj7" }, { label: "9", value: "9" }]

const chords = {
  "A": ["0100", "1000", "0000", "00000", "0000", "0000"],
  "Am": ["0000", "1000", "0000", "0000", "0000", "0000"],
  "A7": ["0100", "0000", "0000", "0000", "0000", "0000"],
  "B": ["0000", "0011", "0100", "1000", "0000", "0000"],
  "Bb": ["0011", "0100", "1000", "0000", "0000", "0000"],
  "Bm": ["0000", "0111", "1000", "0000", "0000", "0000"],
  "C": ["0000", "0000", "0001", "0000", "0000", "0000"],
  "Cm": ["0000", "0000", "0111", "0000", "0000", "0000"],
  "C7": ["0001", "0000", "0000", "0000", "0000", "0000"],
  "C9": ["0001", "0100", "0000", "0000", "0000", "0000"],
  "Cmaj7": ["0000", "0001", "0000", "0000", "0000", "0000"],
  "D": ["0000", "1110", "0000", "0000", "0000", "0000"],
  "D7": ["0000", "1110", "0001", "0000", "0000", "0000"],
  "Db": ["1110", "0000", "0000", "0001", "0000", "0000"],
  "Dm": ["0010", "1100", "0000", "0000", "0000", "0000"],
  "D9": ["0000", "1010", "0001", "0100", "0000", "0000"],
  "E": ["0000", "0001", "0000", "1110", "0000", "0000"],
  "Em": ["0000", "0001", "0010", "0100", "0000", "0000"],
  "E7": ["1000", "0101", "0000", "0000", "0000", "0000"],
  "Eb": ["0001", "0000", "0110", "0000", "0000", "0000"],
  "F": ["0010", "1000", "0000", "0000", "0000", "0000"],
  "Fm": ["1010", "0000", "0001", "0000", "0000", "0000"],
  "G": ["0000", "0101", "0010", "0000", "0000", "0000"],
  "G7": ["0010", "0101", "0000", "0000", "0000", "0000"],
  "Gm": ["0001", "0100", "0010", "0000", "0000", "0000"],

}

const showPrefs = ref(false)

const FlashEl = (e) => {
  const target = e.target || e.currentTarget
  target.style.opacity = '0.5'
  setTimeout(() => {
    target.style.opacity = '1'
  }, 1000)
}

const handleTouchMove = (e, string) => {
  const touch = e.touches[0]
  const target = document.elementFromPoint(touch.clientX, touch.clientY)
  if (target && target.classList.contains('q-btn')) {
    FlashEl({ target })
    sendCmd('POST', 'pluck', { string })
  }
}
</script>
<style scoped lang="scss">
.mouseoverflash {
	transition: opactiy 0.3s;
}
</style>
