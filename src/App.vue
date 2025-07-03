<template>
	<router-view />
</template>

<script setup>
import { useQuasar } from "quasar"
const musicalIcons = {
	guitar: "mdi-guitar-acoustic",
	keyboard: "mdi-pia",
	drum: "mdi-saw-blade",
	bow: "mdi-violin",
	wind: "mdi-trumpet",
	brass: "mdi-trumpet",
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
