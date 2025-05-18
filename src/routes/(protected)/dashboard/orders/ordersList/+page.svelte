<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import { goto } from '$app/navigation';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import TextArea from '$lib/components/utilities/Form/TextArea.svelte';
	import ComboBox from '$lib/components/utilities/Form/ComboBox.svelte';

	const { data } = $props();
	let orders = $state([...data.orders]);
	let suppliers= $state([...data.suppliers])
	let showDrawer = $state(false);
	let search = $state('');
	const filteredOrders = $derived(() =>
		orders.filter((order) =>
			order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
			order.status.toLowerCase().includes(search.toLowerCase())
		)
	);
	let formData = {
		supplierName: '',
	};

	let searchSupplierQuery = '';
	function handleSelectSupplier(supplier: any) {
		formData.supplierName = supplier.name;
	}
	function searchSuppliers(query: string) {
		searchSupplierQuery = query;
	}


	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	function goToOrderDetails(id: string) {
		goto(`/dashboard/orders/${id}`);
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
</script>

<section class="min-h-screen w-full p-8 bg-gradient-to-b from-gray-50 to-blue-50">
	<PageHeader title="Orders Management" countLabel="orders" totalCount={orders.length} />

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
		columns={['orderNumber', 'status', 'orderDate']}
		items={filteredOrders()}
		onrowClick={(e) => goToOrderDetails(e.detail)}
		ondelete={(e) => handleDelete(e.detail.id)}
	/>

	{#if showDrawer}
	<Drawer title="➕ Create New Order" onClose={closeDrawer}>
		<form method="POST" action="?/create" class="space-y-4">
			<TextInput name="orderNumber" required placeholder="Order Number" />
							<ComboBox
								name="supplierId"
								label="Supplier"
								items={suppliers}
								required
							/>
							<TextInput name="orderDate" label="Order Date" type="datetime-local" required />
							<TextInput name="expectedArrival" label="Expected Arrival" type="datetime-local" required />
							<TextArea name="notes" label="Notes" rows={4} placeholder="Enter any additional notes..." />

							<div class="mt-6 flex justify-end gap-4">
				<button type="button" onclick={closeDrawer} class="rounded-xl bg-gray-200 px-6 py-2 font-semibold text-gray-700 shadow-sm hover:bg-gray-300">
					Cancel
				</button>
				<button type="submit" class="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 font-semibold text-white shadow-md hover:from-blue-600 hover:to-indigo-600">
					Create
				</button>
			</div>
		</form>
	</Drawer>
{/if}
</section>
