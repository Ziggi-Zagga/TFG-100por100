<script lang="ts">
	import InventoryHeader from '$lib/components/utilities/Header/Header.svelte';
	import InventorySearchBar from '$lib/components/inventory/SearchBar.svelte';
	import ProductDrawer from '$lib/components/inventory/DrawerAddProduct.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';

	export let data;

	let showDrawer = false;
	const { items, safeAvailableProducts, locations, totalProducts } = data;

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	async function deleteProductFromInventory(id: string, name: string) {
		const confirmed = confirm(`Do you want to delete "${name}" from the inventory?`);
		if (!confirmed) return;

		try {
			const res = await fetch('/dashboard/inventory', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }),
			});

			const result = await res.json();
			if (!res.ok || !result.success) throw new Error('Deletion failed');
			location.reload();
		} catch (error) {
			alert('Error deleting product from inventory.');
			console.error(error);
		}
	}
</script>

<section class="p-8 bg-white w-full min-h-screen" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
	<InventoryHeader title="Inventory" subtitle="{totalProducts} Products">
		<button class="btn">Export CSV</button>
		<button class="btn">Export PDF</button>
		<button class="btn">Import Data</button>
	</InventoryHeader>

	<InventorySearchBar {openDrawer} />

	<Table
		columns={['code', 'name', 'category', 'quantity', 'supplier', 'location']}
		items={items}
		on:delete={(e) => deleteProductFromInventory(e.detail.id, e.detail.name)}
	/>

	{#if showDrawer}
		<ProductDrawer
			{closeDrawer}
			availableProducts={safeAvailableProducts}
			locations={locations}
		/>
	{/if}
</section>
