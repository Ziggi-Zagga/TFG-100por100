<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import { goto } from '$app/navigation';

	const { data } = $props();
	let orders = $state([...data.orders]);
	let showDrawer = $state(false);
	let search = $state('');
	const filteredOrders = $derived(() =>
		orders.filter((order) =>
			order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
			order.status.toLowerCase().includes(search.toLowerCase())
		)
	);

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
		on:rowClick={(e) => goToOrderDetails(e.detail)}
		on:delete={(e) => handleDelete(e.detail.id)}
	/>

	{#if showDrawer}
		<Drawer title="➕ Create New Order" onClose={closeDrawer}>
			<form method="POST" action="?/create" class="p-8 space-y-4">
				<h2 class="text-2xl font-bold text-blue-800">➕ Create New Order</h2>

				<input name="supplierId" required placeholder="Supplier ID" class="w-full rounded-xl border border-gray-300 p-3" />
				<input name="status" required placeholder="Status (e.g., pending, shipped)" class="w-full rounded-xl border border-gray-300 p-3" />
				<input name="expectedArrival" type="date" class="w-full rounded-xl border border-gray-300 p-3" />
				<textarea name="notes" placeholder="Notes" class="w-full rounded-xl border border-gray-300 p-3"></textarea>

				<div class="flex justify-end gap-4">
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
