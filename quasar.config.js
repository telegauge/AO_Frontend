// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from "#q-app/wrappers"
import path from "path"

import AutoImport from "unplugin-auto-import/vite"

export default defineConfig((/* ctx */) => {
	return {
		// https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
		// preFetch: true,

		// app boot file (/src/boot)
		// --> boot files are part of "main.js"
		// https://v2.quasar.dev/quasar-cli-vite/boot-files
		boot: [],

		// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
		css: ["app.scss"],

		// https://github.com/quasarframework/quasar/tree/dev/extras
		extras: [
			// 'ionicons-v4',
			"mdi-v7",
			// 'fontawesome-v6',
			// 'eva-icons',
			// 'themify',
			// 'line-awesome',
			// 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

			"roboto-font", // optional, you are not bound to it
			"material-icons", // optional, you are not bound to it
		],

		// Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
		build: {
			target: {
				browser: ["es2022", "firefox115", "chrome115", "safari14"],
				node: "node20",
			},

			vueRouterMode: "hash", // available values: 'hash', 'history'
			// vueRouterBase,
			// vueDevtools,
			// vueOptionsAPI: false,

			// rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

			// publicPath: '/',
			// analyze: true,
			// env: {},
			// rawDefine: {}
			// ignorePublicFolder: true,
			// minify: false,
			// polyfillModulePreload: true,
			// distDir

			// extendViteConf (viteConf) {},
			// viteVuePluginOptions: {},

			vitePlugins: [
				["vite-plugin-checker", { server: false }],
				AutoImport({
					imports: ["vue", "vue-router", "pinia"],
				}),
			],

			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
		devServer: {
			// https: true,
			open: true, // opens browser window automatically
			port: 9700,
		},

		// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
		framework: {
			config: {},

			// iconSet: 'material-icons', // Quasar icon set
			// lang: 'en-US', // Quasar language pack

			// For special cases outside of where the auto-import strategy can have an impact
			// (like functional components as one of the examples),
			// you can manually specify Quasar components/directives to be available everywhere:
			//
			// components: [],
			// directives: [],

			// Quasar plugins
			plugins: ["Notify"],

			iconMapFn(iconName) {
				const musicalIcons = {
					guitar: "M16 2h2v8h-2zM15 8h4v2h-4zM12 21c-3.87 0-7-2.24-7-5s3.13-5 7-5 7 2.24 7 5-3.13 5-7 5zm0-8c-3.31 0-6 1.79-6 4s2.69 4 6 4 6-1.79 6-4-2.69-4-6-4zm0 2a2 2 0 100 4 2 2 0 000-4z",
					ukulele:
						"M17 3h1.5v6H17zM16.5 8h3v1.5h-3zM12 20c-2.76 0-5-1.34-5-3s2.24-3 5-3 5 1.34 5 3-2.24 3-5 3zm0-4a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z",
					piano: "M4 8h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm2 2v6h2v-6H6zm4 0v6h2v-6h-2zm4 0v6h2v-6h-2zm4 0v6h2v-6h-2z",
					drum: "M12 8c4.42 0 8 1.34 8 3s-3.58 3-8 3-8-1.34-8-3 3.58-3 8-3zm-8 3v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5c0 1.66-3.58 3-8 3s-8-1.34-8-3z",
					violin: "M16 3h2v6h-2zM10 18c-2.76 0-5-0.9-5-2s2.24-2 5-2 5 0.9 5 2-2.24 2-5 2zm-1-6h2v8h-2z",
				}
				return musicalIcons[iconName] || ""
			},
		},

		// animations: 'all', // --- includes all animations
		// https://v2.quasar.dev/options/animations
		animations: [],

		// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#sourcefiles
		// sourceFiles: {
		//   rootComponent: 'src/App.vue',
		//   router: 'src/router/index',
		//   store: 'src/store/index',
		//   pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
		//   pwaServiceWorker: 'src-pwa/custom-service-worker',
		//   pwaManifestFile: 'src-pwa/manifest.json',
		//   electronMain: 'src-electron/electron-main',
		//   electronPreload: 'src-electron/electron-preload'
		//   bexManifestFile: 'src-bex/manifest.json
		// },

		// https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
		ssr: {
			prodPort: 3000, // The default port that the production server should use
			// (gets superseded if process.env.PORT is specified at runtime)

			middlewares: [
				"render", // keep this as last one
			],

			// extendPackageJson (json) {},
			// extendSSRWebserverConf (esbuildConf) {},

			// manualStoreSerialization: true,
			// manualStoreSsrContextInjection: true,
			// manualStoreHydration: true,
			// manualPostHydrationTrigger: true,

			pwa: false,
			// pwaOfflineHtmlFilename: 'offline.html', // do NOT use index.html as name!

			// pwaExtendGenerateSWOptions (cfg) {},
			// pwaExtendInjectManifestOptions (cfg) {}
		},

		// https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
		pwa: {
			workboxMode: "GenerateSW", // 'GenerateSW' or 'InjectManifest'
			// swFilename: 'sw.js',
			// manifestFilename: 'manifest.json',
			// extendManifestJson (json) {},
			// useCredentialsForManifestTag: true,
			// injectPwaMetaTags: false,
			// extendPWACustomSWConf (esbuildConf) {},
			// extendGenerateSWOptions (cfg) {},
			// extendInjectManifestOptions (cfg) {}
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
		cordova: {
			// noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
		capacitor: {
			hideSplashscreen: true,
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
		electron: {
			// extendElectronMainConf (esbuildConf) {},
			// extendElectronPreloadConf (esbuildConf) {},

			// extendPackageJson (json) {},

			// Electron preload scripts (if any) from /src-electron, WITHOUT file extension
			preloadScripts: ["electron-preload"],

			// specify the debugging port to use for the Electron app when running in development mode
			inspectPort: 5858,

			bundler: "packager", // 'packager' or 'builder'

			packager: {
				// https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
				// OS X / Mac App Store
				// appBundleId: '',
				// appCategoryType: '',
				// osxSign: '',
				// protocol: 'myapp://path',
				// Windows only
				// win32metadata: { ... }
			},

			builder: {
				// https://www.electron.build/configuration/configuration

				appId: "aofrontend",
			},
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
		bex: {
			// extendBexScriptsConf (esbuildConf) {},
			// extendBexManifestJson (json) {},

			/**
			 * The list of extra scripts (js/ts) not in your bex manifest that you want to
			 * compile and use in your browser extension. Maybe dynamic use them?
			 *
			 * Each entry in the list should be a relative filename to /src-bex/
			 *
			 * @example [ 'my-script.ts', 'sub-folder/my-other-script.js' ]
			 */
			extraScripts: [],
		},
	}
})
