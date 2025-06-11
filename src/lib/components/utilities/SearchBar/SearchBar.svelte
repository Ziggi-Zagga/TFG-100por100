<script lang="ts">
	let { search = $bindable<string>(), placeholder = 'Search...', extraClasses = '' } = $props();
</script>

<div class="flex w-full items-center justify-between">
	<input
		type="text"
		bind:value={search}
		{placeholder}
		class="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none {extraClasses}"
	/>
</div>
