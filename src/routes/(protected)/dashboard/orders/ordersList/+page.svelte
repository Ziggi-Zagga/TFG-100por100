<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import OrderDetails from '$lib/components/dashboard/Orders/OrderDetails.svelte';
	import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
	import type { Supplier } from '$lib/types/products.types';
	import CreateOrders from '$lib/components/dashboard/Orders/CreateOrders.svelte';
	import ToastList from '$lib/components/utilities/Toast/ToastList.svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();
	let orders = $state([...data.orders]);
	let suppliers = $state([...data.suppliers]);
	let products = $state([...data.products]);
	let showDrawer = $state(false);
	let showOrderDetails = $state(false);
	let search = $state('');
	let selectedProducts = $state<any[]>([]);
	let selectedOrder = $state<any>(null);
	let currentSupplier = $state<Supplier | null>(null);
	let showDeleteDialog = $state(false);
	let orderToDelete: { id: string; orderNumber: string } | null = $state(null);

	let toasts = $state<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>(
		[]
	);
	function showSuccess(message: string) {
		const id = crypto.randomUUID();
		toasts = [...toasts, { id, message, type: 'success' }];
		setTimeout(() => removeToast(id), 3000);
	}

	function showError(message: string) {
		const id = crypto.randomUUID();
		toasts = [...toasts, { id, message, type: 'error' }];
		setTimeout(() => removeToast(id), 3000);
	}

	function removeToast(id: string) {
		toasts = toasts.filter((t) => t.id !== id);
	}

	let sortColumn = $state<string | null>('orderDate');
	let sortDirection = $state<'asc' | 'desc'>('desc');

	let formData = $state({
		orderNumber: '',
		supplierId: '',
		orderDate: '',
		expectedArrival: '',
		notes: ''
	});

	import { onMount } from 'svelte';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const id = urlParams.get('id');
		if (id) {
			const order = orders.find((order) => order.id === id);
			if (order) {
				search = order.orderNumber;
				urlParams.delete('id');
				const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
				window.history.replaceState({}, '', newUrl);
			}
		}
	});

	const ordersColumns = ['', 'orderNumber', 'status', 'orderDate'];

	const ordersColumnTypes = {
		'': {
			type: 'icon' as const,
			icon: (item: any) => {
				const status = item.status?.toLowerCase();

				if (status === 'completed') {
					return { icon: 'check', color: 'text-green-500' };
				} else if (status === 'cancelled') {
					return { icon: 'cancelled', color: 'text-red-500' };
				} else if (status === 'pending') {
					return { icon: 'alert', color: 'text-yellow-500' };
				}
				return { icon: 'todo', color: 'text-gray-400' };
			},
			extraStyles: 'w-10 text-center'
		},
		status: {
			type: 'select' as const,
			options: [
				{ id: 'pending', name: 'Pending' },
				{ id: 'completed', name: 'Completed' },
				{ id: 'cancelled', name: 'Cancelled' }
			],
			extraStyles: 'w-full'
		},		
	};

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
		formData = {
			orderNumber: '',
			supplierId: '',
			orderDate: '',
			expectedArrival: '',
			notes: ''
		};
		selectedProducts = [];
		search = '';
	}
	function onCloseDrawerDetails() {
		showOrderDetails = false;
	}

	function handleViewOrder(order: any) {
		try {
			if (!selectedOrder || order.id !== selectedOrder.id) {
				const orderWithProducts = {
					...order,
					products: Array.isArray(order.products)
						? order.products
						: [order.products].filter(Boolean)
				};

				selectedOrder = orderWithProducts;
				currentSupplier = null;

				const supplierId = orderWithProducts.supplierId || orderWithProducts.supplierid;

				if (supplierId) {
					const foundSupplier = suppliers.find(
						(s: any) => s.id === supplierId || s.id.toString() === supplierId.toString()
					);

					if (foundSupplier) {
						currentSupplier = foundSupplier;
					} else {
						console.warn('Supplier not found for ID:', supplierId);
					}
				}

				showOrderDetails = true;
			} else {
				showOrderDetails = !showOrderDetails;
			}
		} catch (error) {
			console.error('Error in handleViewOrder:', error);
			showOrderDetails = false;
		}
	}

	const filteredAndSortedOrders = $derived(() => {
		let result = [...orders];

		if (search) {
			const searchTerm = search.toLowerCase();
			result = result.filter(
				(order) =>
					order.orderNumber?.toLowerCase().includes(searchTerm) ||
					order.status?.toLowerCase().includes(searchTerm)
			);
		}

		if (sortColumn) {
			result.sort((a, b) => {
				let aValue = a[sortColumn as keyof typeof a];
				let bValue = b[sortColumn as keyof typeof b];

				if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
				if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

				aValue = String(aValue).toLowerCase();
				bValue = String(bValue).toLowerCase();

				if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
				if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
				return 0;
			});
		}

		return result;
	});

	async function handleSort(column: string) {
		if (sortColumn === column) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column;
			sortDirection = 'asc';
		}
	}

	async function handleStatusChange(order: any, column: string, newStatus: string) {
		const oldStatus = order[column];

		try {
			order[column] = newStatus;

			const formData = new FormData();
			formData.append('id', order.id);
			formData.append('status', newStatus);

			const response = await fetch('?/update', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Error updating order status');
			}

			const result = await response.json();
			if (result.error) {
				const errorMessage = result.message || 'Error updating order status';
				showError(errorMessage);
				throw new Error(errorMessage);
			}
			showSuccess('Order status updated successfully');

			return true;
		} catch (error) {
			const errorMessage =
				'Error updating order status: ' +
				(error instanceof Error ? error.message : 'Unknown error');
			console.error(errorMessage, error);
			showError(errorMessage);
			order[column] = oldStatus;
			return false;
		}
	}

	function confirmDelete(order: { id: string; orderNumber: string }) {
		orderToDelete = order;
		showDeleteDialog = true;
	}

	async function handleDelete() {
		if (!orderToDelete) return;

		try {
			const formData = new FormData();
			formData.append('id', orderToDelete.id);

			const response = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				orders = orders.filter((order) => order.id !== orderToDelete?.id);
				showSuccess('Order deleted successfully');
			} else {
				const result = await response.json();
				const errorMessage = 'Error deleting order: ' + (result.message || 'Unknown error');
				console.error(errorMessage);
				showError(errorMessage);
			}
		} catch (error) {
			const errorMessage =
				'Error deleting order. ' + (error instanceof Error ? error.message : 'Please try again.');
			console.error(errorMessage, error);
			showError(errorMessage);
		} finally {
			showDeleteDialog = false;
			orderToDelete = null;
		}
	}
	async function handleSubmit(orderData: any) {
		try {
			const formData = new FormData();

			Object.entries(orderData).forEach(([key, value]) => {
				if (key === 'items') {
					formData.set('items', JSON.stringify(value));
				} else if (value !== null && value !== undefined) {
					formData.set(key, String(value));
				}
			});

			if (data.user?.id) {
				formData.set('userId', data.user.id);
			}

			const response = await fetch('?/create', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const result = await response.json();
				if (result.error) {
					throw new Error(result.message || 'Error creating order');
				}

				window.location.reload();
			} else {
				const errorData = await response.json().catch(() => ({}));
				const errorMessage = errorData.message || 'Error creating order';
				console.error(errorMessage);
				showError(errorMessage);
			}
		} catch (error) {
			const errorMessage = `Error creating order: ${error instanceof Error ? error.message : 'Unknown error'}`;
			console.error(errorMessage, error);
			showError(errorMessage);
		}
	}
</script>

<main
	class="min-h-screen w-full"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<PageHeader title="Orders Management" subtitle={`${orders.length} orders`}>
		<div class="flex w-full flex-col items-center gap-4 md:flex-row">
			<div class="w-72 md:flex-[3] lg:flex-[4]">
				<SearchBar
					bind:search
					placeholder="Search by order number or status..."
					extraClasses="w-full"
				/>
			</div>
			<div class="w-full md:w-auto">
				<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
					Add Order
				</Button>
			</div>
		</div>
	</PageHeader>
	<section class="container p-4">
	<Table
		columns={ordersColumns}
		columnTypes={ordersColumnTypes}
		items={filteredAndSortedOrders()}
		onRowClick={(item: any) => handleViewOrder(item)}
		onDelete={confirmDelete}
		onCellChange={handleStatusChange}
		onSort={handleSort}
		sortable={true}
		{sortColumn}
		{sortDirection}
		ifEdit={() => false}
	/>
	</section>
	{#if showDrawer}
		<CreateOrders {suppliers} {products} onClose={closeDrawer} onSubmit={handleSubmit} />
	{/if}
	{#if showOrderDetails}
		<OrderDetails
			bind:isOpen={showOrderDetails}
			order={selectedOrder}
			supplier={currentSupplier || undefined}
			onClose={onCloseDrawerDetails}
		/>
	{/if}
	<ConfirmDialog
		show={showDeleteDialog}
		message={`Are you sure you want to delete order #${orderToDelete?.orderNumber || ''}? This action cannot be undone.`}
		onConfirm={handleDelete}
		onCancel={() => {
			showDeleteDialog = false;
			orderToDelete = null;
		}}
	/>
	<ToastList {toasts} on:removeToast={(e) => removeToast(e.detail.id)} />
		
</main>
