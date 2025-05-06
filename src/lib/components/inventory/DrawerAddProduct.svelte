<script lang="ts">
  import { fly } from 'svelte/transition';
  export let closeDrawer: () => void;
  export let createProduct: () => void;
</script>

<div class="fixed inset-0 bg-black/30 z-40" on:click={closeDrawer}></div>

<div
  in:fly={{ x: 300, duration: 300 }}
  class="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl p-8 flex flex-col gap-6 overflow-y-auto z-50"
>
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
