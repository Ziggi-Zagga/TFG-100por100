<script lang="ts">
  import { goto } from '$app/navigation';

  export let data;

  import InventoryHeader from '$lib/components/inventory/Header.svelte';
  import InventorySearchBar from '$lib/components/inventory/SearchBar.svelte';
  import ProductDrawer from '$lib/components/inventory/DrawerAddProduct.svelte';
  import Table from '$lib/components/utilities/table/Table.svelte';

  let showDrawer = false;

  function goToDetails(id: number) {
    goto(`/dashboard/inventory/${id}`);
  }

  function openDrawer() {
    showDrawer = true;
  }

  function closeDrawer() {
    showDrawer = false;
  }
</script>

<section class="p-8 bg-white w-full min-h-screen" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
  <InventoryHeader />
  <InventorySearchBar {openDrawer} />
  <Table
  columns={['code', 'name', 'category', 'quantity', 'supplier', 'location']}
  items={data.items}
  onRowClick={goToDetails}
/>

  {#if showDrawer}
    <ProductDrawer
      {closeDrawer}
      availableProducts={data.safeAvailableProducts}
      locations={data.locations}
    />
  {/if}
</section>
