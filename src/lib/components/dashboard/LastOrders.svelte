<script lang="ts">
	import { currency } from '$lib/components/helpers/currencies';

	export let orders: {
		id: string;
		product: string;
		quantity: number;
		total: number;
		status: string;
	}[] = [];

	let scrollContainer: HTMLDivElement;

	function scrollLeft() {
		scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
	}

	function scrollRight() {
		scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
	}

	function getStatusStyle(status: string) {
		switch (status.toLowerCase()) {
			case 'shipped':
				return 'bg-green-100 text-green-700';
			case 'pending':
				return 'bg-yellow-100 text-yellow-700';
			case 'cancelled':
				return 'bg-red-100 text-red-700';
			default:
				return 'bg-gray-100 text-gray-600';
		}
	}
</script>

<section class="mt-4 space-y-3 rounded-2xl bg-white p-4 shadow">
	<div class="flex items-center justify-between text-sm font-semibold text-gray-800">
		<div class="flex items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4 text-gray-500"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 17v-2h6v2H9zM4 7h16M4 11h16M4 15h16"
				/>
			</svg>
			<span>Last orders:</span>
		</div>
		<div class="flex gap-2">
			<button onclick={scrollLeft} class="rounded p-1 hover:bg-gray-100" aria-label="Scroll left">
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
					><path
						d="M15 18l-6-6 6-6"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/></svg
				>
			</button>
			<button onclick={scrollRight} class="rounded p-1 hover:bg-gray-100" aria-label="Scroll right">
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
					><path
						d="M9 6l6 6-6 6"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/></svg
				>
			</button>
		</div>
	</div>

	<div
		bind:this={scrollContainer}
		class="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth py-1"
	>
		{#each orders as order}
			<a
				href="#"
				class="flex min-w-fit transform cursor-pointer flex-nowrap items-center gap-2 rounded-xl bg-gray-50 px-4
                 py-2 text-sm text-gray-800 no-underline shadow-sm transition-transform duration-200
                 hover:scale-105 hover:shadow-md"
				title="Click to view order details"
			>
				<span class="font-semibold">{order.id}</span>
				<span class="text-gray-700">{order.product} ×{order.quantity}</span>
				<span class="font-medium text-gray-800">{order.total.toFixed(2)} {currency}</span>
				<span class={`rounded px-2 py-0.5 text-xs font-semibold ${getStatusStyle(order.status)}`}>
					{order.status}
				</span>
			</a>
		{/each}
	</div>
</section>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
