const routes = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{
				path: '/instruments',
				name: 'instruments',
				component: () => import('pages/InstrumentsPage.vue'),
			},
			{
				path: '/instrument/:id',
				name: 'instrument',
				props: true,
				component: () => import('components/Instrument/View.vue'),
			},
			{
				path: '/instruments/:id/edit',
				name: 'instruments-edit',
				props: true,
				component: () => import('components/Instrument/Edit.vue'),
			},
			{ path: '', component: () => import('pages/IndexPage.vue') },
		],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
	},
]

export default routes
