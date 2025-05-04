<script lang="ts">
    const metrics = [
      { title: "Total Incidents", value: 1204, change: "5.2%", color: "bg-blue-200" },
      { title: "Resolved Incidents", value: 984, change: "4.7%", color: "bg-indigo-200" },
      { title: "Products in Stock", value: 3210, change: "1.1%", color: "bg-violet-200" },
      { title: "Pending Reviews", value: 75, change: "-2.5%", color: "bg-purple-200" },
    ];

    const topProducts = [
      { name: "Product A", sku: "A123", sold: 1200, stock: 30 },
      { name: "Product B", sku: "B456", sold: 950, stock: 12 },
      { name: "Product C", sku: "C789", sold: 860, stock: 0 },
    ];

    const stockChart = [
      { month: "Jan", stock: 300, incidents: 45 },
      { month: "Feb", stock: 280, incidents: 50 },
      { month: "Mar", stock: 310, incidents: 32 },
      { month: "Apr", stock: 290, incidents: 29 },
    ];

    const financeByMonth = [
      { month: "Jan", revenue: 4500, expenses: 3900 },
      { month: "Feb", revenue: 2200, expenses: 3400 },
      { month: "Mar", revenue: 5500, expenses: 4800 },
      { month: "Apr", revenue: 2100, expenses: 1500 },
      { month: "May", revenue: 3200, expenses: 1700 },
    ];

    const maxFinanceValue = Math.max(...financeByMonth.map(m => Math.max(m.revenue, m.expenses)));
</script>

<main class="p-6 space-y-6">
  <!-- Cabecera tipo bienvenida -->
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-sky-100 p-6 rounded-2xl shadow-sm">
      <div>
      <h2 class="text-2xl font-semibold">Welcome User</h2>
      <p class="text-sm text-gray-600">
          Have a productive Day! You have 
          <a href="#" class="text-indigo-600 underline">3 unread alerts</a>!
      </p>
      </div>
      <div class="mt-4 md:mt-0">
      <button class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 2a1 1 0 012 0v1h4V2a1 1 0 112 0v1h1a2 2 0 012 2v1H3V5a2 2 0 012-2h1V2zM3 8h14v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 100 2h4a1 1 0 100-2H8z"/>
          </svg>
          Today (04/05/2025)
      </button>
      </div>
  </div>

  <!-- Métricas principales -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each metrics as metric}
      <div class={`p-4 rounded-2xl shadow ${metric.color}`}>
        <h2 class="text-sm text-gray-700">{metric.title}</h2>
        <p class="text-2xl font-bold">{metric.value}</p>
        <p class="text-xs text-gray-600">Change: {metric.change}</p>
      </div>
    {/each}
  </div>

  <!-- Sección dividida: gráfico de ingresos/gastos y productos más vendidos -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Gráfico de ingresos vs gastos por mes -->
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Revenue vs Expenses (Monthly)</h2><br/>
      <div class="flex items-end gap-6 h-64">
        {#each financeByMonth as item}
          <div class="flex flex-col items-center w-12">
            <div class="flex gap-1 items-end h-full">
              <div class="w-4 bg-indigo-300 rounded-t" style={`height: ${(item.revenue / maxFinanceValue) * 256}px`} title={`Revenue: $${item.revenue}`}></div>
              <div class="w-4 bg-indigo-500 rounded-t" style={`height: ${(item.expenses / maxFinanceValue) * 256}px`} title={`Expenses: $${item.expenses}`}></div>
            </div>
            <div class="text-xs mt-1 text-gray-600">{item.month}</div>
          </div>
        {/each}
      </div>
      <div class="mt-4 flex justify-center gap-6 text-sm text-gray-600">
        <div class="flex items-center gap-1"><span class="w-4 h-2 bg-indigo-300 inline-block rounded"></span> Revenue</div>
        <div class="flex items-center gap-1"><span class="w-4 h-2 bg-indigo-500 inline-block rounded"></span> Expenses</div>
      </div>
    </div>

    <!-- Tabla de productos más vendidos -->
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
          {#each topProducts as product, i}
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
  </div>  

  <!-- Gráfico de stock/incidencias -->
  <div class="bg-white rounded-2xl shadow p-6">
    <h2 class="text-lg font-semibold mb-4">Monthly Stock vs Incidents</h2>
    <div class="grid grid-cols-5 gap-4 text-sm text-center">
      {#each stockChart as item}
        <div>
          <div class="mb-2 text-gray-500">{item.month}</div>
          <div class="h-20 bg-blue-400 rounded" style={`height: ${item.stock / 5}px`} title={`Stock: ${item.stock}`}></div>
          <div class="h-20 bg-red-400 rounded mt-1" style={`height: ${item.incidents * 2}px`} title={`Incidents: ${item.incidents}`}></div>
        </div>
      {/each}
    </div>
    <div class="mt-4 flex justify-center gap-6 text-sm text-gray-600">
      <div class="flex items-center gap-1"><span class="w-4 h-2 bg-blue-400 inline-block rounded"></span> Stock</div>
      <div class="flex items-center gap-1"><span class="w-4 h-2 bg-red-400 inline-block rounded"></span> Incidents</div>
    </div>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);
  }
</style>
