<script lang="ts">
	export let search: string;
	export let placeholder: string = 'Search...';
</script>

<div>
	<input
		type="text"
		bind:value={search}
		placeholder={placeholder}
		class="w-full max-w-md p-3 border border-gray-300 rounded-xl shadow-sm"
	/>	
</div>
