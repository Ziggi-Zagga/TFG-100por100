<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import ProductDrawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import ComboBox from '$lib/components/utilities/Form/ComboBox.svelte';
	import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
	import { goto } from '$app/navigation';
	import type { warehouse, Section, Row, Gap } from '$lib/types/warehouse.types';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();
	let inventoryItems = $state([...data.inventoryItems]);
	let availableProducts = $state([...data.availableProducts]);
	let fullwarehouseTree = $state([...data.fullwarehouseTree]);
	let totalProducts = $state(data.totalProducts);

	let showDrawer = $state(false);
	let search = $state('');
	let selectedSupplier = $state('');
	let selectedManufacturer = $state('');
	let selectedCategory = $state('');
	let selectedProduct = $state('');
	let selectedProductId = $state('');

	let selectedwarehouse = $state<warehouse | null>(null);
	let selectedSection = $state<Section | null>(null);
	let selectedRow = $state<Row | null>(null);
	let selectedGap = $state<Gap | null>(null);

	let showConfirm = $state(false);
	let inventoryIdToDelete = $state<string | null>(null);

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const id = urlParams.get('id');
		if (id) {
			const inventory = inventoryItems.find((inventory) => inventory.id === id);
			if (inventory) {
				search = inventory.code;
				urlParams.delete('id');
				const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
				window.history.replaceState({}, '', newUrl);
			}
		}
	});

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	const filteredInventory = $derived(() =>
		inventoryItems.filter(
			(p) =>
				p.name.toLowerCase().includes(search.toLowerCase()) ||
				(p.code ?? '').toLowerCase().includes(search.toLowerCase())
		)
	);

	function goToInventoryDeatils(item: any, queryParams: string) {
		goto(`./inventory/${item.id}${queryParams}`);
	}

	function handleProductChange(product: any) {
		selectedProduct = product.name;
		selectedProductId = product.id;
		selectedCategory = product.categoryName ?? '';
		selectedSupplier = product.supplierName ?? '';
		selectedManufacturer = product.manufacturerName ?? '';
	}

	function handlewarehouseChange(warehouse: warehouse) {
		selectedwarehouse = warehouse;
		selectedSection = null;
		selectedRow = null;
		selectedGap = null;
	}

	function handleSectionChange(section: Section) {
		selectedSection = section;
		selectedRow = null;
		selectedGap = null;
	}

	function handleRowChange(row: Row) {
		selectedRow = row;
		selectedGap = null;
	}

	function handleGapChange(gap: Gap) {
		selectedGap = gap;
	}

	const warehouses = $derived(() =>
		Array.from(
			new Map(
				fullwarehouseTree.map((i) => [i.warehouseId, { id: i.warehouseId, name: i.warehouseName }])
			).values()
		)
	);

	const sections = $derived(() =>
		selectedwarehouse
			? Array.from(
					new Map(
						fullwarehouseTree
							.filter((i) => i.warehouseId === selectedwarehouse?.id && i.sectionId)
							.map((i) => [i.sectionId, { id: i.sectionId, name: i.sectionName }])
					).values()
				)
			: []
	);

	const rows = $derived(() =>
		selectedSection
			? Array.from(
					new Map(
						fullwarehouseTree
							.filter((i) => i.sectionId === selectedSection?.id && i.rowId)
							.map((i) => [i.rowId, { id: i.rowId, name: i.rowName }])
					).values()
				)
			: []
	);

	const gaps = $derived(() =>
		selectedRow
			? Array.from(
					new Map(
						fullwarehouseTree
							.filter((i) => i.rowId === selectedRow?.id && i.gapId)
							.map((i) => [i.gapId, { id: i.gapId, name: i.gapName }])
					).values()
				)
			: []
	);

	function askDelete(item: any) {
		inventoryIdToDelete = item.id;
		showConfirm = true;
	}

	async function confirmDeletion() {
		if (!inventoryIdToDelete) return;

		const formData = new FormData();
		formData.append('id', inventoryIdToDelete);

		try {
			const res = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			if (res.ok) {
				inventoryItems = inventoryItems.filter((item) => item.id !== inventoryIdToDelete);
				totalProducts = inventoryItems.length;
				inventoryIdToDelete = null;
				showConfirm = false;
			} else {
				alert('Failed to delete product.');
			}
		} catch (error) {
			console.error('Error deleting inventory item:', error);
			alert('Error deleting product.');
		}
	}

	function cancelDeletion() {
		inventoryIdToDelete = null;
		showConfirm = false;
	}
</script>

<section
	class="min-h-screen w-full"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<PageHeader title="Inventory Management" subtitle={`${totalProducts} Products`}>
		<div class="flex w-full flex-col items-center gap-4 md:flex-row">
			<div class="w-60 md:flex-[3] lg:flex-[4]">
				<SearchBar bind:search placeholder="Search by name or code..." extraClasses="w-full" />
			</div>
			<div class="flex w-full justify-end md:w-auto">
				<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
					<span class="hidden md:inline">Add Inventory</span>
				</Button>
			</div>
		</div>
	</PageHeader>

	<div class="p-4">
		<Table
			columns={['code', 'name', 'category', 'quantity', 'supplier', 'location']}
			items={filteredInventory()}
			onRowClick={(item) => goToInventoryDeatils(item, '')}
			onEdit={(item) => goToInventoryDeatils(item, '?edit=true')}
			onDelete={(item) => askDelete(item)}
		/>
	</div>
	<ProductDrawer title="Add Product to Inventory" onClose={closeDrawer} show={showDrawer}>
		<form method="POST" action="?/create">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<div class="col-span-1 sm:col-span-2 lg:col-span-3">
					<ComboBox
						label="Product"
						searchQuery={selectedProduct}
						items={availableProducts}
						onSelect={(item) => handleProductChange(item || item?.id)}
						value={selectedProduct}
						name="productName"
						displayField="name"
					/>
				</div>

				<TextInput label="Category" name="category" value={selectedCategory} disabled />
				<TextInput label="Supplier" name="supplier" value={selectedSupplier} disabled />
				<TextInput label="Manufacturer" name="manufacturer" value={selectedManufacturer} disabled />

				<TextInput
					label="Stock"
					name="stock"
					type="number"
					min={0}
					placeholder="Stock quantity"
					required
				/>
				<TextInput
					label="Minimum Quantity"
					name="minQuantity"
					type="number"
					min={0}
					placeholder="Minimum quantity before restock"
					required
				/>
				<TextInput
					label="Reorder Quantity"
					name="reorderQuantity"
					type="number"
					min={0}
					placeholder="Default reorder amount"
					required
				/>
			</div>

			<h1>Location</h1>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<ComboBox
					label="warehouse"
					name="warehouseId"
					items={warehouses()}
					onSelect={handlewarehouseChange}
					value={selectedwarehouse?.name || ''}
					searchQuery={selectedwarehouse?.name || ''}
					displayField="name"
				/>
				<ComboBox
					label="Section"
					name="sectionId"
					items={sections()}
					onSelect={handleSectionChange}
					value={selectedSection?.name || ''}
					searchQuery={selectedSection?.name || ''}
					displayField="name"
				/>
				<ComboBox
					label="Row"
					name="rowId"
					items={rows()}
					onSelect={handleRowChange}
					value={selectedRow?.name || ''}
					searchQuery={selectedRow?.name || ''}
					displayField="name"
				/>
				<ComboBox
					label="Gap"
					name="gapId"
					items={gaps()}
					onSelect={handleGapChange}
					value={selectedGap?.name || ''}
					searchQuery={selectedGap?.name || ''}
					displayField="name"
					required
				/>
			</div>

			<input type="hidden" name="productId" value={selectedProductId} />
			<input type="hidden" name="warehouseGapId" value={selectedGap?.id || ''} />

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

	<ConfirmDialog
		show={showConfirm}
		message={`Are you sure you want to delete this item?`}
		onConfirm={confirmDeletion}
		onCancel={cancelDeletion}
	/>
</section>
