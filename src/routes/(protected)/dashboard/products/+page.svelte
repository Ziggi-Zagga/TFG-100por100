<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import GapFilter from '$lib/components/dashboard/GapFilter.svelte';
	import Icon from '$lib/components/utilities/Icons/Icon.svelte';
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Select from '$lib/components/utilities/Form/Select.svelte';
	import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
	import type { Supplier, Manufacturer, Category, Product } from '$lib/types/products.types.js';
	import { formatCurrency } from '$lib/components/helpers/currencies';
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';

	// Get props
	const { data } = $props<{ data: PageData }>();

	// State
	let productsCopy = $state<Product[]>(data.products || []);
	let suppliers = $state<Supplier[]>(data.suppliers || []);
	let manufacturers = $state<Manufacturer[]>(data.manufacturers || []);
	let categories = $state<Category[]>(data.categories || []);

	// Check if filtering by gap
	let isFilteredByGap = $state(!!data.gapId);

	// Function to clear gap filter
	function clearGapFilter() {
		// Redirigir a la página de productos sin parámetros
		window.location.href = '/dashboard/products';
	}

	// UI state
	let showDrawer = $state(false);
	let search = $state('');

	// Total products count
	const totalProducts = $derived(productsCopy.length);

	let selectedSupplier = $state<Supplier | null>(null);
	let selectedManufacturer = $state<Manufacturer | null>(null);
	let selectedCategory = $state<Category | null>(null);

	// Confirm dialog state
	let showConfirm = $state(false);
	let productToDelete = $state<string | null>(null);
	let productIdToDelete = $state<string | null>(null);

	function goToProductDetails(item: any, queryParams: string) {
		goto(`./products/${item.id}${queryParams}`);
	}

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	const filteredProducts = $derived(() =>
		productsCopy.filter(
			(p) =>
				p.name.toLowerCase().includes(search.toLowerCase()) ||
				(p.code ?? '').toLowerCase().includes(search.toLowerCase())
		)
	);

	function askDelete(productId: string, productName: string) {
		productToDelete = productName;
		productIdToDelete = productId;
		showConfirm = true;
	}

	async function confirmDeletion() {
		if (!productIdToDelete) return;
		const formData = new FormData();
		formData.append('id', productIdToDelete);

		const res = await fetch('/dashboard/products?/delete', {
			method: 'POST',
			body: formData
		});

		showConfirm = false;

		if (res.ok) {
			productsCopy = productsCopy.filter((p) => p.id !== productIdToDelete);
			productIdToDelete = null;
		} else {
			console.error('Failed to delete warehouse');
		}
	}

	function cancelDeletion() {
		showConfirm = false;
		productIdToDelete = null;
	}
</script>

<section
	class="min-h-screen w-full bg-white"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<PageHeader title="Products Management" subtitle={`Total: ${totalProducts} productos`}>
		<div class="flex w-full flex-col items-center gap-4 md:flex-row">
			{#if isFilteredByGap}
				<GapFilter gapName={data.gapName} onClose={clearGapFilter} />
			{/if}
			<div class="min-w-0 flex-1">
				<SearchBar bind:search placeholder="Buscar por nombre o código..." extraClasses="w-full" />
			</div>
			<div class="flex w-full justify-end md:w-auto">
				<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
					<span class="hidden md:inline">Add Product</span>
				</Button>
			</div>
		</div>
	</PageHeader>
	<div class="p-4">
		
	<Table
		columns={['code', 'name', 'price', 'unit', 'material']}
		items={productsCopy
			.filter((p) => {
				const searchTerm = search.toLowerCase();
				return (
					p.name.toLowerCase().includes(searchTerm) ||
					(p.code ?? '').toLowerCase().includes(searchTerm)
				);
			})
			.map((p) => ({
				...p,
				price: formatCurrency(p.price || 0)
			}))}
		onRowClick={(item) => goToProductDetails(item, '')}
		onEdit={(item) => goToProductDetails(item, '?edit=true')}
		onDelete={(item) => askDelete(item.id, item.name)}
	/>
		</div>
	<Drawer title="Create New Product" onClose={closeDrawer} show={showDrawer}>
		<form method="POST" action="?/create">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<TextInput label="Product Name" name="name" placeholder="Enter product name" required />
				<TextInput label="Product Code" name="code" placeholder="Enter product code" required />
				<TextInput label="Description" name="description" placeholder="Enter product description" />
				<TextInput
					label="Price"
					name="price"
					type="number"
					min={0}
					placeholder="Enter product price"
					step={0.01}
					required
				/>
				<TextInput label="Unit" name="unit" placeholder="e.g. piece, kg, box" />
				<TextInput label="Dimensions" name="dimensions" placeholder="e.g. 10x20x5 cm" />
				<TextInput label="Material" name="material" placeholder="e.g. plastic, metal" />
				<TextInput
					label="Specifications"
					name="specifications"
					placeholder="Enter technical specs"
				/>
				<Select
					label="Supplier"
					name="supplierId"
					options={suppliers}
					placeholder={selectedSupplier?.name ?? undefined}
					required
				/>
				<Select
					label="Manufacturer"
					name="manufacturerId"
					options={manufacturers}
					placeholder={selectedManufacturer?.name ?? undefined}
					required
				/>
				<Select
					label="Category"
					name="categoryId"
					options={categories}
					placeholder={selectedCategory?.name ?? undefined}
					required
				/>
			</div>

			<div class="mt-6 flex justify-end gap-4">
				<Button onclick={closeDrawer} variant="secondary" size="md" extraStyles="w-full md:w-auto">
					{@html '<span class="hidden md:inline">Cancel</span>'}
				</Button>
				<Button type="submit" variant="primary" size="md" extraStyles="w-full md:w-auto">
					{@html '<span class="hidden md:inline">+ Add Product</span>'}
				</Button>
			</div>
		</form>
	</Drawer>

	<ConfirmDialog
		show={showConfirm}
		message={`Are you sure you want to delete product: ${productToDelete}?`}
		onConfirm={confirmDeletion}
		onCancel={cancelDeletion}
	/>
</section>
