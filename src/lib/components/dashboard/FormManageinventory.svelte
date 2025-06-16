<script lang="ts">
	import TextInput from '../utilities/Form/TextInput.svelte';
	import ComboBox from '../utilities/Form/ComboBox.svelte';
	import Button from '../utilities/Button/Button.svelte';

	import type { FormattedProduct } from '../../types/dashboard.types';

	const { products = [], onUpdate } = $props<{
		products: FormattedProduct[];
		onUpdate: (data: {
			inventoryId: string;
			quantity: number;
		}) => Promise<{ success: boolean; error?: string }>;
	}>();

	let selectedProduct = $state('');
	let quantity = $state(1);
	let searchQuery = $state('');
	let isComboOpen = $state(false);
	let isSubmitting = $state(false);
	let error = $state<string | null>(null);

	const filteredProducts = $derived(
		searchQuery
			? products.filter(
					(product: FormattedProduct) =>
						product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
						(product.location && product.location.toLowerCase().includes(searchQuery.toLowerCase()))
				)
			: [...products]
	);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		error = null;

		if (!selectedProduct) {
			error = 'Please select a product';
			return;
		}

		if (!quantity || quantity <= 0) {
			error = 'Please enter a valid quantity';
			return;
		}

		try {
			isSubmitting = true;

			await onUpdate({
				inventoryId: selectedProduct,
				quantity: -Math.abs(quantity)
			});

			selectedProduct = '';
			quantity = 1;
			searchQuery = '';
			isComboOpen = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error updating inventory. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	function handleSelect(item: { value: string }) {
		selectedProduct = item.value;
		isComboOpen = false;
	}

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target) {
			searchQuery = target.value;
			if (target.value) {
				isComboOpen = true;
			}
		}
	}

	function handleQuantityChange(value: string | number) {
		const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
		if (!isNaN(numValue)) {
			quantity = numValue;
		}
	}
</script>

<div class="rounded-2xl bg-white p-6 shadow">
	<h2 class="mb-4 text-lg font-semibold">Inventory Management</h2>

	<form onsubmit={handleSubmit} class="space-y-4">
		<div>
			<ComboBox
				name="product-select"
				label="Select Product"
				items={filteredProducts.map((product: FormattedProduct) => ({
					value: product.inventoryId,
					name: `${product.productName} (${product.location}) - ${product.quantity} available`,
					inventoryId: product.inventoryId
				}))}
				onSelect={handleSelect}
				{searchQuery}
				placeholder="Select a product"
				value={selectedProduct}
				bind:open={isComboOpen}
				filterInternally={false}
			/>
		</div>

		<div>
			<TextInput
				name="quantity"
				type="number"
				min={1}
				bind:value={quantity}
				onValueChange={handleQuantityChange}
				placeholder="Quantity to add/subtract"
				required
			/>
		</div>

		<div class="mt-6 flex justify-end space-x-3">
			<Button
				type="button"
				variant="secondary"
				size="md"
				onclick={() => {
					selectedProduct = '';
					quantity = 1;
					searchQuery = '';
					isComboOpen = false;
				}}
			>
				Cancel
			</Button>
			<Button type="submit" variant="primary" size="md">Update Inventory</Button>
		</div>
	</form>
</div>
