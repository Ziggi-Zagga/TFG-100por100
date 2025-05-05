<script lang="ts">
    export let openDrawer: () => void;
  </script>
  
  <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
    <input
      type="text"
      placeholder="Search by name, SKU..."
      class="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div>
      <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md">Filter</button>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        on:click={openDrawer}
      >
        + Add Product
      </button>
    </div>
  </div>