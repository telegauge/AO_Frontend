<template>
	<router-view />
</template>

<script setup>
import { useQuasar } from "quasar"
import { onMounted, onBeforeUnmount } from "vue"

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

let wakeLock = null

async function requestWakeLock() {
	console.log("requestWakeLock")
	if ("wakeLock" in navigator) {
		try {
			wakeLock = await navigator.wakeLock.request("screen")
		} catch (err) {
			console.error("Wake Lock request failed:", err)
		}
	}
}

function releaseWakeLock() {
	if (wakeLock) {
		wakeLock.release()
		wakeLock = null
	}
}

onMounted(() => {
	requestWakeLock()
	// Re-request on visibility change (some browsers release on tab switch)
	document.addEventListener("visibilitychange", requestWakeLock)
})

onBeforeUnmount(() => {
	releaseWakeLock()
	document.removeEventListener("visibilitychange", requestWakeLock)
})
</script>
