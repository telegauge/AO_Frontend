<template lang="pug">
.overflow-hidden
	q-btn.float-right(color="primary" flat icon="edit" @click="show_dialog = !show_dialog")
	pre(style="user-select: text") {{ raw }}
	q-dialog.background1(
		v-model="show_dialog"
		full-height
		full-width
		transition-hide="slide-right"
		transition-show="slide-left"
	)
		q-card.column
			q-card-section.col-shrink
				.section Edit the raw record
			q-card-section#json.col(:class="{ bad }")
				q-input.col.q-pa-sm(v-model="edit" type="textarea" color="teal" filled @blur="Format")
			q-card-section.col-shrink(aligxn="right")
				q-btn(label="cancel" color="primary" flat v-close-popup)
				q-btn(label="revert" color="primary" flat @click="Revert", :disabled="edit == original")
				q-btn.float-right(
					label="save"
					color="secondary"
					v-close-popup
					@click="emit('save', JSON.parse(edit))",
					:disabled="bad"
				)
</template>
<script setup>
import { ref, computed, watch } from "vue"

const props = defineProps(["raw"])
const emit = defineEmits(["save"])

const raw = computed(() => props.raw)
const edit = ref(false)
const original = ref(false)

const show_dialog = ref(false)

watch(show_dialog, (show) => {
	if (show) {
		edit.value = JSON.stringify(raw.value, null, "\t")
		original.value = edit.value
	}
})

function Revert() {
	edit.value = original.value
}

const bad = computed(() => {
	try {
		JSON.parse(edit.value)
		return false
	} catch (e) {
		return true
	}
})
</script>
<style lang="scss">
#json {
	font-family: "Courier New", Courier, monospace;
	textarea {
		height: calc(100vh - 250px);
	}
}
.bad {
	background-color: rgba(255, 0, 0, 0.3);
}
</style>
