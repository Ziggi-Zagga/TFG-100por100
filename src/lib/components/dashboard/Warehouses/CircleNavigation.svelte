<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';

  // State
  let isAnimating = $state(false);
  let animatingElement = $state<HTMLElement | null>(null);
  let previousView = $state<string>('warehouses');
  const animationDuration = 300;
  
  // Tweened store for line animation
  let lineWidth = tweened(0, {
    duration: 500,
    easing: cubicOut
  });

  // Props
  type ViewType = 'warehouses' | 'sections' | 'rows' | 'gaps';
  
  let { 
    currentView = 'warehouses',
    onNavigate = (view: ViewType) => {},
    children,
  }: {
    children?: () => any;
    currentView?: ViewType;
    onNavigate?: (view: ViewType) => void;
  } = $props();
  
  // Event dispatcher
  const dispatch = createEventDispatcher<{
    navigate: { view: ViewType };
  }>();
  
  // View configuration
  const viewOrder: ViewType[] = ['warehouses', 'sections', 'rows', 'gaps'];
  const viewPositions: Record<ViewType, number> = {
    'warehouses': 0,
    'sections': 100,
    'rows': 230,
    'gaps': 350
  };
  
  // Get circle styles based on current view
  function getCircleStyles(view: ViewType): string {
      
    if (view === currentView) return 'bg-blue-300 text-white';
    if (view === 'warehouses') return 'bg-gray-200 text-gray-700';
    
    if (currentView === 'rows'){
      if (view === 'sections') return 'bg-gray-200 text-gray-700';
    }
    if (currentView === 'gaps'){

    if(view== 'sections') return 'bg-gray-200 text-gray-700';
    if(view== 'rows') return 'bg-gray-200 text-gray-700';
    }
    return 'bg-gray-100 text-gray-400 opacity-50';
  }
  
  
  // Get cursor style based on current view
  function getCursorStyle(view: ViewType): string {
    if (view === currentView) return 'cursor-not-allowed';
    if (view === 'warehouses') return 'cursor-pointer';
    if (currentView === 'sections') {
      if (view === 'rows' || view === 'gaps') return 'cursor-not-allowed';
    }
    else if (currentView === 'rows') {
      if (view === 'gaps') return 'cursor-not-allowed';
    }
    return 'cursor-pointer';
  }
  
  // Get title based on view
  function getTitle(view: ViewType): string {
    const titles: Record<ViewType, string> = {
      'warehouses': 'View warehouses',
      'sections': currentView === 'warehouses' ? 'View sections' : 'Viewing sections',
      'rows': currentView === 'sections' ? 'View rows' : 'Viewing rows',
      'gaps': currentView === 'rows' ? 'View gaps' : 'Viewing gaps',
    };
    return titles[view] || `View ${view}`;
  }
  
  // Handle circle click
  function handleCircleClick(circleView: ViewType, handler: (() => void) | undefined, event: MouseEvent) {
    event.preventDefault();
    if (isAnimating || !handler) return;
    
    const currentIndex = viewOrder.indexOf(currentView);
    const targetIndex = viewOrder.indexOf(circleView);
    
    // Only allow navigation forward in sequence or back to previous steps
    if (targetIndex <= currentIndex + 1) {
      // Start animation
      isAnimating = true;
      animatingElement = event.currentTarget as HTMLElement;
      
      // Execute handler after a small delay to allow animation
      setTimeout(() => {
        handler();
        dispatch('navigate', { view: circleView });
        
        // Reset animation after completion
        setTimeout(() => {
          isAnimating = false;
          if (animatingElement) {
            animatingElement.style.opacity = '1';
            animatingElement = null;
          }
        }, animationDuration);
      }, 50);
    }
  }
 
  // Update line width based on current view
  function updateLineWidth(newView: ViewType, oldView: ViewType) {
    const newPosition = viewPositions[newView];
    const oldPosition = viewPositions[oldView];
    
    // Determine animation direction
    const isMovingForward = viewOrder.indexOf(newView) > viewOrder.indexOf(oldView);
    
    if (isMovingForward) {
      // Move forward: animate from current to new position
      lineWidth.set(newPosition, {
        duration: 600,
        easing: cubicOut
      });
    } else {
      // Move backward: animate from current to new position
      lineWidth.set(newPosition, {
        duration: 600,
        easing: cubicOut
      });
    }
  }
  
  // Update line width when currentView changes
  $effect(() => {
    if (previousView !== currentView) {
      updateLineWidth(currentView, previousView as ViewType);
      previousView = currentView;
    }
  });

  // Initialize on mount
  $effect(() => {
    // Set initial position without animation on first load
    const initialPosition = viewPositions[currentView];
    lineWidth = tweened(initialPosition, { duration: 0 });
    previousView = currentView;
  });
  
  // Get click handler for a view
  function getClickHandler(view: ViewType): (() => void) | undefined {
    if (view === currentView) return undefined;
    return () => onNavigate(view);
  }
 </script>
   
 <div class="h-22 bg-white border-b-2 mb-6 border-gray-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] z-50 transform transition-all duration-500 ease-in-out">
     <div class="relative h-full flex items-center justify-between px-8">
       <!-- Contenedor de círculos conectados -->
       <div class="flex items-center relative">
         <!-- Línea conectora animada con tweened -->
         <div 
           class="absolute top-1/2 left-12 h-2 bg-gradient-to-r from-blue-400 to-blue-500 transform -translate-y-1/2 rounded-full transition-all duration-500 shadow-sm"
           style="width: {$lineWidth}px"
         ></div>
         
         <!-- Warehouse Circle -->
         <button
           onclick={(e) => handleCircleClick('warehouses', getClickHandler('warehouses'), e)}
           class="relative flex h-15 w-15 items-center justify-center rounded-full {getCircleStyles('warehouses')} shadow-md z-10 transition-all duration-300 {getCursorStyle('warehouses')} {currentView !== 'warehouses' ? 'transform hover:scale-105' : ''}"
           disabled={getCursorStyle('warehouses') === 'cursor-not-allowed'}
           title={getTitle('warehouses')}
           aria-label={getTitle('warehouses')}
         >
         <img src="/icons/svg/warehouse.svg" alt="warehouse" class="w-10 h-10 text-white s-9hKDif2IaRv-">
         </button>

         <!-- Sections Circle -->
         <button
           onclick={(e) => handleCircleClick('sections', getClickHandler('sections'), e)}
           class="relative ml-16 flex h-15 w-15 items-center justify-center rounded-full {getCircleStyles('sections')} shadow-md z-10 transition-all duration-300 {getCursorStyle('sections')} {!['sections', 'rows', 'gaps'].includes(currentView) ? 'transform hover:scale-105' : ''}"
           disabled={getCursorStyle('sections') === 'cursor-not-allowed'}
           title={getTitle('sections')}
           aria-label={getTitle('sections')}
         >
         <img src="/icons/svg/section.svg" alt="section" class="w-10 h-10 text-white s-9hKDif2IaRv-">
         </button>

         <!-- Rows Circle -->
         <button
           onclick={(e) => handleCircleClick('rows', getClickHandler('rows'), e)}
           class="relative ml-16 flex h-15 w-15 items-center justify-center rounded-full {getCircleStyles('rows')} shadow-md z-10 transition-all duration-300 {getCursorStyle('rows')} {!['sections', 'rows', 'gaps'].includes(currentView) ? 'transform hover:scale-105' : ''}"
           disabled={getCursorStyle('rows') === 'cursor-not-allowed'}
           title={getTitle('rows')}
           aria-label={getTitle('rows')}
         >
         <img src="/icons/svg/rows.svg" alt="rows" class="w-10 h-10 text-white s-9hKDif2IaRv-">
         </button>

         <!-- Gaps Circle -->
         <button
           onclick={(e) => handleCircleClick('gaps', getClickHandler('gaps'), e)}
           class="relative ml-16 flex h-15 w-15 items-center justify-center rounded-full {getCircleStyles('gaps')} shadow-md z-10 transition-all duration-300 {getCursorStyle('gaps')} {!['sections', 'rows', 'gaps'].includes(currentView) ? 'transform hover:scale-105' : ''}"
           disabled={getCursorStyle('gaps') === 'cursor-not-allowed'}
           title={getTitle('gaps')}
           aria-label={getTitle('gaps')}
         >
         <img src="/icons/svg/gaps.svg" alt="gap" class="w-8 h-8 text-white">
         </button>
       </div>
       
       <div class="flex items-center space-x-4">
         {@render children?.()}
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