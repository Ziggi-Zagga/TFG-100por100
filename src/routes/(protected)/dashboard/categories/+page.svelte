<script lang="ts">
	import Header from "$lib/components/utilities/Header/Header.svelte";
	import Button from "$lib/components/utilities/Button/Button.svelte";
	import Drawer from "$lib/components/utilities/Drawer/Drawer.svelte";
	import TextInput from "$lib/components/utilities/Form/TextInput.svelte";
    import Table from "$lib/components/utilities/table/Table.svelte";
    import ConfirmDialog from "$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte";
    import type { Category } from "$lib/types/products.types";
	import Select from "$lib/components/utilities/Form/Select.svelte";
    import SearchBar from "$lib/components/utilities/SearchBar/SearchBar.svelte";

    const { data } = $props();
    let showDrawer = $state(false);
    let search = $state('');
    let categoriesCopy = $state<Category[]>([...data.categories]);
    let totalCategories = $state(data.categories.length);
    let showConfirm = $state(false);
    let categoryToDelete = $state<string | null>(null);
    let categoryIdToDelete = $state<string | null>(null);

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

    const filteredCategories = $derived(() =>
        categoriesCopy.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
        )
    );

    function askDelete(categoryId: string, categoryName: string) {
        categoryToDelete = categoryName;
        categoryIdToDelete = categoryId;
        showConfirm = true;
    }

    function cancelDeletion() {
        showConfirm = false;
        categoryToDelete = null;
        categoryIdToDelete = null;
    }

    async function confirmDeletion() {
        if (!categoryIdToDelete) return;
        const formData = new FormData();
        formData.append('id', categoryIdToDelete);

        const res = await fetch('/dashboard/categories?/delete', {
            method: 'POST',
            body: formData
        });

        showConfirm = false;

        if (res.ok) {
            categoriesCopy = categoriesCopy.filter((c) => c.id !== categoryIdToDelete);
            categoryIdToDelete = null;
        } else {
            console.error('Failed to delete category');
        }
    }
	

</script>

<section class="p-8 bg-white w-full min-h-screen" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
	<Header title="Categories" subtitle={`${totalCategories} Categories`}>
        <SearchBar bind:search placeholder="Search by name..." />
		<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
			{@html '<span class="hidden md:inline">Add Category</span>'}
		</Button>
	</Header>

    <Table
        columns={['name', 'description']}
        items={filteredCategories()}
        onDelete={(item) => askDelete(item.id, item.name)}
    />

    {#if showDrawer}
        <Drawer title="➕ Add Category" onClose={closeDrawer}>
            <form method="POST" action="?/create">
                <TextInput label="Name" name="name" required />
                <TextInput label="Description" name="description" />
                <Select label="Parent Category" name="parentId" options={data.categories} />
                <div class="mt-6 flex justify-end gap-4">
                    <Button onclick={closeDrawer} variant="secondary" size="md" extraStyles="w-full md:w-auto">
                        {@html '<span class="hidden md:inline">Cancel</span>'}
                    </Button>
                    <Button type="submit" variant="primary" size="md" extraStyles="w-full md:w-auto">
                        {@html '<span class="hidden md:inline">+ Add Category</span>'}
                    </Button>
                </div>
            </form>
        </Drawer>
    {/if}

    <ConfirmDialog
    show={showConfirm}
    message={`Are you sure you want to delete categorie: ${categoryToDelete}?`}
    onConfirm={confirmDeletion}
    onCancel={cancelDeletion}
  />
</section>
