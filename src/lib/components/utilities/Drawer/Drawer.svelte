<<<<<<< HEAD
<script lang="ts">
	import { fly } from 'svelte/transition';
	export let title: string;
	export let onClose: () => void;

	function handleKeyClose(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>


<div
	class="fixed inset-0 bg-black/30 z-40"
	on:click={onClose}
	on:keydown={handleKeyClose}
	tabindex="0"
	role="button"
	aria-label="Close drawer"
></div>

<slot />
=======
// COMPONENTE NO MODIFICADO

// FALTA ASILAR Y CREAR SLOT

<script lang="ts">
  import { fly } from 'svelte/transition';

  export let closeDrawer: () => void;
  export let availableProducts: {
    id: number;
    name: string;
    code: string;
    category?: string;
    supplier?: string;
  }[];
  export let locations: { id: number; name: string }[];

  let selectedProductId: number;
  let selectedCategory = '';
  let selectedSupplier = '';

  function handleKeyClose(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeDrawer();
    }
  }

  function updateInfo(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    selectedProductId = id;
    const selected = availableProducts.find(p => p.id === id);
    selectedCategory = selected?.category ?? '';
    selectedSupplier = selected?.supplier ?? '';
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      action: 'create',
      data: {
        product_id: Number(formData.get('product_id')),
        location_id: Number(formData.get('location_id')),
        stock: Number(formData.get('stock'))
      }
    };

    const res = await fetch('/dashboard/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (result.success) {
      closeDrawer();
      window.location.reload();
    } else {
      alert('Error creating inventory item');
    }
  }
</script>

<!-- fondo -->
<div
  class="fixed inset-0 bg-black/30 z-40"
  onclick={closeDrawer}
  onkeydown={handleKeyClose}
  role="button"
  tabindex="0"
  aria-label="Close drawer"
></div>

<!-- drawer -->
<div
  in:fly={{ x: 300, duration: 300 }}
  class="fixed top-0 right-0 w-full max-w-4xl h-full bg-white shadow-2xl p-10 rounded-l-3xl overflow-y-auto z-50 border-l border-blue-100"
>
  <h2 class="text-3xl font-bold text-blue-800 mb-8">➕ Add new Product</h2>

  <form onsubmit={handleSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-6">

    <!-- Producto -->
    <div class="md:col-span-2">
      <label for="product_id" class="block text-sm font-semibold text-gray-600 mb-1">Select Product</label>
      <select name="product_id" id="product_id" onchange={updateInfo}
        class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm bg-white">
        <option disabled selected>Choose a product...</option>
        {#each availableProducts as product}
          <option value={product.id}>{product.name} ({product.code})</option>
        {/each}
      </select>
    </div>

    <!-- Info auto -->
    <div>
      <label class="block text-sm font-semibold text-gray-600 mb-1">Category</label>
      <input type="text" class="w-full p-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 shadow-sm" value={selectedCategory} disabled />
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-600 mb-1">Supplier</label>
      <input type="text" class="w-full p-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 shadow-sm" value={selectedSupplier} disabled />
    </div>

    <!-- Location seleccionable -->
    <div>
      <label for="location_id" class="block text-sm font-semibold text-gray-600 mb-1">Select Location</label>
      <select name="location_id" id="location_id"
        class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm bg-white">
        <option disabled selected>Choose a location...</option>
        {#each locations as location}
          <option value={location.id}>{location.name}</option>
        {/each}
      </select>
    </div>

    <!-- Stock manual -->
    <div>
      <label for="stock" class="block text-sm font-semibold text-gray-600 mb-1">Stock</label>
      <input id="stock" name="stock" type="number" placeholder="Stock quantity"
        class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm" />
    </div>

    <div class="md:col-span-2 flex justify-end gap-4 mt-6">
      <button
        type="button"
        onclick={closeDrawer}
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
>>>>>>> 36dd482fbb5c53c966ccbd33f435cff8a17e7a2f
