<script lang="ts">
  import EntityListHeader from './EntityListHeader.svelte';
  import EntityListSearchBar from './EntityListSearchBar.svelte';

  export let title: string;
  export let columns: string[] = [];
  export let items: any[] = [];
  export let searchPlaceholder: string = 'Search...';
  export let onRowClick: (id: string) => void = () => {};

  let search = '';
  let showDrawer = false;

  function openDrawer() {
    showDrawer = true;
  }

  function closeDrawer() {
    showDrawer = false;
  }

  function handleSearchChange(value: string) {
    search = value;
  }

  const filteredItems = () =>
    items.filter((item) =>
      Object.values(item).some((val) =>
        (val?.toString()?.toLowerCase() ?? '').includes(search.toLowerCase())
      )
    );
</script>

<section class="p-8 bg-white w-full min-h-screen space-y-6">
  <EntityListHeader {title} onAdd={openDrawer} />
  <EntityListSearchBar {search} {searchPlaceholder} onSearchChange={handleSearchChange} />

  <div class="overflow-x-auto">
    <table class="w-full table-auto border border-gray-300 text-sm">
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          {#each columns as col}
            <th class="p-3 text-left font-semibold">{col}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each filteredItems() as item}
          <tr
            class="hover:bg-gray-50 cursor-pointer border-t"
            onclick={() => onRowClick(item.id)}
          >
            {#each columns as col}
              <td class="p-3 whitespace-nowrap">{item[col.toLowerCase()]}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if showDrawer}
    <div class="fixed inset-0 bg-black/30 z-40" onclick={closeDrawer}></div>
    <div class="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl p-8 flex flex-col gap-6 overflow-y-auto z-50">
      <slot name="drawerContent" {closeDrawer}></slot>
    </div>
  {/if}
</section>
