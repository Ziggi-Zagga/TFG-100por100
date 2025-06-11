<script lang="ts">
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import Modal from '$lib/components/utilities/Modal/Modal.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import type { Supplier } from '$lib/types/products.types';
	import { currency, formatCurrency } from '$lib/components/helpers/currencies';

	let {
		isOpen = $bindable<boolean>(),
		order,
		onClose,
		supplier
	} = $props<{
		isOpen?: boolean;
		order?: any;
		onClose?: () => void;
		supplier?: Supplier;
	}>();

	function formatDate(dateString: string) {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('es-GB', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function hasDiscounts(products: any[]) {
		if (!products || !products.length) return false;
		return products.some((item) => parseFloat(item.discount || 0) > 0);
	}

	function calculateSubtotal(products: any[]) {
		if (!products || !products.length) return '0.00';
		const subtotal = products.reduce((total: number, item: any) => {
			const price = parseFloat(item.price || 0);
			const quantity = parseFloat(item.quantity || 0);
			return total + price * quantity;
		}, 0);
		return formatCurrency(subtotal);
	}

	function calculateDiscounts(products: any[]) {
		if (!products || !products.length) return '0.00';
		const totalDiscount = products.reduce((total: number, item: any) => {
			const price = parseFloat(item.price || 0);
			const quantity = parseFloat(item.quantity || 0);
			const discount = parseFloat(item.discount || 0);
			const subtotal = price * quantity;
			const discountAmount = subtotal * (discount / 100);
			return total + discountAmount;
		}, 0);
		return formatCurrency(totalDiscount);
	}

	function calculateTotal(products: any[]) {
		if (!products || !products.length) return '0.00';
		const total = products.reduce((total: number, item: any) => {
			const price = parseFloat(item.price || 0);
			const quantity = parseFloat(item.quantity || 0);
			const discount = parseFloat(item.discount || 0);
			const subtotal = price * quantity;
			const discountAmount = subtotal * (discount / 100);
			return total + (subtotal - discountAmount);
		}, 0);
		return formatCurrency(total);
	}

	const productColumns = ['code', 'name', 'quantity', 'price', 'discount', 'total'];

	const productColumnTypes = {
		price: { type: 'text' as const, extraStyles: 'text-right' },
		discount: { type: 'text' as const, extraStyles: 'text-center' },
		total: { type: 'text' as const, extraStyles: 'text-right font-medium' },
		quantity: { type: 'text' as const, extraStyles: 'text-center' }
	};

	let productItems = $state<any[]>([]);

	$effect(() => {
		const items = order?.items || order?.products || [];

		if (!items.length) {
			productItems = [];
			return;
		}

		productItems = items.map((item: any) => {
			const price = parseFloat(item.price || 0);
			const quantity = parseFloat(item.quantity || 0);
			const discount = parseFloat(item.discount || 0);
			const subtotal = price * quantity;
			const discountAmount = subtotal * (discount / 100);
			const total = subtotal - discountAmount;

			return {
				...item,
				code: item.code || 'N/A',
				name: item.name || 'Unnamed Product',
				price: formatCurrency(price),
				quantity: quantity.toString(),
				discount: discount > 0 ? `${discount}%` : '0%',
				total: formatCurrency(total),
				_rowClass: 'hover:bg-gray-50',
				_cellClass: {
					price: 'font-mono',
					discount: 'font-mono',
					total: 'font-mono font-semibold',
					quantity: 'font-mono'
				}
			};
		});
	});
</script>

<Modal title="Order Details" size="lg" {onClose}>
	{#if order}
		<div class="space-y-6">
			<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
				<div class="rounded-lg bg-gray-50 p-4">
					<h3 class="text-sm font-medium text-gray-500">Order Number</h3>
					<p class="mt-1 text-lg font-semibold">{order.orderNumber || 'N/A'}</p>
				</div>
				<div class="rounded-lg bg-gray-50 p-4">
					<h3 class="text-sm font-medium text-gray-500">Status</h3>
					<div class="mt-1">
						<span
							class="rounded-full px-3 py-1 text-sm"
							class:bg-green-100={order.status === 'completed'}
							class:text-green-800={order.status === 'completed'}
							class:bg-yellow-100={order.status === 'pending'}
							class:text-yellow-800={order.status === 'pending'}
							class:bg-red-100={order.status === 'cancelled'}
							class:text-red-800={order.status === 'cancelled'}
							class:bg-gray-100={!['completed', 'pending', 'cancelled'].includes(order.status)}
							class:text-gray-800={!['completed', 'pending', 'cancelled'].includes(order.status)}
						>
							{order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'N/A'}
						</span>
					</div>
				</div>
				<div class="rounded-lg bg-gray-50 p-4">
					<h3 class="text-sm font-medium text-gray-500">Order Date</h3>
					<p class="mt-1">{formatDate(order.orderDate)}</p>
				</div>
			</div>

			<!-- Supplier Information -->
			<div class="mb-6 rounded-lg bg-white p-6 shadow">
				<h3 class="mb-4 text-lg font-medium text-gray-900">Supplier Information</h3>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<h4 class="text-sm font-medium text-gray-500">Name</h4>
						<p>{supplier?.name || 'N/A'}</p>
					</div>
					<div>
						<h4 class="text-sm font-medium text-gray-500">Contact Person</h4>
						<p>{supplier?.contactPerson || 'N/A'}</p>
					</div>
					<div>
						<h4 class="text-sm font-medium text-gray-500">Phone</h4>
						<p>{supplier?.phone || 'N/A'}</p>
					</div>
					<div>
						<h4 class="text-sm font-medium text-gray-500">Email</h4>
						<p>{supplier?.email || 'N/A'}</p>
					</div>
				</div>
			</div>
			<!-- Notes -->
			{#if order.notes}
				<div class="rounded-lg bg-white p-6 shadow">
					<h3 class="mb-2 text-lg font-medium text-gray-900">Notes</h3>
					<p class="whitespace-pre-line text-gray-600">{order.notes}</p>
				</div>
			{/if}

			<!-- Order Products -->
			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="border-b border-gray-200 px-6 py-4">
					<h3 class="text-lg font-medium text-gray-900">Products</h3>
				</div>
				<div class="p-4">
					{#if order.products && order.products.length > 0}
						<Table
							columns={productColumns}
							items={productItems}
							onRowClick={() => {}}
							ifEdit={() => false}
							ifDelete={() => false}
						/>

						<!-- Totals -->
						<div class="mt-4 border-t border-gray-200 pt-4">
							<div class="flex justify-end">
								<div class="w-full max-w-md">
									<div class="flex justify-between py-1">
										<span class="text-sm font-medium text-gray-700">Subtotal:</span>
										<span class="text-sm text-gray-900">{calculateSubtotal(order.products)}</span>
									</div>
									{#if hasDiscounts(order.products)}
										<div class="flex justify-between py-1">
											<span class="text-sm font-medium text-gray-700">Discounts:</span>
											<span class="text-sm text-red-600">-{calculateDiscounts(order.products)}</span
											>
										</div>
									{/if}
									<div class="mt-2 flex justify-between border-t border-gray-200 pt-2">
										<span class="text-base font-semibold text-gray-900">Total:</span>
										<span class="text-base font-semibold text-gray-900"
											>{calculateTotal(order.products)}</span
										>
									</div>
								</div>
							</div>
						</div>
					{:else}
						<div class="py-4 text-center text-sm text-gray-500">
							No hay productos en este pedido
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<div class="mt-6 flex justify-end space-x-3">
		<Button variant="secondary" onclick={onClose} size="md">Cerrar</Button>
	</div>
</Modal>
