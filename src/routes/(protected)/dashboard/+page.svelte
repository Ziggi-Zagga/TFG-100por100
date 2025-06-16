<script lang="ts">
	import { fade } from 'svelte/transition';
	import MetricCard from '$lib/components/dashboard/MetricCard.svelte';
	import TopProductsTable from '$lib/components/dashboard/TopProductsTable.svelte';
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import Icon from '$lib/components/utilities/Icons/Icon.svelte';
	import { formatDate } from '$lib/utils/dateFormat';
	import FormManageinventory from '$lib/components/dashboard/FormManageinventory.svelte';
	import ToastList from '$lib/components/utilities/Toast/ToastList.svelte';

	let toastList: any; 

		
	const { data } = $props();
	let { userName, metrics, productsUnderMinStock, products } = $derived(data);

	const todayDate = formatDate(new Date(), 'd MMMM yyyy');
	let isSubmitting = $state(false);

	async function handleUpdateInventory({ inventoryId, quantity }: { inventoryId: string; quantity: number }): Promise<{ success: boolean; error?: string }> {
		try {
			isSubmitting = true;
			
			const formData = new FormData();
			formData.append('inventoryId', inventoryId);
			formData.append('quantity', quantity.toString());

			try {
				const response = await fetch('?/updateInventory', {
					method: 'POST',
					headers: {
						'Accept': 'application/json'
					},
					body: formData
				});

				const result = await response.json();

				if (!response.ok) {
					if (result.error) {
						throw new Error(result.error);
					}
					throw new Error('Error al actualizar el inventario');
				}

				if (toastList && result.message) {
					toastList.addToast(result.message, 'success');
				}
				
				setTimeout(() => {
					window.location.reload();
				}, 1500);
				
				return { success: true };
			} catch (error) {
				console.error('Error en la petición:', error);
				throw error; 
			}
		} catch (error) {
			console.error('Error updating inventory:', error);
			const message = error instanceof Error ? error.message : 'failed to update inventory';
			
			if (toastList) {
				toastList.addToast(message, 'error');
			}
			
			return { success: false, error: message };
		} finally {
			isSubmitting = false;
		}
	}
</script>

<main
	class="space-y-6 "
	style="min-height: 100vh; background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	
	<ToastList bind:this={toastList} />
<PageHeader title={`Welcome ${userName}!`}>
	<div class="flex w-full flex-col items-center gap-4 md:flex-row py-1.5">
		<div class="mt-4 md:mt-0 flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-medium shadow transition-transform duration-200 hover:scale-105">
			<Icon icon="date" size={16} />
			{todayDate}
		</div>
	</div>
</PageHeader>
<section class="container mx-auto p-4 ">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
		{#each metrics as metric}
			<MetricCard {...metric} />
		{/each}
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		
		<FormManageinventory 
			{products} 
			onUpdate={handleUpdateInventory}
		/>
		

		<TopProductsTable products={productsUnderMinStock.map(p => ({
			...p,
			currentStock: p.currentStock || p.quantity || 0,
			minStock: p.minStock || 0,
			reorderQuantity: p.reorderQuantity || 0,
			warehouse: p.warehouse || p.location || 'N/A',
			name: p.name || p.productName || 'Unknown Product',
			sku: p.sku || p.productId || 'N/A'
		}))} />
	</div>
	</section>
</main>
