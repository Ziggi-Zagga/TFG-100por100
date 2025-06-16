<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { currency } from '$lib/components/helpers/currencies';
	import ShowText from '$lib/components/utilities/ShowText/ShowText.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import Header from '$lib/components/utilities/Header/Header.svelte';
	import Select from '$lib/components/utilities/Form/Select.svelte';
	import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/utilities/Modal/Modal.svelte';
	import Icon from '$lib/components/utilities/Icons/Icon.svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();
	let id: string;
	let product = $state(data.product);
	let isEditing = $state(false);

	let suppliers = $state([...data.suppliers]);
	let manufacturers = $state([...data.manufacturers]);
	let categories = $state([...data.categories]);
	let inventory = $state([...data.inventory]);
	let orderItems = $state([...data.orderItems]);

	let showConfirm = $state(false);

	onMount(() => {
		id = page.params.id;
		const urlParams = new URLSearchParams(page.url.search);
		if (urlParams.get('edit') === 'true') {
			isEditing = true;
		}
	});

	function toggleEdit() {
		isEditing = !isEditing;
	}

	function goToDetails(item: any) {
		goto(`/dashboard/inventory/${item.id}`);
	}

	async function confirmDeletion() {
		const formData = new FormData();
		formData.append('id', product.id);

		const res = await fetch('/dashboard/products?/delete', {
			method: 'POST',
			body: formData
		});

		showConfirm = false;

		if (res.ok) {
			goto('/dashboard/products');
		} else {
			console.error('Failed to delete warehouse');
		}
	}

	function handleDelete() {
		showConfirm = true;
	}

	function cancelDeletion() {
		showConfirm = false;
	}

	function goBack() {
		history.back();
	}

	function closeDrawer() {
		isEditing = false;
	}

	let selectedOption = $state<'orders' | 'inventory'>('orders');

	const historyOptions = [
		{ id: 'orders', name: 'Order History' },
		{ id: 'inventory', name: 'Inventory History' }
	];
</script>

{#if product}
	<section
		class="flex min-h-screen justify-center px-4 pt-0 pb-4 md:px-8 md:pb-8"
		style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 200 }}
	>
		<div
			class="w-full max-w-7xl space-y-12 rounded-2xl bg-white px-6 py-6 shadow-xl md:px-10 md:py-8"
		>
			<div class="flex items-center justify-between">
				<button onclick={goBack} class="text-2xl text-indigo-600 hover:text-indigo-800"> ← </button>
				<div class="flex gap-4">
					<button
						onclick={toggleEdit}
						class="text-2xl transition hover:scale-110 hover:text-blue-600"
					>
						<Icon icon="edit" size={30} />
					</button>
					<button
						onclick={handleDelete}
						class="text-2xl transition hover:scale-110 hover:text-red-600"
					>
						<Icon icon="delete" size={30} />
					</button>
				</div>
			</div>

			<div class="flex flex-col gap-12 md:flex-row">
				<div class="flex w-full justify-center md:w-1/3">
					<div
						class="overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 p-2 shadow-md"
					>
						<img
							src="https://via.placeholder.com/300x300.png?text=Product+Image"
							alt="Product"
							class="w-full rounded-lg object-cover"
						/>
					</div>
				</div>

				<div class="flex w-full flex-col gap-6 md:w-2/3">
					{#if isEditing}
						<Modal title="Edit Product" onClose={closeDrawer}>
							<form method="POST" action="?/update" class="mt-4 space-y-6 p-6">
								<input type="hidden" name="id" value={product.id} />
								<TextInput
									label="Product Name"
									name="name"
									placeholder="Enter product name"
									value={product.name}
									required
								/>
								<TextInput
									label="Product Code"
									name="code"
									placeholder="Enter product code"
									value={product.code}
									required
								/>
								<TextInput
									label="Description"
									name="description"
									placeholder="Enter product description"
									value={product.description ?? undefined}
								/>
								<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
									<TextInput
										label="Price"
										name="price"
										type="number"
										min={0}
										placeholder="Enter product price"
										value={product.price ?? undefined}
										required
									/>
									<TextInput
										label="Unit"
										name="unit"
										placeholder="e.g. piece, kg, box"
										value={product.unit ?? undefined}
									/>
									<TextInput
										label="Dimensions"
										name="dimensions"
										placeholder="e.g. 10x20x5 cm"
										value={product.dimensions ?? undefined}
									/>
									<TextInput
										label="Material"
										name="material"
										placeholder="e.g. plastic, metal"
										value={product.material ?? undefined}
									/>
									<TextInput
										label="Specifications"
										name="specifications"
										placeholder="Enter technical specs"
										value={product.specifications ?? undefined}
									/>
									<Select
										label="Supplier"
										name="supplierId"
										options={suppliers}
										value={product.supplierId ?? undefined}
									/>
									<Select
										label="Manufacturer"
										name="manufacturerId"
										options={manufacturers}
										value={product.manufacturerId ?? undefined}
									/>
									<Select
										label="Category"
										name="categoryId"
										options={categories}
										value={product.categoryId ?? undefined}
									/>
								</div>

								<div class="mt-6 flex justify-end gap-4">
									<Button
										onclick={closeDrawer}
										variant="secondary"
										size="md"
										extraStyles="w-full md:w-auto"
									>
										{@html '<span class="hidden md:inline">Cancel</span>'}
									</Button>
									<Button type="submit" variant="primary" size="md" extraStyles="w-full md:w-auto">
										{@html '<span class="hidden md:inline">Save</span>'}
									</Button>
								</div>
							</form>
						</Modal>
					{/if}
					<h2 class="text-4xl font-bold text-gray-800">{product.name}</h2>
					<p class="mt-1 text-2xl text-indigo-600">
						{product.price ? `${product.price.toFixed(2)} ${currency}` : 'N/A'}
					</p>
					<ShowText label="Description" value={product.description} />
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<ShowText label="Unit" value={product.unit} />
						<ShowText label="Dimensions" value={product.dimensions} />
						<ShowText label="Material" value={product.material} />
						<ShowText label="Specifications" value={product.specifications} />
						<ShowText label="Active" value={product.active ? 'Yes' : 'No'} />
						<ShowText label="SKU (Code)" value={product.code} uppercase={true} />
						<ShowText label="Manufacturer" value={data.manufacturerName[0].name} />
						<ShowText label="Supplier" value={data.supplierName[0].name} />
						<ShowText label="Category" value={data.categoryName[0].name} />
					</div>
				</div>
			</div>

			<Header
				title={selectedOption === 'orders' ? 'Order History' : 'Inventory'}
				subtitle={product.name}
			>
				<div class="w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
					<Select
						label="Select History Type"
						name="historyType"
						options={historyOptions}
						value={selectedOption}
						onValueChange={(val) => (selectedOption = val as 'orders' | 'inventory')}
					/>
				</div>
			</Header>

			{#if selectedOption === 'orders'}
				<Table
					columns={['orderNumber', 'quantity', 'discount', 'price', 'orderDate']}
					items={orderItems}
					ifEdit={(item) => false}
					ifDelete={(item) => false}
				/>
			{:else if selectedOption === 'inventory'}
				<Table
					columns={['warehouse', 'Section', 'Row', 'Gap', 'Stock', 'Date']}
					items={inventory}
					onRowClick={(item) => goToDetails(item)}
					ifEdit={(item) => false}
					ifDelete={(item) => false}
				/>
			{/if}
		</div>
	</section>

	<ConfirmDialog
		show={showConfirm}
		message={`Are you sure you want to eliminate product: ${product.name}?`}
		onConfirm={confirmDeletion}
		onCancel={cancelDeletion}
	/>
{:else}
	<p class="mt-8 text-center text-red-500">Error: Product not found.</p>
{/if}
