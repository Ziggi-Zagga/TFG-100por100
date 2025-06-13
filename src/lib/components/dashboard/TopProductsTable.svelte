<script lang="ts">
	import Table from '$lib/components/utilities/table/Table.svelte';

	export let products: Array<{
		name: string;
		sku: string;
		currentStock: number;
		minStock: number;
		reorderQuantity: number;
		warehouse: string;
	}> = [];

	// Define table columns with their types and styles
	const columns = [
		'name',
		'sku',
		'currentStock',
		'minStock',
		'reorderQuantity',
		'warehouse',
	];

	const columnTypes = {
		currentStock: { 
			type: 'text' as const, 
			extraStyles: 'text-red-500'
		},
	};

	const formatNumber = (num: number) => {
		return num.toLocaleString('es-ES');
	};

	// Prepare data for the table with conditional classes
	const tableData = products.map(product => {
		const currentStock = product.currentStock || 0;
		const minStock = product.minStock || 0;
		const reorderQuantity = product.reorderQuantity || 0;

		return {
			...product,
			currentStock: currentStock,
			minStock: formatNumber(minStock),
			reorderQuantity: formatNumber(reorderQuantity)
		};
	});

	function handleRowClick(item: any) {
		
		window.location.href = '/dashboard/orders/ordersList';
	}
</script>

<div class="overflow-hidden bg-white rounded-lg shadow">
	<div class="px-6 py-5 border-b border-gray-200">
		<h2 class="text-lg font-semibold leading-6 text-gray-900">Low Stock Products</h2>
	</div>
	
	{#if products.length === 0}
		<div class="p-6 text-center">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
			</svg>
			<p class="mt-2 text-sm text-gray-500">Great! All products have sufficient stock.</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<Table
				columns={columns}
				items={tableData.map(item => ({
					...item,
					currentStock: item.currentStock?.toString() || '0'
				}))}
				columnTypes={columnTypes}
				onRowClick={handleRowClick}
				ifEdit={() => false}
				ifDelete={() => false}
			/>
		</div>
	{/if}
</div>
