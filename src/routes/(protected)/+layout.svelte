<script lang="ts">
    import { onMount } from 'svelte';
    let { children } = $props();
    let collapsed = $state(false);

  
    function toggleSidebar() {
      collapsed = !collapsed;
    }
  </script>
  
  <div class="flex h-screen bg-gray-100 text-gray-800">
    <!-- Sidebar -->
    <aside class={`transition-all duration-300 rounded-2xl bg-white shadow-md h-full ${collapsed ? 'w-16' : 'w-64'}`}>
      <div class="flex items-center justify-between px-4 py-4">
        <div class="flex items-center gap-2">
          <img src="../logo/logo.png" class="w-8 h-8" alt="Logo" />
          {#if !collapsed}
            <span class="text-lg font-bold">NG Manager</span>
          {/if}
        </div>
        <button onclick={toggleSidebar} class="text-gray-600 hover:text-black">
          ☰
        </button>
      </div>
  
      <nav class="mt-4 flex flex-col gap-1">
        <a href="/dashboard" class="flex items-center px-4 py-2 hover:bg-blue-100">
            <img src="../logo/logo.png" class="w-8 h-8" alt="Logo" />
          {#if !collapsed}<span class="ml-3">Dashboard</span>{/if}
        </a>
        <a href="/dashboard/inventory" class="flex items-center px-4 py-2 hover:bg-blue-100">
        <img src="../logo/logo.png" class="w-8 h-8" alt="Logo" />
          {#if !collapsed}<span class="ml-3">Inventory</span>{/if}
        </a>
  
        <hr class="my-2 border-gray-300" />
  
        <a href="#" class="flex items-center px-4 py-2 hover:bg-blue-100">
          <span class="material-icons">group</span>
          {#if !collapsed}<span class="ml-3">Users</span>{/if}
        </a>
  
        <a href="#" class="flex items-center px-4 py-2 hover:bg-blue-100">
          <span class="material-icons">settings</span>
          {#if !collapsed}<span class="ml-3">Settings</span>{/if}
        </a>
  
        <hr class="my-2 border-gray-300" />

  
        <a href="#" class="mt-auto px-4 py-2 flex items-center text-white bg-red-500 hover:bg-red-600">
          <span class="material-icons">logout</span>
          {#if !collapsed}<span class="ml-3">Logout</span>{/if}
        </a>
      </nav>
    </aside>
  
    <!-- Main Content -->
    <main class="flex-1 pl-2 rounded-2xl overflow-y-auto">
      {@render children()}
    </main>
  </div>
  