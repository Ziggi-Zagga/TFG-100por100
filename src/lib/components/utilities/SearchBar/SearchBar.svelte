<script lang="ts">
	export let search: string;
	export let placeholder: string = 'Search...';
	export let buttonText: string = '+ Add';
	export let openDrawer: () => void;
</script>

<div class="flex justify-between items-center mb-6">
	<input
		type="text"
		bind:value={search}
		placeholder={placeholder}
		class="w-full max-w-md p-3 border border-gray-300 rounded-xl shadow-sm"
	/>

	<button
		type="button"
		on:click={openDrawer}
		class="ml-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md"
	>
		{buttonText}
	</button>
</div>
