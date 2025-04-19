<script lang="ts">
    import { page } from '$app/stores';
    $: user = 'Usuario'; // Más adelante podemos cargar datos reales
  </script>
  
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Bienvenido, {user} 👋</h1>
  
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <a href="/tasks" class="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">📝 Tareas</h2>
        <p class="text-gray-500 text-sm">Gestiona tus tareas pendientes</p>
      </a>
      <a href="/issues" class="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">🚧 Incidencias</h2>
        <p class="text-gray-500 text-sm">Visualiza y reporta problemas</p>
      </a>
      <a href="/inventory" class="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">📦 Inventario</h2>
        <p class="text-gray-500 text-sm">Consulta el estado del stock</p>
      </a>
    </div>
  </div>
  