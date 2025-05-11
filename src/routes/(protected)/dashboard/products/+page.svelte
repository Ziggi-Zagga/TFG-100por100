<script lang="ts">
    import { goto } from '$app/navigation';
    export let data;
  
    import InventoryHeader from '$lib/components/utilities/Header/Header.svelte';
    import Table from '$lib/components/utilities/table/Table.svelte';
  
    const columns = ['code', 'name', 'price', 'unit', 'active'];
    export let totalProducts: number = 0;

    function handleRowClick(id: number) {
        goto(`/products/${id}`);
    }
</script>
  
<section class="p-8 bg-white w-full min-h-screen" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
    
    <InventoryHeader title="Products" subtitle="{totalProducts} Products">
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

    <Table
        {columns}
        items={data.products}
        onRowClick={handleRowClick}
    />
  </section>
  