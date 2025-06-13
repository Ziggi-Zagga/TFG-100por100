<script lang="ts">
	import Icon from "../utilities/Icons/Icon.svelte";
	import { formatCurrency } from "../helpers/currencies";

	export let title: string;
	export let value: number | string;
	export let color: string;
	export let textColor: string = 'text-black';
	export let route: string;

	const formatValue = (val: number | string): string => {
		if (typeof val === 'string') return val;
		
		if (title.toLowerCase().includes('value')) {
			return formatCurrency(val, 0); 
		}

		return val.toLocaleString('es-ES');
	};
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
		<p class="text-2xl font-bold">{formatValue(value)}</p>
	</div>

	<div class="mt-1 flex items-center gap-1 text-sm font-medium opacity-70">
		<span>Details</span>
		<Icon icon="right" size={16} />
	</div>
</a>
