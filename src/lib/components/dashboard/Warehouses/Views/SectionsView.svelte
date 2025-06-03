<script lang="ts">
    import { enhance } from '$app/forms';
    import Table from '$lib/components/utilities/table/Table.svelte';
    import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
    import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
    import Button from '$lib/components/utilities/Button/Button.svelte';
    import type { Section } from '$lib/types/warehouse.types';

    const {
        warehouse,
        sections = [] as Section[],
        search = '',
        isAnimating = false,
        fadeSections = false,
        showSectionDrawer = false,
        onSectionSelected = () => {},
        onDeleteSection = () => {},
        onAddSection = () => {},
        onSearchChange = () => {},
        onCloseSectionDrawer = () => {}
    } = $props<{
        warehouse: any;
        sections?: Section[];
        search?: string;
        isAnimating?: boolean;
        fadeSections?: boolean;
        showSectionDrawer?: boolean;
        onSectionSelected?: (section: Section) => void;
        onDeleteSection?: (section: Section) => void;
        onAddSection?: () => void;
        onSearchChange?: (value: string) => void;
        onCloseSectionDrawer?: () => void;
    }>();
   
    const filteredSections = $derived(
        sections.filter((section: Section) =>
            section.name.toLowerCase().includes(search.toLowerCase()) ||
            (section.description?.toLowerCase() || '').includes(search.toLowerCase())
        )
    );
    
    function openDrawer() {
        onAddSection();
    }
    
    function handleSectionClick(section: Section, event: MouseEvent) {
        event.stopPropagation();
        onSectionSelected(section);
    }
</script>

<div class="flex-1 flex flex-col w-full mt-6 w-[90%] h-full transition-all duration-100 ease-out"
    class:opacity-30={isAnimating}
    class:opacity-0={fadeSections}
    class:translate-y-4={fadeSections}>
   
    <div class="bg-white rounded-lg border  w-[95%] mx-auto border-gray-200 shadow-sm h-full flex flex-col">
        <div class="p-4 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-900">{warehouse?.name || 'Sections'}</h2>
                    <p class="text-sm text-gray-500">
                        {warehouse?.description || 'Manage sections in this warehouse'}
                    </p>
                </div>
            </div>
        </div>
        <div class="p-4 flex-1 flex flex-col">
            {#if filteredSections.length > 0}
                <div class="flex-1 overflow-auto">
                    <Table
                        columns={['name', 'location', 'description']}
                        items={filteredSections}
                        onRowClick={onSectionSelected}
                    />
                </div>
            {:else if search.trim() !== ''}
                <div class="flex-1 flex items-center justify-center">
                    <div class="text-center py-8 text-gray-500">
                        <div class="text-lg font-medium mb-2">No sections found</div>
                        <div>Try adjusting your search criteria</div>
                    </div>
                </div>
            {:else}
                <div class="flex-1 flex items-center justify-center">
                    <div class="text-center py-8 text-gray-500">
                        <div class="text-lg font-medium mb-2">No sections yet</div>
                        <div class="mb-4">Create your first section to get started</div>
                        <Button onclick={openDrawer} variant="primary" size="md">
                            Create First Section
                        </Button>
                    </div>
                </div>
            {/if}
           
            {#if filteredSections.length > 0}
                <div class="mt-2 flex justify-between items-center border-t pt-4">
                    <div class="text-sm text-gray-600">
                        {filteredSections.length} section{filteredSections.length !== 1 ? 's' : ''} found in {warehouse.name}
                    </div>
                </div>   
            {/if}    
        </div>  
    </div>

    <!-- Drawer para crear nueva sección -->
    <Drawer
        title="Create New Section"
        onClose={onCloseSectionDrawer}
        show={showSectionDrawer}
    >
        <form 
            method="POST"
            action="?/createSection"
            use:enhance={() => {
                onCloseSectionDrawer();
                return async ({ update }) => {
                    update();
                };
            }}
        >
            <input type="hidden" name="warehouseId" value={warehouse.id} />
            
            <TextInput
                name="name"
                label="Section Name"
                placeholder="Enter section name"
                required
            />
            
            <TextInput
                name="location"
                label="Location"
                placeholder="Enter section location"
            />
            
            <TextInput
                name="description"
                label="Description"
                placeholder="Enter section description"
            />
            
            <div class="mt-6 flex justify-end gap-4">
                <Button
                    type="button"
                    onclick={onCloseSectionDrawer}
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
                    Create Section
                </Button>
            </div>
        </form>
    </Drawer>
</div>