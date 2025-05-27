<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import OrderDetails from '$lib/components/dashboard/Orders/OrderDetails.svelte';
	import OrderModal from '$lib/components/dashboard/Orders/OrderModal.svelte';
	import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
	import type { Supplier } from '$lib/types/products.types';

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

	let supplierDisplayValue = $state('');
	const productColumns = ['code', 'name', 'price', 'quantity', 'discount', 'total'];

	const productColumnTypes: Record<string, any> = {
		quantity: { type: 'input' as const, inputType: 'number', min: 1, step: 1 },
		discount: { type: 'input' as const, inputType: 'number', min: 0, max: 100, step: 1 },
		actions: {
			type: 'actions' as const,
			actions: [
				{
					label: 'Delete',
					onClick: (item: any) => handleDeleteProduct(item.id)
				}
			]
		}
	};

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

	function handleSupplierSelect(supplierName: string) {
		const supplier = suppliers.find((s) => s.name === supplierName);
		if (supplier) {
			currentSupplier = supplier;
			formData.supplierId = supplier.id;
		} else {
			currentSupplier = null;
			formData.supplierId = '';
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

	async function handleDeleteProduct(productId: string) {
		selectedProducts = selectedProducts.filter((p) => p.id !== productId);
	}

	function handleProductSelect(productId: string) {
		const product = products.find((p) => p.id === productId);
		if (!product) return;

		if (selectedProducts.some((p) => p.id === productId)) return;

		selectedProducts = [
			...selectedProducts,
			{
				id: product.id,
				code: product.code,
				name: product.name,
				price: product.price,
				quantity: 1,
				discount: 0,
				get total() {
					return this.price * this.quantity * (1 - this.discount / 100);
				}
			}
		];
	}

	function handleProductChange(item: any, column: string, value: number) {
		const newValue = Number(value);
		if (item[column] === newValue) return;

		selectedProducts = selectedProducts.map(p => 
			p.id === item.id ? { ...p, [column]: newValue } : p
		);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		formData.set('items', JSON.stringify(selectedProducts.map(p => ({
			productId: p.id,
			quantity: p.quantity,
			price: p.price,
			discount: p.discount || 0
		}))));

		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				closeDrawer();
				window.location.reload();
			} else {
				console.error('Error al crear la orden');
			}
		} catch (error) {
			console.error('Error al enviar el formulario:', error);
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

	{#if showDrawer}
		<OrderModal
			suppliers={suppliers}
			products={products}
			selectedProducts={selectedProducts}
			formData={formData}
			supplierDisplayValue={supplierDisplayValue}
			search={search}
			productColumns={productColumns}
			productColumnTypes={productColumnTypes}
			onClose={closeDrawer}
			onProductSelect={handleProductSelect}
			onProductDelete={handleDeleteProduct}
			onProductChange={handleProductChange}
			onSubmit={handleSubmit}
		/>
	{/if}
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
