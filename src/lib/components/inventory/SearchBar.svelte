<script lang="ts">
  export let openDrawer: () => void;
</script>

<div class="flex justify-center mb-4">
  <div class="bg-white shadow-md rounded-xl px-6 py-3 flex items-center gap-4 w-auto max-w-full">

    <!-- Lupa + Input -->
    <div class="flex items-center flex-grow min-w-0 max-w-md">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" clip-rule="evenodd" />
      </svg>
      <input
        type="text"
        placeholder="Search by name, SKU..."
        class="w-full py-1.5 px-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>

    <!-- Botones -->
    <div class="flex gap-2 flex-shrink-0">
      <!-- Filter Icon Button -->
      <button class="flex items-center justify-center w-9 h-9 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition" aria-label="filter-btn">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="5" width="18" height="2" rx="1" />
          <rect x="5" y="11" width="14" height="2" rx="1" />
          <rect x="7" y="17" width="10" height="2" rx="1" />
        </svg>
      </button>

      <!-- Add Product Button -->
      <button
        on:click={openDrawer}
        class="font-semibold text-sm py-2 px-5 rounded-md shadow transition hover:brightness-95 hover:shadow-lg"
        style="
          color: white;
          text-shadow:
            -1px -1px 0 #B967DE,
            1px -1px 0 #B967DE,
            -1px 1px 0 #B967DE,
            1px 1px 0 #B967DE;
          background-image: linear-gradient(to right, #BFDBFE, #C7D2FE, #DDD6FE, #E9D5FF);
        "
      >
        + Add Product
      </button>
    </div>
  </div>
</div>
