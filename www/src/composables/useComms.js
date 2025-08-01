import { ref, computed, onBeforeMount } from "vue"

// Module-level map to persist comms per instrument IP
const commsMap = new Map()

export function useComms(instrument) {
	const ip = computed(() => instrument.value && instrument.value.ip)
	if (!ip.value) {
		console.log("No IP found for instrument", instrument.value)
		return {
			ws_online: ref(false),
			rest_online: ref(false),
			sendCmd: () => {},
			sendRestCmd: () => {},
			sendWsCmd: () => {},
			connect: () => {},
			disconnect: () => {},
		}
	}

	// If comms for this IP already exists, return it
	if (commsMap.has(ip.value)) {
		return commsMap.get(ip.value)
	}

	const ws = ref(null)
	const pendingRequests = new Map()

	const ws_online = ref(false)
	const rest_online = ref(false)

	console.log("useComms", instrument.value.name)

	onBeforeMount(() => {
		connect()
	})

	const connect = () => {
		console.log("connect", instrument.value.name)
		connectWs()
		sendRestCmd("GET", "info").then((info) => {
			if (info) {
				rest_online.value = true
			}
		})
	}

	const disconnect = () => {
		if (ws.value) {
			ws.value.close()
		}
		// Remove from commsMap so a new connection can be made if needed
		if (ip.value && commsMap.has(ip.value)) {
			commsMap.delete(ip.value)
		}
	}

	const connectWs = () => {
		if (!instrument.value || !instrument.value.ip) return
		if (instrument.value.ip.length < 10) return
		console.log("new websocket", instrument.value.name)
		ws.value = new WebSocket(`ws://${instrument.value.ip}:81`)

		ws.value.onopen = () => {
			console.log("[WS] Connected")
			ws_online.value = true
		}

		ws.value.onclose = () => {
			console.log("[WS] Disconnected")
			ws_online.value = false
			setTimeout(connect, 1000) // Reconnect attempt
		}

		ws.value.onerror = (error) => {
			console.error("[WS] Error:", error)
			ws_online.value = false
		}

		ws.value.onmessage = (event) => {
			console.log("[WS] Message:", event.data)
			try {
				const response = JSON.parse(event.data)
				if (response.cmd && pendingRequests.has(response.cmd)) {
					const resolve = pendingRequests.get(response.cmd)
					pendingRequests.delete(response.cmd)
					resolve(response)
				}
			} catch (e) {
				console.error("[WS] Error parsing message:", e)
			}
		}
	}

	const sendWsCmd = (method, cmd, args) => {
		const now = Date.now()
		if (!instrument.value) return

		// if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
		// 	console.error("[WS] Not connected")
		// 	ws_online.value = false
		// 	return sendRestCmd(method, cmd, args)
		// }

		return new Promise((resolve) => {
			const message = {
				cmd,
				...args,
			}

			// console.log("[WS] Sending:", instrument.value.ip, JSON.stringify(message))
			pendingRequests.set(cmd, resolve)
			ws.value.send(JSON.stringify(message))
			// console.log("[WS] sendCmd", method, cmd, Date.now() - now)
		})
	}

	const sendRestCmd = (method, cmd, args) => {
		if (!instrument.value || !instrument.value.ip) {
			return Promise.resolve()
		}
		if (instrument.value.ip.length < 10) {
			return Promise.resolve()
		}

		const arg =
			typeof args === "object"
				? Object.entries(args)
						.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
						.join("&")
				: args

		let url = `http://${instrument.value.ip}/api/${cmd}`
		if (args) {
			url += `?${arg}`
		}
		return fetch(url, { method })
			.then((response) => {
				if (!response.ok) throw new Error("Network response was not ok")
				rest_online.value = true
				return response.text()
			})
			.then((data) => {
				console.log("[REST] Command sent:", cmd, "Response:", data)
				try {
					const json = JSON.parse(data)
					return json
				} catch (e) {
					return data
				}
			})
			.catch((error) => {
				rest_online.value = false
				console.error("[REST] Error sending command:", error)
			})
	}

	const sendCmd = (method, cmd, args) => {
		if (ws_online.value) {
			return sendWsCmd(method, cmd, args)
		} else if (rest_online.value) {
			return sendRestCmd(method, cmd, args)
		}
		return Promise.resolve()
	}

	const commsObj = {
		ws_online,
		rest_online,
		sendCmd,
		sendRestCmd,
		sendWsCmd,
		connect,
		disconnect,
	}

	// Store in map for persistence
	commsMap.set(ip.value, commsObj)

	console.log("commsObj", commsObj)
	return commsObj
}
