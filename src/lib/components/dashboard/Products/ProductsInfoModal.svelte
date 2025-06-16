<script lang="ts">
	import Modal from '$lib/components/utilities/Modal/Modal.svelte';
	import type { Product, Supplier, Manufacturer, Category } from '$lib/types/products.types';

	const {
		isOpen = false,
		onClose = () => {},
		product = null,
		suppliers = [],
		manufacturers = [],
		categories = []
	} = $props<{
		isOpen?: boolean;
		onClose?: () => void;
		product: Product | null;
		suppliers?: Supplier[];
		manufacturers?: Manufacturer[];
		categories?: Category[];
	}>();

	const getSupplierName = $derived((id: string): string => {
		const supplier = suppliers.find((s: any) => s.id === id);
		return supplier?.name || 'No specified';
	});

	const getManufacturerName = $derived((id: string): string => {
		const manufacturer = manufacturers.find((m: any) => m.id === id);
		return manufacturer?.name || 'No specified';
	});

	const getCategoryName = $derived((id: string): string => {
		const category = categories.find((c: any) => c.id === id);
		return category?.name || 'No specified';
	});

	const formatCurrency = $derived((value: number | undefined): string => {
		if (!value) return 'N/A';
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'EUR'
		}).format(value);
	});

	const formatDate = $derived((dateString: string | undefined): string => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-GB');
	});
</script>

{#if isOpen}
	<Modal title="Product Information" {onClose} size="md">
		<div class="space-y-6">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<h3 class="text-lg font-medium text-gray-900">General Information</h3>
					<dl class="mt-2 space-y-2">
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Code</dt>
							<dd class="text-sm text-gray-900">{product?.code || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Name</dt>
							<dd class="text-sm text-gray-900">{product?.name || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Price</dt>
							<dd class="text-sm text-gray-900">{formatCurrency(product?.price)}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Actual Stock</dt>
							<dd class="text-sm text-gray-900">{product?.stock || 0} units</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Supplier</dt>
							<dd class="text-sm text-gray-900">
								{product?.supplierId ? getSupplierName(product.supplierId) : 'No specified'}
							</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Manufacturer</dt>
							<dd class="text-sm text-gray-900">
								{product?.manufacturerId
									? getManufacturerName(product.manufacturerId)
									: 'No specified'}
							</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Category</dt>
							<dd class="text-sm text-gray-900">
								{product?.categoryId ? getCategoryName(product.categoryId) : 'No specified'}
							</dd>
						</div>
					</dl>
				</div>

				<div>
					<h3 class="text-lg font-medium text-gray-900">Details</h3>
					<dl class="mt-2 space-y-2">
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Supplier</dt>
							<dd class="text-sm text-gray-900">{product?.supplier?.name || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Manufacturer</dt>
							<dd class="text-sm text-gray-900">{product?.manufacturer?.name || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Category</dt>
							<dd class="text-sm text-gray-900">{product?.category?.name || 'N/A'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm font-medium text-gray-500">Unit</dt>
							<dd class="text-sm text-gray-900">{product?.unit || 'N/A'}</dd>
						</div>
					</dl>
				</div>
			</div>

			<div class="border-t border-gray-200 pt-4">
				<h3 class="text-lg font-medium text-gray-900">Description</h3>
				<p class="mt-2 text-sm text-gray-700">
					{product?.description || 'No description available for this product.'}
				</p>
			</div>

			{#if product?.specifications || product?.dimensions || product?.material}
				<div class="border-t border-gray-200 pt-4">
					<h3 class="text-lg font-medium text-gray-900">Technical Specifications</h3>
					<dl class="mt-2 space-y-2">
						{#if product?.dimensions}
							<div class="flex justify-between">
								<dt class="text-sm font-medium text-gray-500">Dimensions</dt>
								<dd class="text-sm text-gray-900">{product.dimensions}</dd>
							</div>
						{/if}
						{#if product?.material}
							<div class="flex justify-between">
								<dt class="text-sm font-medium text-gray-500">Materials</dt>
								<dd class="text-sm text-gray-900">{product.material}</dd>
							</div>
						{/if}
						{#if product?.specifications}
							<div class="flex justify-between">
								<dt class="text-sm font-medium text-gray-500">Specifications</dt>
								<dd class="text-sm text-gray-900">{product.specifications}</dd>
							</div>
						{/if}
					</dl>
				</div>
			{/if}

			<div class="border-t border-gray-200 pt-4">
				<h3 class="text-lg font-medium text-gray-900">Registration</h3>
				<dl class="mt-2 space-y-2">
					<div class="flex justify-between">
						<dt class="text-sm font-medium text-gray-500">Creation Date</dt>
						<dd class="text-sm text-gray-900">{formatDate(product?.createdAt)}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-sm font-medium text-gray-500">Last Update</dt>
						<dd class="text-sm text-gray-900">{formatDate(product?.updatedAt)}</dd>
					</div>
				</dl>
			</div>
		</div>
	</Modal>
{/if}
