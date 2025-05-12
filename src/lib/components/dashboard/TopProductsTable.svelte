<script lang="ts">
    export let products: { name: string; sku: string; sold: number; stock: number }[];
  </script>
  
  <div class="bg-gradient-to-br from-white via-purple-50 to-blue-100 rounded-2xl shadow-lg p-6">
    <h2 class="text-lg font-bold text-gray-800 mb-4">Top Selling Products</h2>
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-700">
        <thead>
          <tr class="bg-white/60 backdrop-blur-sm border-b border-purple-300">
            <th class="px-4 py-2 font-medium">Product</th>
            <th class="px-4 py-2 font-medium">SKU</th>
            <th class="px-4 py-2 font-medium">Units Sold</th>
            <th class="px-4 py-2 font-medium">Stock Left</th>
          </tr>
        </thead>
        <tbody>
          {#each products as product, i}
            <tr class={`transition-colors duration-200 border-b border-purple-200 ${i % 2 === 0 ? 'bg-white/40' : 'bg-white/20'} hover:bg-purple-100`}>
              <td class="px-4 py-2">{product.name}</td>
              <td class="px-4 py-2">{product.sku}</td>
              <td class="px-4 py-2">{product.sold}</td>
              <td class={`px-4 py-2 font-semibold ${product.stock === 0 ? 'text-red-500' : ''}`}>
                {product.stock}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  