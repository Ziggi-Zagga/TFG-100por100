<script lang="ts">
    export let products: { name: string; sku: string; sold: number; stock: number }[];
  </script>
  
  <div class="bg-white rounded-2xl shadow p-6">
    <h2 class="text-lg font-semibold mb-4">Top Selling Products</h2>
    <table class="w-full table-auto text-sm">
      <thead>
        <tr class="text-left text-gray-500 border-b">
          <th class="pb-2">Product</th>
          <th class="pb-2">SKU</th>
          <th class="pb-2">Units Sold</th>
          <th class="pb-2">Stock Left</th>
        </tr>
      </thead>
      <tbody>
        {#each products as product, i}
          <tr class={`border-b hover:bg-gray-50 ${i % 2 === 0 ? 'bg-gray-50' : ''}`}>
            <td class="py-2">{product.name}</td>
            <td>{product.sku}</td>
            <td>{product.sold}</td>
            <td class={product.stock === 0 ? 'text-red-500' : ''}>{product.stock}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  