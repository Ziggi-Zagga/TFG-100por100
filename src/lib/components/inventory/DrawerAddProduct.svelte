<script lang="ts">
  import { fly } from 'svelte/transition';
  export let closeDrawer: () => void;
  export let createProduct: () => void;

  function handleKeyClose(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeDrawer();
    }
  }
</script>

<!-- accesibilidad -->
<div
  class="fixed inset-0 bg-black/30 z-40"
  on:click={closeDrawer}
  on:keydown={handleKeyClose}
  role="button"
  tabindex="0"
  aria-label="Close drawer"
></div>

<!-- Drawer animado -->
<div
  in:fly={{ x: 300, duration: 300 }}
  class="fixed top-0 right-0 w-full max-w-4xl h-full bg-white shadow-2xl p-10 rounded-l-3xl overflow-y-auto z-50 border-l border-blue-100"
>
  <h2 class="text-3xl font-bold text-blue-800 mb-8">➕ Add new Product</h2>

  <form class="grid grid-cols-1 md:grid-cols-2 gap-6" on:submit|preventDefault={createProduct}>
    <div>
      <label for="productName" class="block text-sm font-semibold text-gray-600 mb-1">Product Name</label>
      <input id="productName" type="text" placeholder="Enter product name"
        class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm" />
    </div>

    <div>
      <label for="sku" class="block text-sm font-semibold text-gray-600 mb-1">SKU (Code)</label>
      <input id="sku" type="text" placeholder="Enter SKU code"
        class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm" />
    </div>

    <div>
      <label for="category" class="block text-sm font-semibold text-gray-600 mb-1">Category</label>
      <select id="category"
        class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm bg-white">
        <option>Raw Material</option>
        <option>Machinery</option>
        <option>Consumables</option>
      </select>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="stock" class="block text-sm font-semibold text-gray-600 mb-1">Stock</label>
        <input id="stock" type="number" placeholder="Stock quantity"
          class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm" />
      </div>
      <div>
        <label for="price" class="block text-sm font-semibold text-gray-600 mb-1">Price (€)</label>
        <input id="price" type="number" placeholder="Price"
          class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm" />
      </div>
    </div>

    <div>
      <label for="supplier" class="block text-sm font-semibold text-gray-600 mb-1">Supplier</label>
      <input id="supplier" type="text" placeholder="Supplier name"
        class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm" />
    </div>

    <div>
      <label for="location" class="block text-sm font-semibold text-gray-600 mb-1">Location</label>
      <input id="location" type="text" placeholder="Warehouse location"
        class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm" />
    </div>

    <div class="md:col-span-2">
      <label for="description" class="block text-sm font-semibold text-gray-600 mb-1">Description</label>
      <textarea id="description" placeholder="Product description..."
        class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm h-24 resize-none"></textarea>
    </div>

    <div class="md:col-span-2 flex justify-end gap-4 mt-6">
      <button
        type="button"
        on:click={closeDrawer}
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-xl shadow-sm transition"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
      >
        Create
      </button>
    </div>
  </form>
</div>


