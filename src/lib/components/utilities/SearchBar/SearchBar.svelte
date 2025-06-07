<script lang="ts">
	let { 
		search = $bindable<string>(), 
		placeholder = 'Search...',
		extraClasses = '' 
	} = $props();
</script>

<div class="flex justify-between items-center w-full">
	<input
		type="text"
		bind:value={search}
		placeholder={placeholder}
		class="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent {extraClasses}"
	/>
</div>
