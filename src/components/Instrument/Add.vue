<template lang="pug">
q-page.q-pa-md
  h2 Add Instrument
  q-form
    q-input(v-model="name" label="Name" outlined)
    q-input(v-model="type" label="Type" outlined)
    q-input(v-model="ip" label="IP Address" outlined)
    q-input(v-model="config" label="Config" outlined type="textarea")
    q-btn(label="Save" color="primary" class="q-mt-md" @click="onSave")
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const type = ref('')
const ip = ref('')
const config = ref('')

function onSave() {
	// Save logic to be implemented
}
</script>
