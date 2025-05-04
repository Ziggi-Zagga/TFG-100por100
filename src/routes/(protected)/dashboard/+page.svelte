<script lang="ts">
  import MetricCard from "$lib/components/dashboard/MetricCard.svelte";
  import TopProductsTable from "$lib/components/dashboard/TopProductsTable.svelte";
  import WelcomeHeader from "$lib/components/dashboard/WelcomeCard.svelte";

  // TODOS LOS DATOS ESTAN HARDCODEADOS
  // pero son facilmente sustituibles no worries

    const userName = "User";
    const unreadAlerts = 3;
    const today = new Date().toLocaleDateString("en-GB");

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

<main class="p-6 space-y-6" style="min-height: 100vh; background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
  
  <!-- Cabecera tipo bienvenida -->
  <WelcomeHeader userName={userName} unreadAlerts={unreadAlerts} date={today} />

  <!-- Métricas principales -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each metrics as metric}
      <MetricCard {...metric} />
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
    <TopProductsTable products={topProducts} />

  </div>  
</main>