<!-- InventoryTable.svelte -->
<script lang="ts">
    export let items: any[];
    export let goToDetails: (id: number) => void;
  </script>
  
  <div class="overflow-x-auto">
    <table class="w-full table-auto border border-gray-300 text-sm">
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          <th class="p-3 text-left font-semibold">#</th>
          <th class="p-3 text-left font-semibold">Product</th>
          <th class="p-3 text-left font-semibold">Category</th>
          <th class="p-3 text-left font-semibold">Stock</th>
          <th class="p-3 text-left font-semibold">Supplier</th>
          <th class="p-3 text-left font-semibold">Location</th>
          <th class="p-3 text-center font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each items as item}
          <tr class="hover:bg-gray-50 cursor-pointer border-t" on:click={() => goToDetails(item.id)}>
            <td class="p-3 whitespace-nowrap">{item.code}</td>
            <td class="p-3 whitespace-nowrap">{item.name}</td>
            <td class="p-3 whitespace-nowrap">{item.category}</td>
            <td class="p-3 whitespace-nowrap">
              <span class={item.quantity < 25 ? 'text-red-500 font-bold' : ''}>{item.quantity} units</span>
            </td>
            <td class="p-3 whitespace-nowrap">{item.supplier}</td>
            <td class="p-3 whitespace-nowrap">{item.location}</td>
            <td class="p-3 flex justify-center gap-3" on:click|stopPropagation>
              <button class="text-blue-600 hover:text-blue-800">✏️</button>
              <button class="text-red-600 hover:text-red-800">🗑️</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  