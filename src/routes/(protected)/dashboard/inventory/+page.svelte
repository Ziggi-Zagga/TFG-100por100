<script lang="ts">
  import { goto } from '$app/navigation';
  export let data;

  function goToDetails(id: number) {
    goto(`/dashboard/inventory/${id}`);
  }
</script>

<section class="p-8 flex justify-center">
  <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Inventory</h1>
      <button class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        + Add Product
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow">
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
              <td class="p-4">{item.code}</td>
              <td class="p-4">{item.name}</td>
              <td class="p-4">{item.category}</td>
              <td class="p-4">
                <span class={item.quantity < 25 ? 'text-red-500 font-bold' : ''}>
                  {item.quantity} units
                </span>
              </td>
              <td class="p-4">{item.supplier}</td>
              <td class="p-4">{item.location}</td>
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
</section>
