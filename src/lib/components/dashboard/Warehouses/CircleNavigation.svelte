<script lang="ts">
    // Estado interno de animación
    let isAnimating = $state(false);
    let animatingElement = $state<HTMLElement | null>(null);
    const animationDuration = 300;

    // Props
    let { 
        currentView = 'warehouses',
        search = '',
        getLineWidth = () => 0,
        getCircleStyles = () => '',
        getIconStyles = () => '',
        getCircleClickability = () => '',
        getCircleTitle = () => '',
        getCircleClickHandler = () => undefined,
        getSearchPlaceholder = () => '',
        getAddButtonText = () => '',
        onSearchChange = () => {},
        onAddClick = () => {},
    } = $props();
    
    // Eventos
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher<{
      navigate: { view: string };
      search: { value: string };
      add: void;
    }>();

    // Manejadores de eventos
    function handleCircleClick(circleView: string, handler: (() => void) | undefined, event: MouseEvent) {
      if (isAnimating || !handler) return;
      
      // Iniciar animación
      isAnimating = true;
      animatingElement = event.currentTarget as HTMLElement;
      
      // Ejecutar el manejador después de un pequeño retraso para permitir la animación
      setTimeout(() => {
        handler();
        dispatch('navigate', { view: circleView });
        
        // Restablecer la animación después de completar
        setTimeout(() => {
          isAnimating = false;
          if (animatingElement) {
            animatingElement.style.opacity = '1';
            animatingElement = null;
          }
        }, animationDuration);
      }, 50);
    }

    function handleSearch(event: Event) {
      onSearchChange(event);
      const target = event.target as HTMLInputElement;
      dispatch('search', { value: target.value });
    }
  
    function handleAdd() {
      if (isAnimating) return;
      onAddClick();
      dispatch('add');
    }
  </script>
  
  <div class="h-22 bg-white border-b-2 border-gray-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] z-50 transform transition-all duration-500 ease-in-out">
    <div class="relative h-full flex items-center justify-between px-8">
      <!-- Contenedor de círculos conectados -->
      <div class="flex items-center relative">
        <!-- Línea conectora animada dinámicamente -->
        <div 
          class="absolute top-1/2 left-12 h-2 bg-blue-400 transform -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out"
          style="width: {getLineWidth()}px"
        ></div>
        
        <!-- Círculo principal (warehouse) - SIEMPRE CLICKEABLE -->
        <button
          onclick={(e) => handleCircleClick('warehouses', getCircleClickHandler('warehouses'), e)}
          class="relative flex h-15 w-15 items-center justify-center rounded-full {getCircleStyles('warehouses')} shadow-lg z-10 transition-all duration-300 {getCircleClickability('warehouses')}"
          title={getCircleTitle('warehouses')}
          disabled={!getCircleClickability('warehouses').includes('cursor-pointer')}
        >
          <img src="/icons/svg/warehouse.svg" class="w-10 h-10" alt="warehouse" />
        </button>
        
        <!-- Círculo 1 (Sections) -->
        <button 
          onclick={(e) => handleCircleClick('sections', getCircleClickHandler('sections'), e)}
          class="relative ml-16 flex h-15 w-15 items-center justify-center rounded-full {getCircleStyles('sections')} shadow-md z-10 transition-all duration-300 {getCircleClickability('sections')}"
          style="animation-delay: 0.3s"
          disabled={!getCircleClickability('sections').includes('cursor-pointer')}
          title={getCircleTitle('sections')}
        >
          <img src="/icons/svg/section.svg" class="w-10 h-10 {getIconStyles('sections')}" alt="sections" />
        </button>
        
        <!-- Círculo 2 (Rows) -->
        <button
          onclick={(e) => handleCircleClick('rows', getCircleClickHandler('rows'), e)}
          class="relative ml-16 flex h-15 w-15 items-center justify-center rounded-full {getCircleStyles('rows')} shadow-md z-10 transition-all duration-300 {getCircleClickability('rows')}"
          style="animation-delay: 0.6s"
          disabled={!getCircleClickability('rows').includes('cursor-pointer')}
          title={getCircleTitle('rows')}
        >
          <img src="/icons/svg/rows.svg" class="w-10 h-10 {getIconStyles('rows')}" alt="rows" />
        </button>
        
        <!-- Círculo 3 (Gaps) -->
        <button
          onclick={(e) => handleCircleClick('gaps', getCircleClickHandler('gaps'), e)}
          class="relative ml-16 flex h-15 w-15 items-center justify-center rounded-full {getCircleStyles('gaps')} shadow-md z-10 transition-all duration-300 {getCircleClickability('gaps')}"
          style="animation-delay: 0.9s"
          disabled={!getCircleClickability('gaps').includes('cursor-pointer')}
          title={getCircleTitle('gaps')}
        >
          <img src="/icons/svg/gap.svg" class="w-7 h-7 {getIconStyles('gaps')}" alt="gap" />
        </button>
      </div>
      
      <!-- Controles de búsqueda y agregar -->
      <div class="flex items-center gap-4 animate-fade-in-right" style="animation-delay: 1.2s">
        <!-- Barra de búsqueda -->
        <div class="w-64">
          <input
            type="text"
            bind:value={search}
            oninput={handleSearch}
            placeholder={getSearchPlaceholder()}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <!-- Botón de crear -->
        <button
          onclick={handleAdd}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAnimating}
        >
          {getAddButtonText()}
        </button>
      </div>
    </div>
  </div>
  
  <style>
    @keyframes fade-in-right {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  
    .animate-fade-in-right {
      animation: fade-in-right 0.5s ease-out forwards;
    }
  </style>