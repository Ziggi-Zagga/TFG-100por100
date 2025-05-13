<script lang="ts">
	export let search: string;
	export let placeholder: string = 'Search...';
</script>

<div class="flex justify-between items-center mb-6">
	<input
		type="text"
		bind:value={search}
		placeholder={placeholder}
		class="w-full max-w-md p-3 border border-gray-300 rounded-xl shadow-sm"
	/>	
</div>
