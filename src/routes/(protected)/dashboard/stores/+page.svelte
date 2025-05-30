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

	<Table
		columns={['name', 'location']}
		items={filteredStores()}
		onRowClick={(item) => goToStoreDetails(item.id)}
		onDelete={(item) => handleDelete(item.id)}
	/>

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
