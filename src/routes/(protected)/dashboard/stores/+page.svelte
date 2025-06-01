<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';

	const { data } = $props();

	let stores = $state([...data.stores]);
	let showDrawer = $state(false);
	let search = $state('');

	const filteredStores = $derived(() =>
		stores.filter((store) =>
			store.name.toLowerCase().includes(search.toLowerCase()) ||
			(store.location ?? '').toLowerCase().includes(search.toLowerCase())
		)
	);

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	function goToStoreDetails(id: string) {
		goto(`/dashboard/stores/${id}`);
	}

	async function handleDelete(storeId: string) {
		const formData = new FormData();
		formData.append('id', storeId);

		const res = await fetch('/dashboard/stores?/delete', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			stores = stores.filter((s) => s.id !== storeId);
		} else {
			console.error('Failed to delete store');
		}
	}
</script>

<section class="min-h-screen w-full p-8" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
	<PageHeader title="Stores Management" subtitle="{stores.length} stores" />

	<div class="mb-1 flex flex-col items-center gap-4 md:flex-row">
		<div class="w-full md:flex-1">
			<SearchBar bind:search placeholder="Search by name or location..." />
		</div>
		<div class="flex w-full justify-end md:w-auto">
			<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
				{@html '<span class="hidden md:inline">Add Store</span>'}
			</Button>
		</div>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each filteredStores() as store}
			<div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
				<!-- Botones de acción -->
				<div class="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
					<button
						onclick={(e) => { e.preventDefault(); goToStoreDetails(store.id); }}
						class="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
						title="Edit"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
						</svg>
					</button>
					<button
						onclick={(e) => { e.preventDefault(); handleDelete(store.id); }}
						class="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
						title="Delete"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</button>
				</div>

				<!-- Contenido de la tarjeta -->
				<div class="flex flex-col items-center text-center">
					<!-- Ícono de la tienda -->
					<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
						</svg>
					</div>

					<!-- Nombre de la tienda -->
					<h3 class="mb-1 text-lg font-semibold text-gray-900">{store.name}</h3>

					<!-- Ubicación -->
					<div class="flex items-center text-sm text-gray-500">
						<svg xmlns="http://www.w3.org/2000/svg" class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span>{store.location || 'No location'}</span>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if showDrawer}
		<Drawer title="➕ Create New Store" onClose={closeDrawer}>
			<form method="POST" action="?/create" class="space-y-4">
				<TextInput name="name" required placeholder="Store Name" />
				<TextInput name="location" required placeholder="Location" />
				<TextInput name="description" placeholder="Description" />

				<div class="mt-6 flex justify-end gap-4">
					<button type="button" onclick={closeDrawer} class="rounded-xl bg-gray-200 px-6 py-2 font-semibold text-gray-700 shadow-sm hover:bg-gray-300">
						Cancel
					</button>
					<button type="submit" class="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 font-semibold text-white shadow-md hover:from-blue-600 hover:to-indigo-600">
						Create
					</button>
				</div>
			</form>
		</Drawer>
	{/if}
</section>
