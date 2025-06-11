<script lang="ts">
	import EntityListHeader from './EntityListHeader.svelte';
	import EntityListSearchBar from './EntityListSearchBar.svelte';

	export let title: string;
	export let columns: string[] = [];
	export let items: any[] = [];
	export let searchPlaceholder: string = 'Search...';
	export let onRowClick: (id: string) => void = () => {};

	let search = '';
	let showDrawer = false;

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	function handleSearchChange(value: string) {
		search = value;
	}

	const filteredItems = () =>
		items.filter((item) =>
			Object.values(item).some((val) =>
				(val?.toString()?.toLowerCase() ?? '').includes(search.toLowerCase())
			)
		);
</script>

<section class="min-h-screen w-full space-y-6 bg-white p-8">
	<EntityListHeader {title} onAdd={openDrawer} />
	<EntityListSearchBar {search} {searchPlaceholder} onSearchChange={handleSearchChange} />

	<div class="overflow-x-auto">
		<table class="w-full table-auto border border-gray-300 text-sm">
			<thead class="bg-gray-100 text-gray-700">
				<tr>
					{#each columns as col}
						<th class="p-3 text-left font-semibold">{col}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each filteredItems() as item}
					<tr class="cursor-pointer border-t hover:bg-gray-50" onclick={() => onRowClick(item.id)}>
						{#each columns as col}
							<td class="p-3 whitespace-nowrap">{item[col.toLowerCase()]}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if showDrawer}
		<button
			type="button"
			class="fixed inset-0 z-40 cursor-pointer bg-black/30"
			onclick={closeDrawer}
			aria-label="Close drawer"
		></button>
		<div
			class="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col gap-6 overflow-y-auto bg-white p-8 shadow-2xl"
		>
			<slot name="drawerContent" {closeDrawer}></slot>
		</div>
	{/if}
</section>
