<script lang="ts">
    import { enhance } from '$app/forms';
    import Table from '$lib/components/utilities/table/Table.svelte';
    import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
    import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
    import Button from '$lib/components/utilities/Button/Button.svelte';
    import type { WarehouseGap } from '$lib/types/warehouse.types';
   
    const {
        row,
        gaps = [] as WarehouseGap[],
        search = '',
        isAnimating = false,
        fadeGaps = false,
        showGapDrawer = false,
        onGapSelected = () => {},
        onDeleteGap = () => {},
        onAddGap = () => {},
        onSearchChange = () => {},
        onCloseGapDrawer = () => {}
    } = $props<{
        row: any;
        gaps?: WarehouseGap[];
        search?: string;
        isAnimating?: boolean;
        fadeGaps?: boolean;
        showGapDrawer?: boolean;
        onGapSelected?: (gap: WarehouseGap) => void;
        onDeleteGap?: (gap: WarehouseGap) => void;
        onAddGap?: () => void;
        onSearchChange?: (value: string) => void;
        onCloseGapDrawer?: () => void;
    }>();
   
    const filteredGaps = $derived(
        gaps.filter((gap: WarehouseGap) =>
            gap.name.toLowerCase().includes(search.toLowerCase()) ||
            (gap.notes?.toLowerCase() || '').includes(search.toLowerCase()) ||
            gap.capacity?.toString().includes(search)
        )
    );
    
    function openDrawer() {
        onAddGap();
    }
</script>

<div class="flex-1 flex flex-col w-full mt-6 w-[90%] h-full transition-all duration-100 ease-out"
    class:opacity-30={isAnimating}
    class:opacity-0={fadeGaps}
    class:translate-y-4={fadeGaps}>
    
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
        <div class="p-6 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-900">{row?.name || 'Gaps'}</h2>
                    <p class="text-sm text-gray-500">
                        {row?.description || 'Manage gaps in this row'}
                    </p>
                </div>
            </div>                     
        </div>
        
        <div class="p-6 flex-1 flex flex-col">
            {#if filteredGaps.length > 0}
                <div class="flex-1 overflow-auto">
                    <Table
                        columns={['name', 'capacity', 'notes']}
                        items={filteredGaps.map((gap: WarehouseGap) => ({
                            ...gap,
                            capacity: gap.capacity?.toString() || '',
                            notes: gap.notes || ''
                        }))}
                        onRowClick={(gap: WarehouseGap) => onGapSelected(gap)}
                    />
                </div>
            {:else if search.trim() !== ''}
                <div class="flex-1 flex items-center justify-center">
                    <div class="text-center py-8 text-gray-500">
                        <div class="text-lg font-medium mb-2">No matching gaps found</div>
                        <div>Try adjusting your search query</div>
                    </div>
                </div>
            {:else}
                <div class="flex-1 flex items-center justify-center">
                    <div class="text-center py-8 text-gray-500">
                        <div class="text-lg font-medium mb-2">No gaps yet</div>
                        <div class="mb-4">Create your first gap to get started</div>
                        <Button onclick={openDrawer} variant="primary" size="md">
                            Create First Gap
                        </Button>
                    </div>
                </div>
            {/if}
            
            {#if filteredGaps.length > 0}
                <div class="mt-6 flex justify-between items-center border-t pt-4">
                    <div class="text-sm text-gray-600">
                        {filteredGaps.length} gap{filteredGaps.length !== 1 ? 's' : ''} found in {row?.name || 'this row'}
                    </div>
                </div>   
            {/if}    
        </div>  
    </div>
    
    <!-- Add Gap Drawer -->
    <Drawer
        title="Create New Gap"
        onClose={onCloseGapDrawer}
        show={showGapDrawer}
    >
        <form 
            method="POST"
            action="?/createGap"
            use:enhance={() => {
                onCloseGapDrawer();
                return async ({ update }) => {
                    update();
                };
            }}
        >
            <input type="hidden" name="rowId" value={row.id} />
            
            <TextInput
                name="name"
                label="Gap Name"
                placeholder="Enter gap name"
                required
            />
            
            <TextInput
                name="capacity"
                label="Capacity"
                type="number"
                placeholder="Enter capacity (optional)"
            />
            
            <TextInput
                name="notes"
                label="Notes"
                placeholder="Enter gap description"
                type="textarea"
            />
            
            <div class="mt-6 flex justify-end gap-4">
                <Button
                    type="button"
                    onclick={onCloseGapDrawer}
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
                    Create Gap
                </Button>
            </div>
        </form>
    </Drawer>
</div>