<script lang="ts">
	import InventoryHeader from '$lib/components/utilities/Header/Header.svelte';
	import InventorySearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import ProductDrawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import Select from '$lib/components/utilities/Form/Select.svelte';

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

	function handleProductChange(selectedId: string) {
		selectedProduct = selectedId;

		const selected = availableProducts.find(p => p.id === selectedId);
		if (selected) {
			selectedCategory = selected.category ?? '';
			selectedSupplier = selected.supplier ?? '';
			selectedManufacturer = selected.manufacturer ?? '';
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
		onDelete={(item) => deleteProductFromInventory(item.id, item.name)}
	/>

	{#if showDrawer}
		<ProductDrawer title="➕ Add Product to Inventory" onClose={closeDrawer}>
			<form
			method="POST"
			action="?/create"
			>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<div class="col-span-1 sm:col-span-2 lg:col-span-3">
						<Select label="Product" name="productId" options={availableProducts.map(p => ({ id: p.id, name: p.name }))} onValueChange={handleProductChange}/>
					</div>

					<TextInput label="Category" name="category" value={selectedCategory} disabled />
					<TextInput label="Supplier" name="supplier" value={selectedSupplier} disabled />
					<TextInput label="Manufacturer" name="manufacturer" value={selectedManufacturer} disabled />

					<TextInput label="Stock" name="stock" type="number" min={0} placeholder="Stock quantity" required />
					<TextInput label="Minimum Quantity" name="minQuantity" type="number" min={0} placeholder="Minimum quantity before restock" required/>
					<TextInput label="Reorder Quantity" name="reorderQuantity" type="number" min={0} placeholder="Default reorder amount" required/>

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
