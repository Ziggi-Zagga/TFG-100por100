<script lang="ts">
	import InventoryHeader from '$lib/components/utilities/Header/Header.svelte';
	import InventorySearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import ProductDrawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import ComboBox from '$lib/components/utilities/Form/ComboBox.svelte';

	// GET ALL THE INFORMATION
	const { data } = $props();
	const inventoryItems = $state([...data.inventoryItems]);
	const availableProducts = $state([...data.availableProducts]);
	const fullStoreTree = $state([...data.fullStoreTree]);
	const totalProducts = $state(data.totalProducts);

	// FORM VARIABLES
	let showDrawer = $state(false);
	let search = $state('');
	let selectedSupplier = $state('');
	let selectedManufacturer = $state('');
	let selectedCategory = $state('');
	let selectedProduct = $state('');
	
		//STORE
	let selectedStore = $state("");
	let selectedSection = $state("");
	let selectedRow = $state("");
	let selectedGap = $state("");
	let selectedGapId = $state('');
	let selectedGapName = $state('');

	console.log('%c[Inventory] inventoryItems:', 'color: green; font-weight: bold;');
	console.table(inventoryItems);

	console.log('%c[Inventory] availableProducts:', 'color: blue; font-weight: bold;');
	console.table(availableProducts);

	console.log('%c[Inventory] fullStoreTree:', 'color: purple; font-weight: bold;');
	console.table(fullStoreTree);


	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	//FORM FILTERS
	function handleProductChange(product: any) {
		selectedProduct = product.name;
		selectedCategory = product.category ?? '';
		selectedSupplier = product.supplier ?? '';
		selectedManufacturer = product.manufacturer ?? '';
	}

	function handleStoreChange(store: any){
		selectedStore = store.name;
		selectedSection = "";
		selectedRow = "";
		selectedGap = "";
	}

	function handleSectionChange(section: any){
		selectedSection = section.name;
		selectedRow = "";
		selectedGap = "";
	}

	function handleRowChange(row: any){
		selectedRow = row.name;
		selectedGap = "";
	}

	function handleGapChange(gap: any){
		selectedGapId = gap.id;
		selectedGapName = gap.name;
	}

	//FILTERS
	const stores = $derived(() =>
	Array.from(
		new Map(fullStoreTree.map(i => [i.storeId, { id: i.storeId, name: i.storeName }])).values()
	));

	const sections = $derived(() =>
	selectedStore
		? Array.from(
			new Map(
				fullStoreTree
					.filter(i => i.storeId && i.storeName === selectedStore && i.sectionId)
					.map(i => [i.sectionId, { id: i.sectionId, name: i.sectionName }])
			).values()
		)
		: []
	);

	const rows = $derived(() =>
		selectedSection
			? Array.from(
				new Map(
					fullStoreTree
					.filter(i => i.sectionName === selectedSection && i.rowId)
					.map(i => [i.rowId, { id: i.rowId, name: i.rowName }])
			).values()
		) : []
	);

	const gaps = $derived(() =>
		selectedRow
			? Array.from(
				new Map(
					fullStoreTree
					.filter(i => i.rowName === selectedRow && i.gapId)
					.map(i => [i.gapId, { id: i.gapId, name: i.gapName }])
			).values()
		) : []
	);

	//DELETE
	async function deleteProductFromInventory(id: string, name: string) {
		const confirmed = confirm(`Do you want to delete "${name}" from the inventory?`);
		if (!confirmed) return;
		try {
			const res = await fetch('/dashboard/inventory', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
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
	<InventoryHeader title="Inventory" subtitle={`${totalProducts} Products`}>
		<InventorySearchBar bind:search placeholder="Search by name or code..." />
		<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
			{@html '<span class="hidden md:inline">Add Product</span>'}
		</Button>
	</InventoryHeader>

	<Table
		columns={[ 'code', 'name', 'category', 'quantity', 'supplier', 'location' ]}
		items={inventoryItems}
		onDelete={(item) => deleteProductFromInventory(item.id, item.name)}
	/>

	{#if showDrawer}
		<ProductDrawer title="➕ Add Product to Inventory" onClose={closeDrawer}>
			<form method="POST" action="?/create">
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<div class="col-span-1 sm:col-span-2 lg:col-span-3">
						<ComboBox label="Product" name="productId" items={availableProducts} onValueChange={handleProductChange} value={selectedProduct} />
					</div>

					<TextInput label="Category" name="category" value={selectedCategory} disabled />
					<TextInput label="Supplier" name="supplier" value={selectedSupplier} disabled />
					<TextInput label="Manufacturer" name="manufacturer" value={selectedManufacturer} disabled />

					<TextInput label="Stock" name="stock" type="number" min={0} placeholder="Stock quantity" required />
					<TextInput label="Minimum Quantity" name="minQuantity" type="number" min={0} placeholder="Minimum quantity before restock" required />
					<TextInput label="Reorder Quantity" name="reorderQuantity" type="number" min={0} placeholder="Default reorder amount" required />

					<h1>Location</h1>
					<div class="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
						<ComboBox label="Store" items={stores()} onValueChange={handleStoreChange} value={selectedStore} />
						<ComboBox label="Section" items={sections()} onValueChange={handleSectionChange} value={selectedSection} />
						<ComboBox label="Row" items={rows()} onValueChange={handleRowChange} value={selectedRow} />
						<ComboBox label="Gap" name="gapId" items={gaps()} onValueChange={handleGapChange} value={selectedGapName} required />
					</div>

					<input type="hidden" name="storeGapId" value={selectedGapId} />
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
