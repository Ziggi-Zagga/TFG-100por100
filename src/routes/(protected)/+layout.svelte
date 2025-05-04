<script lang="ts">
  let { children } = $props();
  let collapsed = $state(false);

  function toggleSidebar() {
    collapsed = !collapsed;
  }
</script>

<!--
PARA AÑADIR UNO NUEVO COPIA ESTO Y SUSTITUYE LO QUE ESTA ENTRE []

<a href="[ENLACE]" class="flex items-center px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition">
          <img src="[IMAGEN]" class="w-8 h-8" alt="Logo" />
          {#if !collapsed}<span class="ml-3 text-sm font-medium">[TITULO]</span>{/if}
        </a>
-->

<div class="flex h-screen bg-gray-100 text-gray-800">
  <!-- Sidebar -->
  <aside class={`relative transition-all duration-300 ease-in-out rounded-2xl shadow-xl border-r border-gray-200 bg-white h-full flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>

    <!-- Header MAY12EURO-->
    <div class={`flex ${collapsed ? 'flex-col items-center py-4' : 'justify-between px-4 py-4'} `}>
      {#if collapsed}
        <button onclick={toggleSidebar} class="text-gray-600 hover:text-black mb-4">
          ☰
        </button>
        <img src="../logo/logo.png" class="w-8 h-8" alt="Logo" />
      {:else}
        <div class="flex items-center gap-2">
          <img src="../logo/logo.png" class="w-8 h-8" alt="Logo" />
          <span class="text-lg font-bold">NG Manager</span>
        </div>
        <button onclick={toggleSidebar} class="text-gray-600 hover:text-black">
          ☰
        </button>
      {/if}
    </div>

    <!-- Main Menu -->
    <div class="mt-4">
      <div class={`text-xs text-gray-400 px-4 uppercase tracking-wider ${collapsed ? 'hidden' : ''}`}>Main Menu</div>
      <nav class="mt-2 flex flex-col gap-1">
        <a href="/dashboard" class="flex items-center px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition">
          <img src="../icons/png/datos.png" class="w-8 h-8" alt="Logo" />
          {#if !collapsed}<span class="ml-3 text-sm font-medium">Dashboard</span>{/if}
        </a>
        
        <a href="/dashboard/inventory" class="flex items-center px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition">
          <img src="../icons/png/paquete.png" class="w-8 h-8" alt="Logo" />
          {#if !collapsed}<span class="ml-3 text-sm font-medium">Inventory</span>{/if}
        </a>
      </nav>
    </div>

    <!-- Settings -->
    <div class="mt-6">
      <div class={`text-xs text-gray-400 px-4 uppercase tracking-wider ${collapsed ? 'hidden' : ''}`}>Settings</div>
      <nav class="mt-2 flex flex-col gap-1">
        <a href="#" class="flex items-center px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition">
          <img src="../icons/png/output.png" class="w-8 h-8" alt="Logo" />
          {#if !collapsed}<span class="ml-3 text-sm font-medium">Users</span>{/if}
        </a>
        <a href="#" class="flex items-center px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition">
          <img src="../icons/png/ajuste.png" class="w-8 h-8" alt="Logo" />
          {#if !collapsed}<span class="ml-3 text-sm font-medium">Settings</span>{/if}
        </a>
      </nav>
    </div>

    <!-- Spacer -->
    <div class="flex-grow"></div>

    <!-- User Panel -->
    <div class="px-4 py-3 border-t border-gray-200 flex items-center gap-3">
      <img src="../logo/logo.png" alt="User" class="w-8 h-8 rounded-full" />
      {#if !collapsed}
        <div>
          <div class="text-sm font-semibold">User</div>
          <div class="text-xs text-gray-500">Admin</div>
        </div>
      {/if}
    </div>

    <!-- Logout -->
    <a href="../icons/png/salida-de-emergencia.png" class="mt-2 px-4 py-2 flex items-center text-black bg-indigo-200 hover:bg-indigo-300 transition">
      <img src="../icons/png/salida-de-emergencia.png" class="w-8 h-8" alt="Logo" />
      {#if !collapsed}<span class="ml-3 text-sm font-medium">Logout</span>{/if}
    </a>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 pl-2 rounded-2xl overflow-y-auto">
    {@render children()}
  </main>
</div>
