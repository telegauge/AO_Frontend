const routes = [
	{
		path: "/",
		component: () => import("layouts/MainLayout.vue"),
		children: [
			{ path: "/instruments", name: "instruments-home", component: () => import("pages/Instruments/Home.vue") },
			{
				path: "/instrument",
				name: "instrument",
				component: () => import("pages/Instruments/Layout.vue"),
				props: true,
				children: [
					{
						path: ":id/edit",
						name: "instrument-edit",
						props: true,
						component: () => import("pages/Instruments/Edit.vue"),
					},
					{
						path: ":id",
						name: "instrument-view",
						props: true,
						component: () => import("pages/Instruments/View.vue"),
					},
				],
			},
			{
				path: "/tracks",
				name: "tracks",
				children: [
					{
						path: ":id/edit",
						name: "tracks-edit",
						props: true,
						component: () => import("pages/Tracks/Edit.vue"),
					},
					{ path: ":id", name: "track", props: true, component: () => import("pages/Tracks/View.vue") },
					{ path: "", name: "tracks-home", component: () => import("pages/Tracks/Home.vue") },
				],
			},
			{ path: "", component: () => import("pages/IndexPage.vue") },
		],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: "/:catchAll(.*)*",
		component: () => import("pages/ErrorNotFound.vue"),
	},
]

export default routes
