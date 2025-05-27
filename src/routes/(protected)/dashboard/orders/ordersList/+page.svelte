<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import OrderDetails from '$lib/components/dashboard/Orders/OrderDetails.svelte';
	import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
	import type { Supplier } from '$lib/types/products.types';
	import CreateOrders from '$lib/components/dashboard/Orders/CreateOrders.svelte';

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
	let orderToDelete: { id: string, orderNumber: string } | null = $state(null);

	let formData = $state({
		orderNumber: '',
		supplierId: '',
		orderDate: '',
		expectedArrival: '',
		notes: ''
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
		}
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
                products: Array.isArray(order.products) ? order.products : [order.products].filter(Boolean)
            };

            selectedOrder = orderWithProducts;
            currentSupplier = null;

            const supplierId = orderWithProducts.supplierId || orderWithProducts.supplierid;
            
            if (supplierId) {
                const foundSupplier = suppliers.find((s: any) => 
                    s.id === supplierId || 
                    s.id.toString() === supplierId.toString()
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

	const filteredOrders = $derived(() =>
		orders.filter(
			(order) =>
				order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
				order.status.toLowerCase().includes(search.toLowerCase())
		)
	);

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
				throw new Error('Error al actualizar el estado del pedido');
			}

			const result = await response.json();
			if (result.error) {
				throw new Error(result.message || 'Error al actualizar el pedido');
			}

			return true;
		} catch (error) {
			console.error('Error al actualizar el estado:', error);
			order[column] = oldStatus;
			return false;
		}
	}

	// Open delete confirmation dialog
	function confirmDelete(order: { id: string, orderNumber: string }) {
		orderToDelete = order;
		showDeleteDialog = true;
	}

	// Handle confirmed deletion
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
				// Update the orders list by removing the deleted order
				orders = orders.filter(order => order.id !== orderToDelete?.id);
				// Show success message (you can replace this with a toast notification)
				alert('Order deleted successfully');
			} else {
				const result = await response.json();
				console.error('Error deleting order:', result.message);
				alert('Error deleting order: ' + (result.message || 'Unknown error'));
			}
		} catch (error) {
			console.error('Error deleting order:', error);
			alert('Error deleting order. Please try again.');
		} finally {
			showDeleteDialog = false;
			orderToDelete = null;
		}
	}


	async function handleOrderSubmit(event: CustomEvent) {
		try {
			// The event detail contains the form data from CreateOrders component
			const formData = event.detail;
			
			// Here you would typically send the data to your API
			const response = await fetch('?/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				throw new Error('Error al crear el pedido');
			}

			const result = await response.json();
			if (result.error) {
				throw new Error(result.message || 'Error al crear el pedido');
			}

			// Add the new order to the orders list
			orders = [result.data, ...orders];
			
			// Close the drawer
			showDrawer = false;
			
			// Show success message or redirect
			alert('Pedido creado exitosamente');
		} catch (error) {
			console.error('Error creating order:', error);
			alert('Error al crear el pedido: ' + (error instanceof Error ? error.message : 'Error desconocido'));
		}
	}

	async function handleSubmit(orderData: any) {
		try {
			const formData = new FormData();
			
			// Add all form fields to formData
			Object.entries(orderData).forEach(([key, value]) => {
				if (key === 'items') {
					formData.set('items', JSON.stringify(value));
				} else if (value !== null && value !== undefined) {
					formData.set(key, String(value));
				}
			});

			// Add the current user ID to the form data
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
				
				// Refresh the page to show the new order
				window.location.reload();
			} else {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Error creating order');
			}
		} catch (error) {
			console.error('Error creating order:', error);
			alert(`Error creating order: ${error instanceof Error ? error.message : 'Unknown error'}`);
			throw error; // Re-throw to let the form handle it
		}
	}
</script>

<section class="min-h-screen w-full bg-gradient-to-b from-gray-50 to-blue-50 p-8">
	<PageHeader title="Orders Management" subtitle={`${orders.length} orders`} />

	<div class="mb-1 flex flex-col items-center gap-4 md:flex-row">
		<div class="w-full md:flex-1">
			<SearchBar bind:search placeholder="Search by order number or status..." />
		</div>
		<div class="-mt-6 flex w-full justify-end md:w-auto">
			<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
				Add Order
			</Button>
		</div>
	</div>

	<Table
		columns={ordersColumns}
		columnTypes={ordersColumnTypes}
		items={filteredOrders()}
		onRowClick={(item: any) => handleViewOrder(item)}
		onDelete={confirmDelete}
		onCellChange={handleStatusChange}
		ifEdit={() => false}
		
	/>

	<CreateOrders
		isOpen={showDrawer}
		suppliers={suppliers}
		products={products}
		onClose={closeDrawer}
		onSubmit={handleSubmit}
	/>
	{#if showOrderDetails}
		<OrderDetails
			bind:isOpen={showOrderDetails}
			order={selectedOrder}
			supplier={currentSupplier || undefined}
			onClose={onCloseDrawerDetails}
		/>
	{/if}
	<!-- Delete Confirmation Dialog -->
	<ConfirmDialog
		show={showDeleteDialog}
		message={`Are you sure you want to delete order #${orderToDelete?.orderNumber || ''}? This action cannot be undone.`}
		onConfirm={handleDelete}
		onCancel={() => {
			showDeleteDialog = false;
			orderToDelete = null;
		}}
	/>
</section>
