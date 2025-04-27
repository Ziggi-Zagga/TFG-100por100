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
  <section class="p-8 flex justify-center">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-7xl min-h-[85vh]">
      <!-- Header -->
      <div class="flex justify-between items-center mb-10">
        <a href="/dashboard/inventory" class="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2">
          ← Back
        </a>
        <div class="flex gap-4">
          <button on:click={editProduct} class="text-yellow-500 hover:text-yellow-600 text-2xl">
            ✏️
          </button>
          <button on:click={deleteProduct} class="text-red-500 hover:text-red-600 text-2xl">
            🗑️
          </button>
        </div>
      </div>
  
      <!-- Content -->
      <div class="flex flex-col md:flex-row gap-16">
        <!-- Left: Image -->
        <div class="flex-shrink-0 w-full md:w-[30%] flex justify-center items-start">
          <img 
            src="https://via.placeholder.com/300x300.png?text=Product+Image" 
            alt="Product Image" 
            class="rounded-xl shadow-md w-full max-w-xs object-cover"
          />
        </div>
  
        <!-- Right: Details -->
        <div class="w-full md:w-[70%] flex flex-col gap-10 px-2">
          <!-- Name and Price -->
          <div>
            <h2 class="text-4xl font-bold mb-2 break-words">{product.name}</h2>
            <p class="text-gray-500 text-2xl">
              ${product.price !== null ? product.price.toFixed(2) : 'N/A'}
            </p>
          </div>
  
          <!-- Description -->
          <div>
            <h3 class="font-semibold text-gray-700 mb-2 text-lg">Description</h3>
            <p class="text-gray-600 leading-relaxed">{product.description ?? 'No description available.'}</p>
          </div>
  
          <!-- Grid of Attributes -->
          <div class="grid grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h4 class="font-semibold text-gray-700 mb-1">Unit</h4>
              <p class="text-gray-600">{product.unit ?? 'N/A'}</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-700 mb-1">Dimensions</h4>
              <p class="text-gray-600">{product.dimensions ?? 'N/A'}</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-700 mb-1">Material</h4>
              <p class="text-gray-600">{product.material ?? 'N/A'}</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-700 mb-1">Specifications</h4>
              <p class="text-gray-600">{product.specifications ?? 'N/A'}</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-700 mb-1">Active</h4>
              <p class="text-gray-600">{product.active ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-700 mb-1">SKU (Code)</h4>
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
  