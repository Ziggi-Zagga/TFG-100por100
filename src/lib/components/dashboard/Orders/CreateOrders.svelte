<script lang="ts">
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import TextArea from '$lib/components/utilities/Form/TextArea.svelte';
	import ComboBox from '$lib/components/utilities/Form/ComboBox.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import type { Product, Supplier } from '$lib/types/products.types';
	import Modal from '$lib/components/utilities/Modal/Modal.svelte';
	import { currency } from '$lib/components/helpers/currencies';

	let {
		onClose = () => {},
		onSubmit = () => {},
		suppliers = [],
		products = []
	} = $props<{
		onClose?: () => void;
		onSubmit?: (data: any) => Promise<void>;
		suppliers?: Supplier[];
		products?: Product[];
	}>();

	let isLoading = $state(false);

	let formData = $state({
		supplierId: '',
		orderDate: '',
		expectedArrival: '',
		notes: ''
	});

	let selectedProducts = $state<any[]>([]);
	let supplierSearch = $state('');
	let productSearch = $state('');

	let filteredProducts = $derived(
		formData.supplierId ? products.filter((p: Product) => p.supplierId === formData.supplierId) : []
	);

	const productColumns = ['code', 'name', 'price', 'quantity', 'discount', 'total'];

	const productColumnTypes: Record<string, any> = {
		quantity: { type: 'input', inputType: 'number', min: 1, step: 1 },
		discount: { type: 'input', inputType: 'number', min: 0, max: 100, step: 1 },
		actions: {
			type: 'actions',
			actions: [
				{
					label: 'Delete',
					onClick: (item: any) => handleDeleteProduct(item.id)
				}
			]
		}
	};

	function handleProductSelect(productId: string) {
		const product = products.find((p: any) => p.id === productId);
		if (!product) return;

		const updatedProducts = [...selectedProducts];
		const existingIndex = updatedProducts.findIndex((p) => p.id === productId);

		if (existingIndex !== -1) {
			const existingProduct = updatedProducts[existingIndex];
			const newQuantity = existingProduct.quantity + 1;
			const price = existingProduct.price || 0;
			const discount = existingProduct.discount || 0;

			updatedProducts[existingIndex] = {
				...existingProduct,
				quantity: newQuantity,
				total: price * newQuantity * (1 - discount / 100)
			};
		} else {
			const newProduct = {
				...product,
				quantity: 1,
				price: product.price || 0,
				discount: 0,
				total: product.price || 0
			};
			updatedProducts.push(newProduct);
		}

		selectedProducts = updatedProducts;
		productSearch = '';
	}

	function handleProductChange(item: any, field: string, value: any) {
		const itemIndex = selectedProducts.findIndex((p) => p.id === item.id);
		if (itemIndex === -1) return;

		const numValue = parseFloat(value);
		if (isNaN(numValue) && field !== 'discount') return;

		const updatedProducts = [...selectedProducts];
		const updatedItem = { ...updatedProducts[itemIndex] };

		const oldValue = updatedItem[field];

		updatedItem[field] = value;

		if (field === 'quantity' || field === 'price' || field === 'discount') {
			const numValue = parseFloat(value);
			updatedItem[field] = isNaN(numValue) ? 0 : numValue;
		}

		const quantity = field === 'quantity' ? updatedItem[field] : updatedItem.quantity;
		const price = field === 'price' ? updatedItem[field] : updatedItem.price;
		const discount = field === 'discount' ? updatedItem[field] : updatedItem.discount || 0;

		updatedItem.subtotal = quantity * price;

		updatedItem.discountValue = updatedItem.subtotal * (discount / 100);

		updatedItem.total = updatedItem.subtotal - updatedItem.discountValue;

		updatedItem.subtotal = parseFloat(updatedItem.subtotal.toFixed(2));
		updatedItem.discountValue = parseFloat(updatedItem.discountValue.toFixed(2));
		updatedItem.total = parseFloat(updatedItem.total.toFixed(2));

		if (
			oldValue === updatedItem[field] &&
			(!updatedProducts[itemIndex].total ||
				Math.abs(updatedProducts[itemIndex].total - (updatedItem.total || 0)) < 0.01)
		) {
			return;
		}

		updatedProducts[itemIndex] = updatedItem;
		selectedProducts = [...updatedProducts];
	}

	function handleDeleteProduct(productId: string) {
		selectedProducts = selectedProducts.filter((p) => p.id !== productId);
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (isLoading) return;

		if (!formData.supplierId) {
			alert('Please select a supplier');
			return;
		}

		if (selectedProducts.length === 0) {
			alert('Please add at least one product');
			return;
		}

		isLoading = true;

		try {
			const orderData = {
				...formData,
				items: selectedProducts.map((p) => ({
					productId: p.id,
					quantity: p.quantity,
					price: p.price,
					discount: p.discount || 0
				}))
			};

			onClose();

			await onSubmit(orderData);
		} catch (error) {
			console.error('Error submitting form:', error);
			throw error;
		} finally {
			isLoading = false;
		}
	}

	function closeModal() {
		onClose();
	}
</script>

<Modal title="Create New Order" size="lg" {onClose}>
	<form onsubmit={handleSubmit} class="space-y-6" method="POST">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="space-y-4">
				<div class="relative">
					<ComboBox
						name="supplierSearch"
						label="Supplier"
						items={suppliers}
						bind:value={supplierSearch}
						searchQuery={supplierSearch}
						onSelect={(supplier) => {
							formData.supplierId = supplier.id;
							supplierSearch = supplier.name;
						}}
						onFocus={() => {
							if (selectedProducts.length > 0) {
								selectedProducts = [];
							}
						}}
						displayField="name"
						placeholder="Search suppliers..."
					/>
					<input
						type="hidden"
						name="supplierId"
						value={formData.supplierId}
						required
						aria-label="Supplier ID"
					/>
				</div>
			</div>

			<TextInput
				name="orderDate"
				bind:value={formData.orderDate}
				label="Order Date"
				type="datetime-local"
				required
			/>

			<TextInput
				name="expectedArrival"
				bind:value={formData.expectedArrival}
				label="Expected Arrival"
				type="datetime-local"
				required
			/>
		</div>

		<TextArea
			name="notes"
			bind:value={formData.notes}
			label="Notes"
			rows={3}
			placeholder="Enter any additional notes..."
		/>

		{#if !formData.supplierId}
			<div class="mb-4 rounded-md bg-yellow-50 p-4 text-yellow-700">
				Please select a supplier first to see available products
			</div>
		{:else}
			<ComboBox
				name="productSearch"
				label="Add Products"
				items={filteredProducts}
				searchQuery={productSearch}
				value={productSearch}
				onSelect={(item: any) => {
					handleProductSelect(item.id);
				}}
				displayField="name"
				placeholder="Search products..."
				filterInternally={true}
				quickSearch={true}
				disabled={!formData.supplierId}
			/>
		{/if}

		<div class="overflow-x-auto">
			<Table
				columns={productColumns}
				items={selectedProducts}
				columnTypes={productColumnTypes}
				onCellChange={handleProductChange}
				onDelete={(item) => handleDeleteProduct(item.id)}
				ifEdit={(item) => false}
			/>

			<!-- Summary Table -->
			{#if selectedProducts.length > 0}
				<div class="mt-6 ml-auto w-full max-w-2xl">
					<div class="overflow-hidden rounded-lg border border-gray-200 bg-white">
						<table class="min-w-full divide-y divide-gray-200">
							<tbody class="divide-y divide-gray-200">
								<tr class="bg-gray-50">
									<td class="px-6 py-3 text-sm font-medium text-gray-900">Subtotal</td>
									<td class="px-6 py-3 text-right text-sm text-gray-500">
										{selectedProducts
											.reduce((sum, item) => sum + (item.subtotal || 0), 0)
											.toFixed(2)}
										{currency}
									</td>
								</tr>
								<tr class="bg-white">
									<td class="px-6 py-3 text-sm font-medium text-gray-900">Discount</td>
									<td class="px-6 py-3 text-right text-sm text-red-600">
										-{selectedProducts
											.reduce((sum, item) => sum + (item.discountValue || 0), 0)
											.toFixed(2)}
										{currency}
									</td>
								</tr>
								<tr class="bg-gray-50">
									<td class="px-6 py-3 text-base font-bold text-gray-900">Total</td>
									<td class="px-6 py-3 text-right text-base font-bold text-gray-900">
										{selectedProducts.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2)}
										{currency}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		</div>

		<div class="flex justify-end gap-4 pt-4">
			<Button
				type="button"
				onclick={closeModal}
				variant="secondary"
				size="md"
				extraStyles="w-full md:w-auto"
			>
				Cancel
			</Button>
			<Button
				type="submit"
				variant="primary"
				size="md"
				extraStyles="w-full md:w-auto"
				loading={isLoading}
				disabled={!formData.supplierId || selectedProducts.length === 0 || isLoading}
			>
				{isLoading ? 'Creating...' : 'Create Order'}
			</Button>
		</div>
	</form>
</Modal>
