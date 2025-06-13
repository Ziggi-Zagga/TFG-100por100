<script lang="ts">
	import MetricCard from '$lib/components/dashboard/MetricCard.svelte';
	import TopProductsTable from '$lib/components/dashboard/TopProductsTable.svelte';
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import { fade } from 'svelte/transition';
	import Icon from '$lib/components/utilities/Icons/Icon.svelte';
	import { formatDate } from '$lib/utils/dateFormat';

	export let data;
	const { userName, metrics, financeByMonth, productsUnderMinStock } = data;


	const maxFinanceValue = Math.max(...financeByMonth.map((m) => Math.max(m.revenue, m.expenses)));

	
	const todayDate = formatDate(new Date(), 'd MMMM yyyy');
</script>

<main
	class="space-y-6 "
	style="min-height: 100vh; background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
<PageHeader title={`Welcome ${userName}!`}>
	<div class="flex w-full flex-col items-center gap-4 md:flex-row py-1.5">
		<div class="mt-4 md:mt-0 flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-medium shadow transition-transform duration-200 hover:scale-105">
			<Icon icon="date" size={16} />
			{todayDate}
		</div>
	</div>
</PageHeader>
<section class="container mx-auto p-4 ">
	<!-- Métricas principales -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
		{#each metrics as metric}
			<MetricCard {...metric} />
		{/each}
	</div>

	<!-- Sección dividida: gráfico de ingresos/gastos y productos más vendidos -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Gráfico de ingresos vs gastos por mes -->
		<div class="rounded-2xl bg-white p-6 shadow">
			<h2 class="mb-4 text-lg font-semibold">Revenue vs Expenses (Monthly)</h2>
			<br />
			<div class="flex h-64 items-end gap-6">
				{#each financeByMonth as item}
					<div class="flex w-12 flex-col items-center">
						<div class="flex h-full items-end gap-1">
							<div
								class="w-4 rounded-t bg-indigo-300"
								style={`height: ${(item.revenue / maxFinanceValue) * 256}px`}
								title={`Revenue: $${item.revenue}`}
							></div>
							<div
								class="w-4 rounded-t bg-indigo-500"
								style={`height: ${(item.expenses / maxFinanceValue) * 256}px`}
								title={`Expenses: $${item.expenses}`}
							></div>
						</div>
						<div class="mt-1 text-xs text-gray-600">{item.month}</div>
					</div>
				{/each}
			</div>
			<div class="mt-4 flex justify-center gap-6 text-sm text-gray-600">
				<div class="flex items-center gap-1">
					<span class="inline-block h-2 w-4 rounded bg-indigo-300"></span> Revenue
				</div>
				<div class="flex items-center gap-1">
					<span class="inline-block h-2 w-4 rounded bg-indigo-500"></span> Expenses
				</div>
			</div>
		</div>

		<!-- Tabla de productos más vendidos -->
		<TopProductsTable products={productsUnderMinStock} />
	</div>
	</section>
</main>
