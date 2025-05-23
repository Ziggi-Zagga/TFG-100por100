<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import TextArea from '$lib/components/utilities/Form/TextArea.svelte';
	import ComboBox from '$lib/components/utilities/Form/ComboBox.svelte';
	import Modal from '$lib/components/utilities/Modal/Modal.svelte';
	import OrderDetails from '$lib/components/dashboard/Orders/OrderDetails.svelte';
	import Icon from '$lib/components/utilities/Icons/Icon.svelte';

	const { data } = $props();
	let orders = $state([...data.orders]);
	let suppliers = $state([...data.suppliers]);
	let products = $state([...data.products]);
	let showDrawer = $state(false);
	let showOrderDetails = $state(false);
	let search = $state('');
	let selectedProducts = $state<any[]>([]);
	let selectedSupplier = $state<{ id: string; name: string } | null>(null);
	let selectedOrder = $state<any>(null);
	let formData = $state({
		orderNumber: '',
		supplierId: '',
		orderDate: '',
		expectedArrival: '',
		notes: ''
	});
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
		const orderWithProducts = {
			...order,
			products: Array.isArray(order.products) ? order.products : [order.products].filter(Boolean)
		};
		selectedOrder = orderWithProducts;
		showOrderDetails = true;
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
			selectedSupplier = supplier;
			formData.supplierId = supplier.id;
		} else {
			selectedSupplier = null;
			formData.supplierId = '';
		}
	}

	async function handleDelete(orderId: string) {
		const formData = new FormData();
		formData.append('id', orderId);

		const res = await fetch('/dashboard/orders?/delete', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			orders = orders.filter((o) => o.id !== orderId);
		} else {
			console.error('Failed to delete order');
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

		selectedProducts = selectedProducts.map((p) =>
			p.id === item.id ? { ...p, [column]: newValue } : p
		);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const items = selectedProducts.map((p) => ({
			productId: p.id,
			quantity: p.quantity,
			price: p.price,
			discount: p.discount || 0
		}));

		formData.set('items', JSON.stringify(items));

		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: formData
			});

			if (response.redirected) {
				window.location.href = response.url;
			} else if (!response.ok) {
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
				{@html '<span class="hidden md:inline">Add Order</span>'}
			</Button>
		</div>
	</div>

	<Table
		columns={ordersColumns}
		columnTypes={ordersColumnTypes}
		items={filteredOrders()}
		onRowClick={(item) => handleViewOrder(item)}
		onDelete={(item) => handleDelete(item.id)}
		onCellChange={handleStatusChange}
	/>

	{#if showDrawer}
		<Modal title="➕ Create New Order" onClose={closeDrawer} size="lg">
			<form method="POST" action="?/create" class="space-y-4" onsubmit={handleSubmit}>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<!-- Primera fila -->
					<div class="space-y-4">
						<TextInput
							name="orderNumber"
							label="Order Number"
							bind:value={formData.orderNumber}
							required
							placeholder="Order Number"
						/>
					</div>
					<div class="space-y-4">
						<ComboBox
							name="supplierName"
							label="Supplier"
							items={suppliers || []}
							bind:value={formData.supplierId}
							onValueChange={(supplier) => handleSupplierSelect(supplier.name)}
							required
						/>
						<input type="hidden" name="supplierId" value={formData.supplierId} />
						{#if suppliers && suppliers.length === 0}
							<p class="text-sm text-red-500">
								No hay proveedores disponibles. Por favor, añade proveedores primero.
							</p>
						{/if}
					</div>

					<!-- Segunda fila -->
					<div class="space-y-4">
						<TextInput
							name="orderDate"
							bind:value={formData.orderDate}
							label="Order Date"
							type="datetime-local"
							required
						/>
					</div>
					<div class="space-y-4">
						<TextInput
							name="expectedArrival"
							bind:value={formData.expectedArrival}
							label="Expected Arrival"
							type="datetime-local"
							required
						/>
					</div>
				</div>
				<TextArea
					name="notes"
					bind:value={formData.notes}
					label="Notes"
					rows={4}
					placeholder="Enter any additional notes..."
				/>

				<ComboBox
					label="Products"
					items={products}
					quickSearch={true}
					bind:searchQuery={search}
					onQuickSelect={(item) => {
						handleProductSelect(item.id);
					}}
					placeholder="Search products..."
				/>

				<Table
					columns={productColumns}
					items={selectedProducts}
					columnTypes={productColumnTypes}
					onCellChange={handleProductChange}
					onDelete={(item) => handleDeleteProduct(item.id)}
					ifEdit={(item) => false}
				/>

				<!-- Campo oculto para los ítems del pedido -->
				<input type="hidden" name="items" value={JSON.stringify(selectedProducts)} />

				<div class="mt-6 flex justify-end gap-4">
					<button
						type="button"
						onclick={closeDrawer}
						class="rounded-xl bg-gray-200 px-6 py-2 font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 font-semibold text-white shadow-md hover:from-blue-600 hover:to-indigo-600"
					>
						Create
					</button>
				</div>
			</form>
		</Modal>
	{/if}
	{#if showOrderDetails}
		<OrderDetails
			bind:isOpen={showOrderDetails}
			order={selectedOrder}
			onClose={onCloseDrawerDetails}
		/>
	{/if}
</section>
