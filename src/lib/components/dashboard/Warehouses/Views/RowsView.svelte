<script lang="ts">
    import { enhance } from '$app/forms';
    import Table from '$lib/components/utilities/table/Table.svelte';
    import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
    import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
    import Button from '$lib/components/utilities/Button/Button.svelte';
    import type { WarehouseRow } from '$lib/types/warehouse.types';
   
    const {
        section,
        rows = [] as WarehouseRow[],
        search = '',
        isAnimating = false,
        fadeRows = false,
        showRowDrawer = false,
        onRowSelected = () => {},
        onDeleteRow = () => {},
        onAddRow = () => {},
        onSearchChange = () => {},
        onCloseRowDrawer = () => {}
    } = $props<{
        section: any;
        rows?: WarehouseRow[];
        search?: string;
        isAnimating?: boolean;
        fadeRows?: boolean;
        showRowDrawer?: boolean;
        onRowSelected?: (row: WarehouseRow) => void;
        onDeleteRow?: (row: WarehouseRow) => void;
        onAddRow?: () => void;
        onSearchChange?: (value: string) => void;
        onCloseRowDrawer?: () => void;
    }>();
   
    // Función para filtrar filas basada en la búsqueda
    const filterRows = (rows: WarehouseRow[], searchTerm: string) => {
        return rows.filter((row) => {
            const searchLower = searchTerm.toLowerCase();
            return row.name.toLowerCase().includes(searchLower) ||
                  (row.description?.toLowerCase() || '').includes(searchLower);
        });
    };
    
    // Filas filtradas reactivas
    const filteredRows = $derived(filterRows(rows, search));
    
    function openDrawer() {
        onAddRow();
    }
    
    function handleRowClick(row: WarehouseRow) {
        onRowSelected(row);
    }
</script>

<div class="flex-1 flex flex-col w-full mt-6 w-[90%] h-full transition-all duration-100 ease-out">
    
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
        <div class="p-6 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              
                    <h2 class="text-2xl font-semibold text-gray-900">{section?.name || 'Rows'}</h2>
                    <p class="text-sm text-gray-500">
                        {section?.description || 'Manage rows in this section'}
                    </p>
               
            </div>
        </div>
        
        <div class="p-6 flex-1 flex flex-col">
            {#if filteredRows.length > 0}
                <div class="flex-1 overflow-auto">
                    <Table
                        columns={['name', 'description']}
                        items={filteredRows}
                        onRowClick={(row: WarehouseRow) => onRowSelected(row)}
                    />
                </div>
            {:else if search.trim() !== ''}
                <div class="flex-1 flex items-center justify-center">
                    <div class="text-center py-8 text-gray-500">
                        <div class="text-lg font-medium mb-2">No matching rows found</div>
                        <div>Try adjusting your search query</div>
                    </div>
                </div>
            {:else}
                <div class="flex-1 flex items-center justify-center">
                    <div class="text-center py-8 text-gray-500">
                        <div class="text-lg font-medium mb-2">No rows yet</div>
                        <div class="mb-4">Create your first row to get started</div>
                        <Button onclick={openDrawer} variant="primary" size="md">
                            Create First Row
                        </Button>
                    </div>
                </div>
            {/if}
            
            {#if filteredRows.length > 0}
                <div class="mt-6 flex justify-between items-center border-t pt-4">
                    <div class="text-sm text-gray-600">
                        {filteredRows.length} row{filteredRows.length !== 1 ? 's' : ''} found in {section?.name || 'this section'}
                    </div>
                </div>   
            {/if}    
        </div>  
    </div>
    
    <!-- Add Row Drawer -->
    <Drawer
        title="Create New Row"
        onClose={onCloseRowDrawer}
        show={showRowDrawer}
    >
        <form 
            method="POST"
            action="?/createRow"
            use:enhance={() => {
                onCloseRowDrawer();
                return async ({ update }) => {
                    update();
                };
            }}
        >
            <input type="hidden" name="sectionId" value={section.id} />
            
            <TextInput
                name="name"
                label="Row Name"
                placeholder="Enter row name"
                required
            />
            
            <TextInput
                name="description"
                label="Description"
                placeholder="Enter row description"
            />
            
            <div class="mt-6 flex justify-end gap-4">
                <Button
                    type="button"
                    onclick={onCloseRowDrawer}
                    variant="secondary"
                    size="md"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                >
                    Create Row
                </Button>
            </div>
        </form>
    </Drawer>
</div>