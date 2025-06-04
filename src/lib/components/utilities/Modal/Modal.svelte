<script lang="ts">
    import { quintOut } from 'svelte/easing';
    import type {TransitionConfig} from 'svelte/transition';

    type ModalParams = { duration?: number };
    type Modal  = (
        node:Element,
        params?: ModalParams) => TransitionConfig;

    const modal: Modal = (node: Element, { duration = 300 } = {}) => {
        const element = node as HTMLElement;
        
        element.style.transform = 'translateX(100%) scale(0.9)';
        element.style.opacity = '0';
        
        return {
            duration,
            easing: quintOut,
            
            css: (t: number) => `
                transform: translateX(${(1 - t) * 100}%) scale(${0.1 + (t * 0.9)});
                opacity: ${t};
            `,
           
            tick: (t: number) => {
                if (t === 1) {
                    element.style.transform = '';
                    element.style.opacity = '';
                }
            }
        };
    }
    
    export let title: string;
    export let onClose: () => void;
    export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

    const sizeClasses = {
        sm: 'max-w-md w-full',
        md: 'max-w-2xl w-11/12',
        lg: 'max-w-4xl w-11/12',
        xl: 'max-w-6xl w-11/12'
    };

    function handleKeyClose(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            onClose();
        }
    }

    function handleContentClick(e: MouseEvent | KeyboardEvent) {
        e.stopPropagation();
    }
</script>

<div
    class="fixed inset-0 z-50 flex backdrop-blur-sm items-center justify-center p-4"
    onclick={onClose}
    onkeydown={handleKeyClose}
    tabindex="0"
    role="button"
    aria-label="Cerrar modal"
    transition:modal={{ 
        duration: 900
    }}
>
    <div
        class={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl transform transition-all duration-300`}
        onclick={handleContentClick}
        onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleContentClick(e);
            }
        }}
        tabindex="0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title-{Math.random().toString(36).substring(2, 9)}"
       
    >
        <div class="sticky top-0 z-20 bg-white border-b border-gray-100 p-6 pb-4">
            <div class="flex items-center justify-between">
                <h2 id="modal-title-{Math.random().toString(36).substring(2, 9)}" class="text-2xl font-bold text-gray-900">{title}</h2>
                <button 
                    onclick={onClose}
                    class="text-gray-400 hover:text-gray-500 transition-colors"
                    aria-label="Cerrar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="p-6">
            <slot />
        </div>
    </div>
</div>
