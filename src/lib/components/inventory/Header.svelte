<script lang="ts">
    export let totalProducts: number = 0;
  </script>
  
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl shadow-sm mb-6"
    style="
      background-image: 
        linear-gradient(to right, #BFDBFE, #C7D2FE, #DDD6FE, #E9D5FF),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0 4px, transparent 4px 24px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0 4px, transparent 4px 24px);
      background-blend-mode: overlay;
    "
    >
    <!-- Título + cantidad de productos -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-800">Inventory</h1>
      <p class="text-sm text-gray-700 mt-1">{totalProducts} Products</p>
    </div>
  
    <!-- Botones de acción -->
    <div class="flex flex-wrap gap-4">
        <button
          class="flex items-center gap-2 bg-white text-gray-800 border border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 font-semibold text-sm py-3 px-6 rounded-xl shadow transition duration-200"
        >
          Export CSV
        </button>
      
        <button
          class="flex items-center gap-2 bg-white text-gray-800 border border-gray-300 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 font-semibold text-sm py-3 px-6 rounded-xl shadow transition duration-200"
        >
          Export PDF
        </button>
      
        <button
          class="flex items-center gap-2 bg-white text-gray-800 border border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 font-semibold text-sm py-3 px-6 rounded-xl shadow transition duration-200"
        >
          Import Data
        </button>
      </div>
  </div>
  