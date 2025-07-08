<template>
	<router-view />
</template>

<script setup>
import { useQuasar } from "quasar"
const musicalIcons = {
	Guitar: "mdi-guitar-acoustic",
	Keyboard: "mdi-pia",
	Drum: "mdi-saw-blade",
	Bow: "mdi-violin",
	Wind: "mdi-trumpet",
	Brass: "mdi-trumpet",
}

const $q = useQuasar()

$q.iconMapFn = (iconName) => {
	const icon = musicalIcons[iconName]
	if (icon !== undefined) {
		return { icon }
	}
}

const dark_mode = useStorage("dark_mode", false)

watch(
	dark_mode,
	(newVal) => {
		$q.dark.set(newVal)
	},
	{ immediate: true },
)
</script>
