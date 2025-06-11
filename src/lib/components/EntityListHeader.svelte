<script lang="ts">
	export let title: string;
	export let onAdd: () => void;
</script>

<div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
	<h1 class="text-2xl font-bold">{title}</h1>

	<div class="flex flex-wrap gap-3 md:justify-end">
		<button
			class="rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-600"
			on:click={onAdd}
		>
			+ Add
		</button>
	</div>
</div>
