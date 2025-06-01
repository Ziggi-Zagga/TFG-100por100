<script lang="ts">
  import { fly, fade, scale, slide } from 'svelte/transition';
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import type { AuthUser } from '$lib/types/auth.types';
  import Icon from '$lib/components/utilities/Icons/Icon.svelte';
  import { cubicOut } from 'svelte/easing';
  
  // Estado para controlar cuando la animación de apertura ha terminado
  let isSidebarOpen = $state(true);
  let isTransitioning = $state(false);
  let openInventoryMenu = $state(false);
  let inventoryMenuRef: HTMLElement;
  
  // Función para verificar si una ruta está activa
  function isActive(href: string) {
    // Si es la ruta de inventory, verificar todas las subrutas relacionadas
    if (href === '/dashboard/inventory') {
      return [
        '/dashboard/inventory',
        '/dashboard/products',
        '/dashboard/categories'
      ].some(route => $page.url.pathname.startsWith(route));
    }
    return $page.url.pathname.startsWith(href);
  }
  
  // Función para verificar si un ítem del submenú está activo
  function isSubmenuActive(href: string) {
    return $page.url.pathname === href || 
           ($page.url.pathname.startsWith(href) && href !== '/dashboard/inventory');
  }

  const { data, children } = $props<{
    data: {
      user: AuthUser;
    };
    children: any;
  }>();
  let collapsed = $state(false);
  // Toggle sidebar with animation control
  async function toggleSidebar() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    if (!collapsed) {
      // Si se está cerrando, ocultar el texto primero
      isSidebarOpen = false;
      // Esperar a que termine la animación de desvanecimiento
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    collapsed = !collapsed;
    
    if (!collapsed) {
      // Si se está abriendo, esperar a que el menú se expanda antes de mostrar el texto
      await new Promise(resolve => setTimeout(resolve, 300));
      isSidebarOpen = true;
    }
    
    isTransitioning = false;
  }
  
  
  function toggleInventoryMenu(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    
    if (collapsed) {
      toggleSidebar().then(() => {
        openInventoryMenu = true;
      });
    } else {
      openInventoryMenu = !openInventoryMenu;
    }
  }
  
  // Cerrar menú al hacer clic fuera, pero no en los enlaces del menú
  function handleClickOutside(event: MouseEvent) {
    if (typeof window === 'undefined') return; // No ejecutar en el servidor
    
    if (inventoryMenuRef) {
      // Verificar si el clic fue en un enlace dentro del menú
      const target = event.target as HTMLElement;
      const isClickOnMenuLink = target.closest ? 
        target.closest('a[href^="/dashboard/inventory"], a[href^="/dashboard/products"], a[href^="/dashboard/categories"]') : 
        null;
      
      // Solo cerrar si el clic no fue en un enlace del menú
      if (!isClickOnMenuLink && inventoryMenuRef && !inventoryMenuRef.contains(target)) {
        openInventoryMenu = false;
      }
    }
  }
  
  // Cerrar menú solo cuando se navega fuera de las rutas de inventario
  const unsubscribe = page.subscribe(($page) => {
    const currentPath = $page.url.pathname;
    const isInventoryRoute = [
      '/dashboard/inventory',
      '/dashboard/products',
      '/dashboard/categories'
    ].some(route => currentPath.startsWith(route));
    
    if (!isInventoryRoute) {
      openInventoryMenu = false;
    }
  });
  
  // Limpiar eventos al desmontar
  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', handleClickOutside);
    }
    unsubscribe();
  });
  
  // Agregar evento de clic fuera del menú solo en el navegador
  import { browser } from '$app/environment';
  
  onMount(() => {
    if (browser) {
      // Usamos setTimeout para asegurarnos de que el menú se cierre después de la navegación
      setTimeout(() => {
        if (typeof document !== 'undefined') {
          document.addEventListener('click', handleClickOutside);
        }
      }, 0);
    }
  });

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
  <aside 
    class="relative rounded-2xl shadow-xl border-r border-gray-200 bg-white h-full flex flex-col overflow-hidden"
    style={`width: ${collapsed ? '4.5rem' : '14rem'}; transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);`}
  >
    <!-- Header con logo y título que funciona como botón de menú -->
    <div class="px-4 py-4">
      <div 
        onclick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSidebar(); }}
        class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-lg mt-2 -ml-2"
      >
        <div class="w-12 h-15 flex-shrink-0 flex items-center justify-center">
          <img 
            src="/logo/logo.png" 
            class="w-13 h-16 object-contain " 
            alt="Logo"
            style="transition: none;"
          />
        </div>
        <span 
          class="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis"
          in:fade={{ duration: 200 }}
          out:fade={{ duration: 100 }}
          style="opacity: {isSidebarOpen ? 1 : 0}; transition: opacity 200ms ease-out;"
        >
          NG Manager
        </span>
      </div>
    </div>

    <!-- Contenedor principal del menú con scroll -->
    <div class="flex-1 overflow-y-auto">
      <!-- Main Menu -->
      <div class="mt-2">
        <div 
          class="text-xs text-gray-400 px-4 uppercase tracking-wider overflow-hidden"
          in:slide={{ duration: 300, delay: 150, easing: cubicOut }}
          out:slide={{ duration: 200, easing: cubicOut }}
          style="display: {!collapsed ? 'block' : 'none'}"
        >
        
        </div>
        <nav class="flex flex-col gap-1">
          <!-- Dashboard -->
          <a 
            href="/dashboard"
            class={`flex items-center px-4 py-2 rounded-md transition cursor-pointer ${$page.url.pathname === '/dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`}
          >
            <img src="/icons/svg/dashboard.svg" class="w-8 h-8" alt="Dashboard" />
            {#if !collapsed}<span class="ml-3 text-sm font-medium">Dashboard</span>{/if}
          </a>

          <!-- Menú de Inventory -->
          <div bind:this={inventoryMenuRef} class="relative">
            <button 
              type="button"
              class={`flex items-center justify-between w-full px-4 py-2 rounded-md transition cursor-pointer ${isActive('/dashboard/inventory') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`}
              onclick={toggleInventoryMenu}
              aria-expanded={openInventoryMenu}
              aria-controls="inventory-submenu"
            >
              <div class="flex items-center">
                <img src="/icons/svg/box.svg" class="w-8 h-8" alt="Storage" />
                {#if !collapsed}<span class="ml-3 text-sm font-medium">Storage</span>{/if}
              </div>
              {#if !collapsed}
                <div class:rotate-90={openInventoryMenu} class="transition-transform">
                  <Icon icon="right" size={16} />
                </div>
              {/if}
            </button>
            
            <!-- Submenú desplegable -->
            {#if openInventoryMenu && !collapsed}
              <div id="inventory-submenu" class="ml-8 mt-1 space-y-1">
                <a 
                  href="/dashboard/inventory" 
                  class="flex items-center px-4 py-2 text-sm rounded-md transition hover:bg-blue-200 hover:text-blue-900"
                  class:bg-blue-200={isSubmenuActive('/dashboard/inventory')}
                  class:text-blue-900={isSubmenuActive('/dashboard/inventory')}
                  
                >
                  <span class="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
                  <span>Inventory</span>
                </a>
                <a 
                  href="/dashboard/products" 
                  class="flex items-center px-4 py-2 text-sm rounded-md transition hover:bg-blue-200 hover:text-blue-900"
                  class:bg-blue-200={isSubmenuActive('/dashboard/products')}
                  class:text-blue-900={isSubmenuActive('/dashboard/products')}
                >
                  <span class="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
                  <span>Products</span>
                </a>
                <a 
                  href="/dashboard/categories" 
                  class="flex items-center px-4 py-2 text-sm rounded-md transition hover:bg-blue-200 hover:text-blue-900"
                  class:bg-blue-200={isSubmenuActive('/dashboard/categories')}
                  class:text-blue-900={isSubmenuActive('/dashboard/categories')}
                >
                  <span class="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
                  <span>Categories</span>
                </a>
              </div>
            {/if}
          </div>

          <!-- Suppliers -->
          <a href="/dashboard/suppliers" class={`flex items-center px-4 py-2 rounded-md transition ${isActive('/dashboard/suppliers') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`} aria-current={isActive('/dashboard/suppliers') ? 'page' : undefined}>
            <img src="/icons/svg/suppliers.svg" class="w-8 h-8" alt="Suppliers" />
            {#if !collapsed}<span class="ml-3 text-sm font-medium">Suppliers</span>{/if}
          </a>

          <!-- Orders (enlace directo) -->
          <a href="/dashboard/orders/ordersList" class={`flex items-center px-4 py-2 rounded-md transition ${isActive('/dashboard/orders') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`} aria-current={isActive('/dashboard/orders') ? 'page' : undefined}>
            <img src="/icons/svg/orders.svg" class="w-8 h-8" alt="Orders" />
            {#if !collapsed}<span class="ml-3 text-sm font-medium">Orders</span>{/if}
          </a>

          <a href="/dashboard/warehouses" class={`flex items-center px-4 py-2 rounded-md transition ${isActive('/dashboard/warehouse') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`} aria-current={isActive('/dashboard/warehouse') ? 'page' : undefined}>
            <img src="/icons/svg/warehouse.svg" class="w-8 h-8" alt="warehouse" />
            {#if !collapsed}<span class="ml-3 text-sm font-medium">warehouse</span>{/if}
          </a>
        </nav>
      </div>
    </div>

    <!-- Sección fija en la parte inferior -->
    <div class="mt-auto border-t border-gray-200">
      <!-- Settings -->
      <div class="py-2">
        <!--
        <div class={`text-xs text-gray-400 px-4 uppercase tracking-wider ${collapsed ? 'hidden' : ''}`}>Settings</div>
        -->
        <nav class="mt-1 flex flex-col gap-1">
          <a href="/dashboard/users" class={`flex items-center px-4 py-2 rounded-md transition ${isActive('/dashboard/users') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`} aria-current={isActive('/dashboard/users') ? 'page' : undefined}>
            <img src="/icons/svg/users.svg" class="w-8 h-8" alt="Users" />
            {#if !collapsed}<span class="ml-3 text-sm font-medium">Users</span>{/if}
          </a>
          <!--
          <a href="/dashboard/settings" class={`flex items-center px-4 py-2 rounded-md transition ${isActive('/dashboard/settings') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`} aria-current={isActive('/dashboard/settings') ? 'page' : undefined}>
            <img src="/icons/png/ajuste.png" class="w-8 h-8" alt="Settings" />
            {#if !collapsed}<span class="ml-3 text-sm font-medium">Settings</span>{/if}
          </a>
          -->
        </nav>
      </div>

      

      <!-- Logout -->
      <form method="POST" action="/logout" class="w-full">
        <button type="submit" class="px-4 py-2 w-full flex items-center text-black hover:bg-blue-100 hover:text-blue-700 transition">
          <img src="/icons/svg/logout.svg" class="w-8 h-8" alt="Logout" />
          {#if !collapsed}<span class="ml-3 text-sm font-medium">Logout</span>{/if}
        </button>
      </form>
    </div>
    
  </aside>

  <!-- Main Content -->
  <main class="flex-1 pl-2 rounded-2xl overflow-y-auto">
    {@render children()}
  </main>
</div>
