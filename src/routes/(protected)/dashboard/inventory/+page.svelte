<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  export let data;

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

<section class="p-8 bg-white w-full min-h-screen">
  <!-- HEADER & ACTIONS -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
    <!-- Title -->
    <h1 class="text-2xl font-bold">Inventory</h1>

    <!-- Action buttons -->
    <div class="flex flex-wrap gap-3 md:justify-end">
      <button class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md">
        Export to CSV
      </button>
      <button class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md">
        Export to PDF
      </button>
      <button class="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md">
        Import Data
      </button>
    </div>
  </div>

  <!-- SEARCH BAR -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
    <input
      type="text"
      placeholder="Search by name, SKU..."
      class="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div>
    <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md">
      Filter
    </button>
    <button
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
      on:click={openDrawer}
    >
      + Add Product
    </button>
    </div>
  </div>

  <!-- TABLE -->
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
        {#each data.items as item}
          <tr
            class="hover:bg-gray-50 cursor-pointer border-t"
            on:click={() => goToDetails(item.id)}
          >
            <td class="p-3 whitespace-nowrap">{item.code}</td>
            <td class="p-3 whitespace-nowrap">{item.name}</td>
            <td class="p-3 whitespace-nowrap">{item.category}</td>
            <td class="p-3 whitespace-nowrap">
              <span class={item.quantity < 25 ? 'text-red-500 font-bold' : ''}>
                {item.quantity} units
              </span>
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

  <!-- DRAWER -->
  {#if showDrawer}
    <div class="fixed inset-0 bg-black/30 z-40" on:click={closeDrawer}></div>
    <div class="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl p-8 flex flex-col gap-6 overflow-y-auto z-50">
      <h2 class="text-2xl font-bold mb-4">Create New Item</h2>

      <form class="flex flex-col gap-4" on:submit|preventDefault={createProduct}>
        <div>
          <label class="font-semibold">Product Name</label>
          <input type="text" placeholder="Enter product name" class="w-full p-2 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label class="font-semibold">SKU (Code)</label>
          <input type="text" placeholder="Enter SKU code" class="w-full p-2 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label class="font-semibold">Category</label>
          <select class="w-full p-2 border border-gray-300 rounded-md">
            <option>Raw Material</option>
            <option>Machinery</option>
            <option>Consumables</option>
          </select>
        </div>

        <div class="flex gap-4">
          <div class="w-1/2">
            <label class="font-semibold">Stock</label>
            <input type="number" placeholder="Stock quantity" class="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div class="w-1/2">
            <label class="font-semibold">Price (€)</label>
            <input type="number" placeholder="Price" class="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div>
          <label class="font-semibold">Supplier</label>
          <input type="text" placeholder="Supplier name" class="w-full p-2 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label class="font-semibold">Location</label>
          <input type="text" placeholder="Warehouse location" class="w-full p-2 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label class="font-semibold">Description</label>
          <textarea placeholder="Product description..." class="w-full p-2 border border-gray-300 rounded-md"></textarea>
        </div>

        <div class="flex gap-4 justify-end mt-4">
          <button 
            type="button"
            on:click={closeDrawer}
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-md"
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  {/if}
</section>
