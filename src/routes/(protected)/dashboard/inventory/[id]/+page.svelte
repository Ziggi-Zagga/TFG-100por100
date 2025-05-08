<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  export let data;
  let id: string;
  let product = data.product;

  onMount(() => {
    id = get(page).params.id;
  });

  function editProduct() {
    alert(`Edit product with ID: ${id}`);
  }

  function deleteProduct() {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      alert(`Product with ID: ${id} deleted (fake action for now).`);
    }
  }
</script>

{#if product}
<section class="p-8 flex justify-center bg-gradient-to-br from-[#f1f5ff] to-[#edf7ff] min-h-screen">
  <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8 border-b pb-4">
      <a href="/dashboard/inventory" class="text-indigo-600 hover:text-indigo-800 font-semibold text-lg flex items-center gap-2">
        ← Back to Inventory
      </a>
      <div class="flex gap-4">
        <button on:click={editProduct} class="hover:scale-110 transition text-yellow-500 hover:text-yellow-600 text-2xl">
          ✏️
        </button>
        <button on:click={deleteProduct} class="hover:scale-110 transition text-red-500 hover:text-red-600 text-2xl">
          🗑️
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col md:flex-row gap-12">
      <!-- Image -->
      <div class="w-full md:w-[35%] flex justify-center">
        <div class="rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-indigo-100 to-indigo-200 p-2">
          <img 
            src="https://via.placeholder.com/300x300.png?text=Product+Image" 
            alt="Product Image" 
            class="rounded-lg w-full object-cover"
          />
        </div>
      </div>

      <!-- Details -->
      <div class="w-full md:w-[65%] flex flex-col gap-6">
        <div>
          <h2 class="text-4xl font-bold text-gray-800">{product.name}</h2>
          <p class="text-indigo-600 text-2xl mt-1">${product.price?.toFixed(2) ?? 'N/A'}</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-700 mb-1">Description</h3>
          <p class="text-gray-600">{product.description ?? 'No description available.'}</p>
        </div>

        <div class="grid grid-cols-2 gap-6 mt-4 text-sm sm:text-base">
          <div class="bg-indigo-50 rounded-xl p-4">
            <h4 class="font-semibold text-gray-700">Unit</h4>
            <p class="text-gray-600">{product.unit ?? 'N/A'}</p>
          </div>
          <div class="bg-indigo-50 rounded-xl p-4">
            <h4 class="font-semibold text-gray-700">Dimensions</h4>
            <p class="text-gray-600">{product.dimensions ?? 'N/A'}</p>
          </div>
          <div class="bg-indigo-50 rounded-xl p-4">
            <h4 class="font-semibold text-gray-700">Material</h4>
            <p class="text-gray-600">{product.material ?? 'N/A'}</p>
          </div>
          <div class="bg-indigo-50 rounded-xl p-4">
            <h4 class="font-semibold text-gray-700">Specifications</h4>
            <p class="text-gray-600">{product.specifications ?? 'N/A'}</p>
          </div>
          <div class="bg-indigo-50 rounded-xl p-4">
            <h4 class="font-semibold text-gray-700">Active</h4>
            <p class="text-gray-600">{product.active ? 'Yes' : 'No'}</p>
          </div>
          <div class="bg-indigo-50 rounded-xl p-4">
            <h4 class="font-semibold text-gray-700">SKU (Code)</h4>
            <p class="text-gray-600 uppercase">{product.code}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{:else}
<p class="text-center text-red-500 mt-8">Error: Product not found.</p>
{/if}
