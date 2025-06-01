<script lang="ts">
    import PageHeader from '$lib/components/utilities/Header/Header.svelte';
    import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
    import Table from '$lib/components/utilities/table/Table.svelte';
    import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
    import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
    import Breadcrumb from '$lib/components/utilities/Breadcrumb.svelte';
    import Button from '$lib/components/utilities/Button/Button.svelte';
    import { goto } from '$app/navigation';

    const { data } = $props();
   
    // Verificar que los datos existen antes de usarlos
    if (!data.warehouse) {
        throw new Error('Warehouse not found');
    }
    // Inicializar el estado con los datos del servidor
    let warehouse = $state({ ...data.warehouse });
    let sections = $state([...(data.sections || [])]);
    let showDrawer = $state(false);
    let search = $state('');
    const filteredSections = $derived(() =>
        sections.filter((section) =>
            section.name.toLowerCase().includes(search.toLowerCase())
        )
    );
    function openDrawer() {
        showDrawer = true;
    }
    function closeDrawer() {
        showDrawer = false;
    }
    function goToSection(sectionId: string) {
        goto(`/dashboard/warehouses/${warehouse.id}/${sectionId}`);
    }
    async function handleDelete(sectionId: string) {
        const formData = new FormData();
        formData.append('id', sectionId);
        const res = await fetch('?/delete', {
            method: 'POST',
            body: formData
        });
        if (res.ok) {
            sections = sections.filter((s) => s.id !== sectionId);
        } else {
            console.error('Failed to delete section');
        }
    }
</script>

<section class="min-h-screen w-full" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
	<PageHeader title={`Sections in ${warehouse.name}`} subtitle={`${sections.length} section${sections.length !== 1 ? 's' : ''}`}>
		<div class="flex w-full flex-col items-center gap-4 md:flex-row">
			<div class="w-60 md:flex-[3] lg:flex-[4]">
				<SearchBar bind:search placeholder="Search section by name..." extraClasses="w-full" />
			</div>
			<div class="flex w-full justify-end md:w-auto">
				<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
					
					<span class="hidden md:inline">Add section</span>
				</Button>
			</div>
		</div>
	</PageHeader>

   
        <!-- Content Grid -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="p-6">
                <div class="mb-4">
                    <h2 class="text-lg font-semibold text-gray-900">Sections</h2>
                    <p class="text-sm text-gray-600">Manage your warehouse sections</p>
                </div>
                
                {#if filteredSections().length > 0}
                    <Table
                        columns={['name']}
                        items={filteredSections()}
                        onRowClick={(item) => goToSection(item.id)}
                        onDelete={(item) => handleDelete(item.id)}
                    />
                {:else}
                    <div class="text-center py-12">
                        <div class="mx-auto h-12 w-12 text-gray-400">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">No sections</h3>
                        <p class="mt-1 text-sm text-gray-500">Get started by creating a new section.</p>
                        <div class="mt-6">
                            <Button onclick={openDrawer} variant="primary" size="sm">
                                Create Section
                            </Button>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
</section>
    <!-- Drawer para crear nueva sección -->
    <Drawer 
        title="Create New Section" 
        onClose={closeDrawer}
        show={showDrawer}
    >
        <form method="POST" action="?/create" class="space-y-4">
            <TextInput 
                name="name" 
                label="Section Name"
                placeholder="Enter section name"
                required 
            />
            <div class="mt-6 flex justify-end gap-4">
                <button 
                    type="button" 
                    onclick={closeDrawer}
                    class="rounded-xl bg-gray-200 px-6 py-2 font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    class="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 font-semibold text-white shadow-md hover:from-blue-600 hover:to-indigo-600"
                >
                    Create Section
                </button>
            </div>
        </form>
    </Drawer>
