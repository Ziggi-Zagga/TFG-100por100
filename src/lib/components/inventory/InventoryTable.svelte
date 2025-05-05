<script lang="ts">
    export let items: any[];
    export let goToDetails: (id: number) => void;
  </script>
  
  <!-- Esta es la "card" que envuelve solo la tabla -->
  <div class="bg-white shadow-md rounded-xl w-full max-h-[calc(100vh-250px)] overflow-y-auto">
  
    <table class="w-full table-auto text-sm text-gray-700">
      <thead class="sticky top-0 bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-800 z-10">
        <tr>
          <th class="p-4 text-left font-semibold">#</th>
          <th class="p-4 text-left font-semibold">Product</th>
          <th class="p-4 text-left font-semibold">Category</th>
          <th class="p-4 text-left font-semibold">Stock</th>
          <th class="p-4 text-left font-semibold">Supplier</th>
          <th class="p-4 text-left font-semibold">Location</th>
          <th class="p-4 text-center font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each items as item}
          <tr
            class="border-t hover:bg-gray-50 transition cursor-pointer"
            on:click={() => goToDetails(item.id)}
          >
            <td class="p-4 whitespace-nowrap text-gray-600">{item.code}</td>
            <td class="p-4 whitespace-nowrap font-medium text-gray-800">{item.name}</td>
            <td class="p-4 whitespace-nowrap">{item.category}</td>
            <td class="p-4 whitespace-nowrap">
              <span class={item.quantity < 25 ? 'text-red-500 font-semibold' : 'text-gray-700'}>
                {item.quantity} units
              </span>
            </td>
            <td class="p-4 whitespace-nowrap">{item.supplier}</td>
            <td class="p-4 whitespace-nowrap">{item.location}</td>
            <td class="p-4 whitespace-nowrap">
              <div class="flex justify-center gap-3" on:click|stopPropagation>
                <button class="text-blue-600 hover:text-blue-800 transition" title="Edit">✏️</button>
                <button class="text-red-600 hover:text-red-800 transition" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  