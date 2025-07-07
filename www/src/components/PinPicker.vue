<template lang="pug">
q-chip.text-bold(:label="i2c + ':' + pin" color="primary" text-color="white" square)
	q-menu.row.q-pa-sm(style="width: 200px")
		.col-6.row
			.text-h6 I2C Addr
			.col-12(v-for="b in i2c_opts")
				q-radio(v-model="i2c", :label="b", :val="b")
		.col-6.row
			.text-h6 Pin
			.col-12(v-for="p in 8")
				q-radio(v-model="pin", :label="p - 1", :val="p - 1")
</template>
<script setup>
const i2c = defineModel("i2c", { type: Number, default: "0x40" })
const pin = defineModel("pin", { type: Number, default: 0 })

const i2c_opts = ["0x40", "0x41", "0x42", "0x43", "0x44", "0x45", "0x46", "0x47"]
</script>
