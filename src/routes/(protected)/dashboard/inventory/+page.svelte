<script lang="ts">
  import { goto } from '$app/navigation';
  export let data;

  function goToDetails(id: number) {
    goto(`/dashboard/inventory/${id}`);
  }
</script>

<section class="p-8 flex justify-center">
  <div class="flex flex-col lg:flex-row w-full max-w-7xl gap-8">
    
    <!-- MAIN CONTENT -->
    <div class="bg-white rounded-2xl shadow-2xl p-8 flex-1">
      
      <!-- Title -->
      <h1 class="text-2xl font-bold mb-2">Inventory</h1>

      <!-- Search and buttons -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <!-- Search bar -->
        <div class="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by name, SKU..."
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Buttons -->
        <div class="flex gap-4">
          <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md">
            Filter
          </button>
          <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
            + Add Product
          </button>
        </div>
      </div>

      <!-- Inventory table -->
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto bg-white border border-gray-300 rounded-lg overflow-hidden shadow">
          <thead class="bg-gray-100 text-gray-700">
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
            {#each data.items as item}
              <tr 
                class="hover:bg-gray-100 cursor-pointer transition border-t"
                on:click={() => goToDetails(item.id)}
              >
                <td class="p-4 whitespace-nowrap">{item.code}</td>
                <td class="p-4 whitespace-nowrap">{item.name}</td>
                <td class="p-4 whitespace-nowrap">{item.category}</td>
                <td class="p-4 whitespace-nowrap">
                  <span class={item.quantity < 25 ? 'text-red-500 font-bold' : ''}>
                    {item.quantity} units
                  </span>
                </td>
                <td class="p-4 whitespace-nowrap">{item.supplier}</td>
                <td class="p-4 whitespace-nowrap">{item.location}</td>
                <td class="p-4 flex justify-center gap-4" on:click|stopPropagation>
                  <button class="text-blue-600 hover:text-blue-800">
                    ✏️
                  </button>
                  <button class="text-red-600 hover:text-red-800">
                    🗑️
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- ACTION CARD -->
    <div class="w-full max-w-xs">
      <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4">
        <h2 class="text-lg font-semibold mb-2">Quick Actions</h2>
        
        <button class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md">
          Export to CSV
        </button>
        <button class="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md">
          Export to PDF
        </button>
        <button class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md">
          Import Data
        </button>
      </div>
    </div>

  </div>
</section>
