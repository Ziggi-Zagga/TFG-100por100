<script lang="ts">
  import MetricCard from "$lib/components/dashboard/MetricCard.svelte";
  import TopProductsTable from "$lib/components/dashboard/TopProductsTable.svelte";
  import WelcomeHeader from "$lib/components/dashboard/WelcomeCard.svelte";

  //DATOS 
  // TODOS LOS DATOS ESTAN HARDCODEADOS
  // pero son facilmente sustituibles no worries
  export let data;
  const { userName, unreadAlerts, today, metrics, topProducts, financeByMonth } = data;
  
  //Para medir la altura del grafico
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