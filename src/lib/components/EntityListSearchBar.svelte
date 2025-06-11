<script lang="ts">
	export let search: string;
	export let searchPlaceholder: string = 'Search...';
	export let onSearchChange: (val: string) => void;
</script>

<input
	type="text"
	placeholder={searchPlaceholder}
	bind:value={search}
	on:input={() => onSearchChange(search)}
	class="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-1/2"
/>
