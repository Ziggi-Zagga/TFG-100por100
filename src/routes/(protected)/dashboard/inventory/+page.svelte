<script lang="ts">
	import InventoryHeader from '$lib/components/utilities/Header/Header.svelte';
	import InventorySearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import ProductDrawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import TextInput from '$lib/components/utilities/TextInput/TextInput.svelte';
	import NumberInput from '$lib/components/utilities/NumberInput/NumberInput.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import InputSelect from '$lib/components/utilities/InputSelect/InputSelect.svelte';

	const { data } = $props();
	let items = $state([...data.items]);
	let availableProducts = $state([...data.safeAvailableProducts]);
	let showDrawer = $state(false);
	let search = $state('');
	let totalProducts = $state(data.items.length);
	let selectedSupplier = $state('');
	let selectedManufacturer = $state('');
	let selectedCategory = $state('');
	let selectedProduct = $state('');

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	function handleProductChange(event: Event) {
		const selectedId = (event.target as HTMLSelectElement).value;
		selectedProduct = selectedId;

		const selected = availableProducts.find(p => p.id === selectedId);
		if (selected) {
			selectedCategory = selected.name ?? '';
			selectedSupplier = selected.name ?? '';
		}
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
		<InventorySearchBar bind:search placeholder="Search by name or code..." />
		<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
			{@html '<span class="hidden md:inline">Add Product</span>'}
		</Button>  
	</InventoryHeader>
	<Table
		columns={['code', 'name', 'category', 'quantity', 'supplier', 'location']}
		items={items}
		on:delete={(e) => deleteProductFromInventory(e.detail.id, e.detail.name)}
	/>

	{#if showDrawer}
		<ProductDrawer title="➕ Add Product to Inventory" onClose={closeDrawer}>
			<form
			method="POST"
			action="?/create"
			class="fixed top-0 right-0 z-50 h-full w-full max-w-3xl space-y-4 overflow-y-auto rounded-l-3xl border-l border-blue-100 bg-white p-10 shadow-2xl"
			>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div class="col-span-1 sm:col-span-2 lg:col-span-3">
				<InputSelect label="Product" name="productId" options={availableProducts} selected={selectedProduct} onChange={handleProductChange}/>
				</div>
		
				<TextInput label="Category" name="category" value={selectedCategory} disabled />
				<TextInput label="Supplier" name="supplier" value={selectedSupplier} disabled />
				<TextInput label="Manufacturer" name="manufacturer" value={selectedManufacturer} disabled />

				<div class="col-span-1 sm:col-span-2 lg:col-span-3">
				<NumberInput label="Stock" name="stock" min={0} placeholder="Stock quantity" required />
				</div>

				<div class="col-span-1 sm:col-span-2 lg:col-span-3">
				<TextInput label="Location ID" name="storeId" placeholder="Enter location ID" required />
				</div>
			</div>
		
			<div class="mt-6 flex justify-end gap-4">
				<Button onclick={closeDrawer} variant="secondary" size="md" extraStyles="w-full md:w-auto">
				{@html '<span class="hidden md:inline">Cancel</span>'}
				</Button>
				<Button type="submit" variant="primary" size="md" extraStyles="w-full md:w-auto">
				{@html '<span class="hidden md:inline">+ Add Inventory</span>'}
				</Button>
			</div>
			</form>
		</ProductDrawer>
	{/if}
</section>
