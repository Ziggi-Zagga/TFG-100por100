<script lang="ts">
	export let title: string;
	export let value: number;
	export let change: string;
	export let color: string;
	export let textColor: string = 'text-black';
	export let route: string;
</script>

<a
	href={route}
	class={`flex transform items-start justify-between rounded-2xl border border-white/20 
    p-4 no-underline shadow-md transition 
    hover:scale-105 hover:shadow-xl ${color} ${textColor}`}
	style="background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0 4px, transparent 4px 16px);"
>
	<div>
		<h2 class="text-sm font-semibold opacity-70">{title}</h2>
		<p class="text-3xl font-bold">{value}</p>
	</div>

	<div class="mt-1 flex items-center gap-1 text-sm font-medium opacity-70">
		<span>Details</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-4 w-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
		</svg>
	</div>
</a>
