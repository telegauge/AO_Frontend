<template>
	<router-view />
</template>

<script setup>
import { useQuasar } from 'quasar'

const musicalIcons = {
	guitar:
		'M16 2h2v8h-2zM15 8h4v2h-4zM12 21c-3.87 0-7-2.24-7-5s3.13-5 7-5 7 2.24 7 5-3.13 5-7 5zm0-8c-3.31 0-6 1.79-6 4s2.69 4 6 4 6-1.79 6-4-2.69-4-6-4zm0 2a2 2 0 100 4 2 2 0 000-4z',
	keyboard:
		'M4 8h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm2 2v6h2v-6H6zm4 0v6h2v-6h-2zm4 0v6h2v-6h-2zm4 0v6h2v-6h-2z',
	drum: 'M12 8c4.42 0 8 1.34 8 3s-3.58 3-8 3-8-1.34-8-3 3.58-3 8-3zm-8 3v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5c0 1.66-3.58 3-8 3s-8-1.34-8-3z',
	bow: 'M16 3h2v6h-2zM10 18c-2.76 0-5-0.9-5-2s2.24-2 5-2 5 0.9 5 2-2.24 2-5 2zm-1-6h2v8h-2z',
	wind: 'M12 8c4.42 0 8 1.34 8 3s-3.58 3-8 3-8-1.34-8-3 3.58-3 8-3zm-8 3v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5c0 1.66-3.58 3-8 3s-8-1.34-8-3z',
}

const $q = useQuasar()

$q.iconMapFn = (iconName) => {
	const icon = musicalIcons[iconName]
	if (icon !== undefined) {
		return { icon }
	}
}
</script>
