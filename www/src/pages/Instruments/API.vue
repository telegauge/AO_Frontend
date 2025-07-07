<template lang="pug">
div
	q-list
		q-item(v-for="(fields, cmd) in play", :key="cmd")
			q-item-section(avatar)
				.text-h6 {{ cmd }}
			q-item-section(v-for="(val, field) in fields", :key="field")
				q-input(:label="field", :placeholder="val" filled)
			q-item-section(side)
				q-btn(label="Send" color="primary" @click="Send(cmd)")
</template>
<script setup>
const props = defineProps({
	id: {
		type: String,
		required: true,
	},
})

const general = ["info"]
const play = {
	pluck: {
		string: 0,
		calibrate: "0,0,0,0",
	},
	strum: {
		delay: 0,
	},
	chord: {
		chord: "0000",
	},
}
</script>
