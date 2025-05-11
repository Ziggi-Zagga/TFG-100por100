<script lang="ts">
  import { goto } from '$app/navigation';

  export let data;

  import InventoryHeader from '$lib/components/utilities/Header/Header.svelte';
  import InventorySearchBar from '$lib/components/inventory/SearchBar.svelte';
  import ProductDrawer from '$lib/components/inventory/DrawerAddProduct.svelte';
  import Table from '$lib/components/utilities/table/Table.svelte';

  let showDrawer = false;
  let totalProducts = 10;

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
  <script lang="ts">
    import HeaderLayout from '$lib/components/layout/HeaderLayout.svelte';
    export let totalProducts: number = 0;
  </script>
  
  <InventoryHeader title="Inventory" subtitle="{totalProducts} Products">
    <!-- REEMPLAZAR LOS BOTONES MAS ADELANTE -->
    <button
      class="flex items-center gap-2 bg-white text-gray-800 border border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 font-semibold text-sm py-3 px-6 rounded-xl shadow transition duration-200"
    >
      Export CSV
    </button>
  
    <button
      class="flex items-center gap-2 bg-white text-gray-800 border border-gray-300 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 font-semibold text-sm py-3 px-6 rounded-xl shadow transition duration-200"
    >
      Export PDF
    </button>
  
    <button
      class="flex items-center gap-2 bg-white text-gray-800 border border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 font-semibold text-sm py-3 px-6 rounded-xl shadow transition duration-200"
    >
      Import Data
    </button>
  </InventoryHeader>
  
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
