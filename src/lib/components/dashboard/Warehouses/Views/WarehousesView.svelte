<script lang="ts">
    import Icon from '$lib/components/utilities/Icons/Icon.svelte';
    import type { Warehouse } from '$lib/types/warehouse.types';


    // Props usando $props() de Svelte 5
    const { 
        warehouses = [] as Warehouse[], 
        isAnimating = false, 
        fadeWarehouses = false, 
        search = '',
        onWarehouseCardClick,
        onEdit,
        onDelete,
        gridClasses = "grid grid-cols-1 ml-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity duration-300 ease-in-out"
    } = $props();

    // Filtrar warehouses basado en la búsqueda
    const filteredWarehouses = $derived(
        warehouses.filter(warehouse => 
            warehouse.name.toLowerCase().includes(search.toLowerCase()) ||
            (warehouse.location ?? '').toLowerCase().includes(search.toLowerCase())
        )
    );

    // Manejar clic en la tarjeta
    function handleCardClick(warehouse: Warehouse, event: MouseEvent) {
        if (isAnimating) return;
        
        const target = event.currentTarget as HTMLElement;
        const iconContainer = target.querySelector('.warehouse-icon') as HTMLElement;
        
        if (!iconContainer) return;
        
        onWarehouseCardClick?.({
            warehouse,
            event,
            iconContainer
        });
    }

    // Manejar clic en editar
    function handleEdit(warehouse: Warehouse, event: MouseEvent) {
        event.stopPropagation();
        onEdit?.({
            id: warehouse.id,
            event
        });
    }

    // Manejar clic en eliminar
    function handleDelete(warehouse: Warehouse, event: MouseEvent) {
        event.stopPropagation();
        onDelete?.(warehouse);
    }
</script>

<div class={gridClasses}
    class:opacity-30={isAnimating}
    class:opacity-0={fadeWarehouses}
    class:translate-y-4={fadeWarehouses}>
    {#each filteredWarehouses as warehouse (warehouse.id)}
        <div class="group relative">
            <button 
                onclick={(e) => handleCardClick(warehouse, e)}
                class="w-full text-left overflow-hidden rounded-2xl bg-white p-6 border border-gray-200 shadow-md transition-all hover:shadow-lg hover:bg-gray-50 active:scale-[0.99] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                class:pointer-events-none={isAnimating}
                aria-label={`Ver detalles de ${warehouse.name}. Presione Enter para más información.`}
            >
                <div class="flex flex-col items-center text-center">
                    <div class="warehouse-icon mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-opacity duration-300">
                        <img src="/icons/svg/warehouse.svg" class="w-12 h-12" alt="warehouse" />
                    </div>
                    <h3 class="mb-1 text-lg font-semibold text-gray-900">{warehouse.name}</h3>
                    <div class="flex items-center text-sm text-gray-500">
                        <Icon icon="location" size={18} />
                        <div class="text-sm text-gray-600">{warehouse.location || 'No location'}</div>
                    </div>
                </div>
            </button>

            {#if !isAnimating}
                <div class="absolute right-4 top-4 flex gap-2">
                    <button
                        onclick={(e) => handleEdit(warehouse, e)}
                        class="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 z-10"
                        title="Edit"
                        aria-label={`Editar ${warehouse.name}`}
                    >
                        <Icon icon="edit" size={16} />
                    </button>
                    <button
                        onclick={(e) => handleDelete(warehouse, e)}
                        class="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 z-10"
                        title="Delete"
                        aria-label={`Eliminar ${warehouse.name}`}
                    >
                        <Icon icon="delete" size={16} />
                    </button>
                </div>
            {/if}
        </div>
    {/each}
</div>