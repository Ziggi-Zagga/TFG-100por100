<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities//SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import { enhance } from '$app/forms';

	export let data;

	let showDrawer = false;
	let search = '';
	let store = data.store;
	let sections = [...data.sections];

	$: filteredSections = sections.filter(section =>
		section.name.toLowerCase().includes(search.toLowerCase())
	);

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}
</script>

<section class="p-8 w-full min-h-screen" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
	<PageHeader title={store.name} countLabel="sections" totalCount={sections.length} />

	<SearchBar
		bind:search
		placeholder="Search sections..."
		buttonText="+ Add Section"
		{openDrawer}
	/>

	<Table
		columns={['name', 'description']}
		items={filteredSections}
	/>

	{#if showDrawer}
		<Drawer title="➕ Add Section" onClose={closeDrawer}>
			<form
				method="POST"
				action="?/create"
				use:enhance={{
					result: (res, form) => {
						if (res.type === 'success') {
							const fd = new FormData(form);
							sections = [
								...sections,
								{
									id: res.data?.id ?? crypto.randomUUID(),
									name: fd.get('name')?.toString() ?? '',
									description: fd.get('description')?.toString() ?? ''
								}
							];
							closeDrawer();
						}
					}
				}}
				class="space-y-4"
			>
				<input type="hidden" name="storeId" value={store.id} />
				<input name="name" required placeholder="Section Name" class="w-full p-3 border border-gray-300 rounded-xl" />
				<textarea name="description" placeholder="Description" class="w-full p-3 border border-gray-300 rounded-xl" />
				<div class="flex justify-end gap-4 mt-6">
					<button type="button" on:click={closeDrawer} class="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-xl shadow-sm">Cancel</button>
					<button type="submit" class="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 to-indigo-600 text-white py-2 px-6 rounded-xl shadow-md">Create</button>
				</div>
			</form>
		</Drawer>
	{/if}
</section>
