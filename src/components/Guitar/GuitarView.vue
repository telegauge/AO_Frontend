<template lang="pug">
  #GUITAR

    .row.justify-center.q-my-lg
      .col-12.col-lg-4
        .row.justify-center.q-my-lg
          .col-shrink
            pre {{ state }}
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
                    q-btn.fit(color="primary" :label="getFretAt(f,s) ? '⏺' : ''" @click="toggleFret(f,s )")

                tr.bg-grey-2
                  th.text-right Pluck
                  td(v-for="s in strings" :key="s")
                    q-btn(label="V" round color="primary" @click="Pluck(s)").mouseoverflash
                tr.bg-grey-2.desktop-only
                  th.text-right Strum
                  td(v-for="s in strings" :key="s")
                    q-btn(
                      label=">"
                      color="primary"
                      round
                      @mouseenter="FlashEl"
                      @mouseleave="Pluck(s)"
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
const frets = ref(0) // overwritten by REST

const strum_delay = ref(10)

const strum_chord = ref(true)
const strum_fret = ref(true)

const state = ref("0000") // e.g., "4322" for 4 strings

let last_batt_percent = 0
const batt_percent = ref(0)
const timer = ref(null)

onMounted(async () => {
  connect()
  const info = await sendRestCmd("GET", "info")
  if (info) {
    strings.value = info.strings
    frets.value = info.fretters
  }
  timer.value = setInterval(updateBattery, 120000)
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
const batt_status = computed(() => {
  var batt = "mdi-battery-"
  if (batt_percent.value > last_batt_percent)
    batt = "mdi-battery-charging-"
  return {
    color: batt_percent.value > 20 ? "positive" : batt_percent.value > 10 ? "warning" : "negative",
    label: batt_percent.value + "%",
    icon: batt_percent.value < 10 ?
      "mdi-battery-alert-variant-outline" :
      batt_percent.value >= 100 ? 'mdi-battery-check' : batt + ((batt_percent.value / 10) | 0) + "0"
    }
})

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
    last_batt_percent = batt_percent.value
    batt_percent.value = batt.percent
  }
}

const getFretAt = (fret, string) => {
  // Returns true if the string is pressed at this fret
  return parseInt(state.value[string - 1] || 0) === fret
}
const setFretAt = (fret, string, value) => {
  // If value is true, set this string to this fret, else set to 0 (open)
  let arr = state.value.split("")
  arr[string] = value ? fret.toString() : "0"
  state.value = arr.join("")
  sendCmd("POST", "fret", { pressed: state.value })
}
const toggleFret = (fret, string) => {
  console.log("toggleFret", fret, string)
  const isPressed = getFretAt(fret, string)
  setFretAt(fret, string, !isPressed)
  if (strum_fret.value) {
    sendCmd("POST", "pluck", { string: string })
  }
}

const Pluck = (string) => {
  sendCmd("POST", "pluck", { string: string })
}

const setChord = (chord) => {
  // chord is a string like "4322"
  state.value = chords[chord]
  sendCmd("POST", "chord", { pressed: state.value, chord: chord })
  if (strum_chord.value) {
    sendCmd("POST", "strum", { delay: strum_delay.value })
  }
}

const notes = ["C", "D", "E", "F", "G", "A", "B"]
const variations = [{ label: "Major", value: "" }, { label: "Minor", value: "m" }, { label: "7", value: "7" }, { label: "Flat", value: "b" }, { label: "Major 7", value: "maj7" }, { label: "9", value: "9" }]

const chords = {
  "A": "2100",
  "Am": "2000",
  "A7": "0100",
  "B": "4322",
  "Bb": "3211",
  "Bm": "4222",
  "C": "0003",
  "Cm": "0333",
  "C7": "0210",
  "C9": "0232",
  "Cmaj7": "0200",
  "D": "2220",
  "D7": "2120",
  "Db": "1110",
  "Dm": "2210",
  "D9": "2222",
  "E": "1002",
  "Em": "0000",
  "E7": "1202",
  "Eb": "1343",
  "F": "2010",
  "Fm": "2110",
  "G": "0232",
  "G7": "0212",
  "Gm": "0331",
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
