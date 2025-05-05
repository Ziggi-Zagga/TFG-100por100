<script lang="ts">
  import { goto } from '$app/navigation';
  export let data;

  import InventoryHeader from '$lib/components/inventory/Header.svelte';
  import InventorySearchBar from '$lib/components/inventory/SearchBar.svelte';
  import InventoryTable from '$lib/components/inventory/InventoryTable.svelte';
  import ProductDrawer from '$lib/components/inventory/DrawerAddProduct.svelte';

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

  function createProduct() {
    alert('Product created (fake action for now).');
    closeDrawer();
  }
</script>

<section class="p-8 bg-white w-full min-h-screen" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
  <InventoryHeader />
  <InventorySearchBar {openDrawer} />
  <InventoryTable items={data.items} {goToDetails} />
  {#if showDrawer}
    <ProductDrawer {closeDrawer} {createProduct} />
  {/if}
</section>
