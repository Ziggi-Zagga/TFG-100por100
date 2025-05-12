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
  class="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
