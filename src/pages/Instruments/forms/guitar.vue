<template lang="pug">
.row.q-col-gutter-md
	.col-6
		.text-h6 Strings
		.row.q-col-gutter-sm
			.col-12
				q-input(
					v-model.number="config.string_count"
					type="number"
					label="Number of Strings"
					filled
					outlined,
					:max="12",
					:min="1"
				)
			.col-12
				.row.q-col-gutter-sm(v-for="string in config.string_count", :key="string.label")
					.col-1 {{ string }}
					.col-6
						q-input(v-model="config.strings[string - 1].label" label="String Name" clearable filled outlined)
					.col-5
						q-input(v-model="config.strings[string - 1].calibrate" label="Calibrate" filled outlined)

	.col-6
		.text-h6 Frets
		q-input(
			v-model.number="config.fret_count"
			type="number"
			label="Number of Frets"
			filled
			outlined,
			:max="12",
			:min="1"
		)
</template>
<script setup>
import { ref, watch } from "vue"
const props = defineProps({
	config: {
		type: Object,
		required: true,
	},
})

watch(
	() => props.config.string_count,
	(count) => {
		//  props.config.strings = []
		if (!props.config.strings) props.config.strings = []
		for (var f = 0; f < count; f++) {
			if (!props.config.strings[f])
				props.config.strings[f] = {
					label: "String " + (f + 1),
					swing_left: 60,
					swing_home: 90,
					swing_right: 110,
				}
		}
	},
)
</script>
