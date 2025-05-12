<script lang="ts">
	export let title: string;
	export let totalCount: number = 0;
	export let countLabel: string = 'items';
</script>

<div
	class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl shadow-sm mb-6"
	style="
      background-image: 
        linear-gradient(to right, #BFDBFE, #C7D2FE, #DDD6FE, #E9D5FF),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0 4px, transparent 4px 24px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0 4px, transparent 4px 24px);
      background-blend-mode: overlay;
    "
>
	<div>
		<h1 class="text-2xl font-semibold text-gray-800">{title}</h1>
		<p class="text-sm text-gray-700 mt-1">{totalCount} {countLabel}</p>
	</div>

	<!-- Slot para botones -->
	<div class="flex flex-wrap gap-4 mt-4 md:mt-0">
		<slot />
	</div>
</div>
