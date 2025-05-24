<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import Breadcrumb from '$lib/components/utilities/Breadcrumb.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import { goto } from '$app/navigation';

	const { data } = $props();
	let sections = $state([...data.sections]);
	let showDrawer = $state(false);
	let search = $state('');

	const filteredSections = $derived(() =>
		sections.filter((section) =>
			section.name.toLowerCase().includes(search.toLowerCase())
		)
	);

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	function goToSection(sectionId: string) {
	goto(`/dashboard/stores/${data.store.id}/${sectionId}`);
}

	async function handleDelete(sectionId: string) {
		const formData = new FormData();
		formData.append('id', sectionId);

		const res = await fetch('?/delete', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			sections = sections.filter((s) => s.id !== sectionId);
		} else {
			console.error('Failed to delete section');
		}
	}
</script>

<section class="min-h-screen w-full p-8" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
	<PageHeader title={data.store.name} subtitle={`${sections.length} sections`}>
		<div class="flex items-center gap-4">
			<Breadcrumb segments={[
				{ name: 'Stores', href: '/dashboard/stores' },
				{ name: data.store.name }
			]} />
		</div>
	</PageHeader>

	<div class="mb-1 flex flex-col items-center gap-4 md:flex-row">
		<div class="w-full md:flex-1">
			<SearchBar bind:search placeholder="Search sections..." />
		</div>
		<div class="-mt-6 flex w-full justify-end md:w-auto">
			<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
				{@html '<span class="hidden md:inline">Add Section</span>'}
			</Button>
		</div>
	</div>

	<Table
		columns={['name']}
		items={filteredSections()}
		onRowClick={(item) => goToSection(item.id)}
		onDelete={(item) => handleDelete(item.id)}
	/>

	{#if showDrawer}
		<Drawer title="➕ Create New Section" onClose={closeDrawer}>
			<form
				method="POST"
				action="?/create"
				class="fixed top-0 right-0 z-50 h-full w-full max-w-3xl space-y-4 overflow-y-auto rounded-l-3xl border-l border-blue-100 bg-white p-10 shadow-2xl"
			>
				<h2 class="mb-8 text-3xl font-bold text-blue-800">➕ Create New Section</h2>

				<input name="name" required placeholder="Section Name" class="w-full rounded-xl border border-gray-300 p-3" />
				<textarea name="description" placeholder="Description" class="w-full rounded-xl border border-gray-300 p-3"></textarea>

				<div class="mt-6 flex justify-end gap-4">
					<button
						type="button"
						onclick={closeDrawer}
						class="rounded-xl bg-gray-200 px-6 py-2 font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 font-semibold text-white shadow-md hover:from-blue-600 hover:to-indigo-600"
					>
						Create
					</button>
				</div>
			</form>
		</Drawer>
	{/if}
</section>
