<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	export let data;

	let showDrawer = false;
	let search = '';
	let stores = [...data.stores];

	$: filteredStores = stores.filter((store) =>
		store.name.toLowerCase().includes(search.toLowerCase()) ||
		(store.location ?? '').toLowerCase().includes(search.toLowerCase())
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
</script>

<section class="p-8 w-full min-h-screen" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
	<PageHeader title="Stores Management" countLabel="stores" totalCount={stores.length} />

	<SearchBar
		bind:search
		placeholder="Search by name or location..."
		buttonText="+ Add Store"
		{openDrawer}
	/>

	<Table
		columns={['name', 'location']}
		items={filteredStores}
		on:rowClick={(e) => goToStoreDetails(e.detail.id)}
	/>

	{#if showDrawer}
		<Drawer title="➕ Create New Store" onClose={closeDrawer}>
			<form
				method="POST"
				action="/dashboard/stores/create"
				use:enhance={{
					result: (res, form) => {
						if (res.type === 'success') {
							const fd = new FormData(form);
							stores = [
								...stores,
								{
									id: res.data?.id ?? crypto.randomUUID(),
									name: fd.get('name')?.toString() ?? '',
									location: fd.get('location')?.toString() ?? '',
									description: fd.get('description')?.toString() ?? ''
								}
							];
							closeDrawer();
						}
					}
				}}
				class="fixed top-0 right-0 w-full max-w-3xl h-full bg-white shadow-2xl p-10 rounded-l-3xl overflow-y-auto z-50 border-l border-blue-100 space-y-4"
			>
				<h2 class="text-3xl font-bold text-blue-800 mb-8">➕ Create New Store</h2>

				<input
					name="name"
					required
					placeholder="Store Name"
					class="w-full p-3 border border-gray-300 rounded-xl"
				/>

				<input
					name="location"
					required
					placeholder="Location"
					class="w-full p-3 border border-gray-300 rounded-xl"
				/>

				<textarea
					name="description"
					placeholder="Description"
					class="w-full p-3 border border-gray-300 rounded-xl"
				></textarea>

				<div class="flex justify-end gap-4 mt-6">
					<button
						type="button"
						on:click={closeDrawer}
						class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-xl shadow-sm"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md"
					>
						Create
					</button>
				</div>
			</form>
		</Drawer>
	{/if}
</section>
