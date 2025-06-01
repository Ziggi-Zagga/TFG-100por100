<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import Breadcrumb from '$lib/components/utilities/Breadcrumb.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import { goto } from '$app/navigation';

	const { data } = $props();
	let rows = $state([...data.rows]);
	let showDrawer = $state(false);
	let search = $state('');

	const filteredRows = $derived(() =>
		rows.filter((row) => row.name.toLowerCase().includes(search.toLowerCase()))
	);

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	function goToRow(rowId: string) {
		goto(`/dashboard/warehouse/${data.warehouse.id}/${data.currentSection.id}/${rowId}`);
	}

	async function handleDelete(rowId: string) {
		const formData = new FormData();
		formData.append('id', rowId);
		const res = await fetch('?/delete', {
			method: 'POST',
			body: formData
		});
		if (res.ok) {
			rows = rows.filter((r) => r.id !== rowId);
		} else {
			console.error('Failed to delete row');
		}
	}
</script>

<section class="p-8 w-full min-h-screen" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
	<PageHeader title={data.currentSection.name} subtitle={`${rows.length} rows`}>
		<div class="flex items-center gap-4">
			<Breadcrumb segments={[
				{ name: 'warehouse', href: '/dashboard/warehouse' },
				{ name: data.warehouse.name, href: `/dashboard/warehouse/${data.warehouse.id}` },
				{ name: data.currentSection.name }
			]} />
		</div>
	</PageHeader>

	<div class="mb-1 flex flex-col items-center gap-4 md:flex-row">
		<div class="w-full md:flex-1">
			<SearchBar bind:search placeholder="Search rows..." />
		</div>
		<div class="-mt-6 flex w-full justify-end md:w-auto">
			<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
				{@html '<span class="hidden md:inline">Add Row</span>'}
			</Button>
		</div>
	</div>

	<Table
		columns={["name"]}
		items={filteredRows()}
		onRowClick={(item) => goToRow(item.id)}
		onDelete={(item) => handleDelete(item.id)}
	/>

	{#if showDrawer}
		<Drawer title="➕ Create New Row" onClose={closeDrawer}>
			<form
				method="POST"
				action="?/create"
				class="fixed top-0 right-0 w-full max-w-3xl h-full bg-white shadow-2xl p-10 rounded-l-3xl overflow-y-auto z-50 border-l border-blue-100 space-y-4"
			>
				<h2 class="text-3xl font-bold text-blue-800 mb-8">➕ Create New Row</h2>

				<input
					name="name"
					required
					placeholder="Row Name"
					class="w-full p-3 border border-gray-300 rounded-xl"
				/>

				<div class="flex justify-end gap-4 mt-6">
					<button
						type="button"
						onclick={closeDrawer}
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
