<script lang="ts">
    import { goto } from '$app/navigation';

    import InventoryHeader from '$lib/components/utilities/Header/Header.svelte';
    import Table from '$lib/components/utilities/table/Table.svelte';
    import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
    import Button from '$lib/components/utilities/Button/Button.svelte';
    import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
    import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
   

    const { data } = $props();
    let productsCopy = $state([...data.products]);
    let showDrawer = $state(false);
    let search = $state('');
    let totalProducts = $state(data.products.length);

    

    function goToProductDetails(id: string) {
      console.log('Navigating to product ID:', id);
      goto(`./products/${id}`);
    }

    function openDrawer() {
      showDrawer = true;
    }

    function closeDrawer() {
      showDrawer = false;
    }

    const filteredProducts = $derived(() =>
    productsCopy.filter((productsCopy) =>
    productsCopy.name.toLowerCase().includes(search.toLowerCase()) ||
        (productsCopy.code ?? '').toLowerCase().includes(search.toLowerCase())
      )
    );

    async function handleDelete(productSelectedId: string) {
      const formData = new FormData();
      formData.append('id', productSelectedId);

      const res = await fetch('/dashboard/products?/delete', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        productsCopy = productsCopy.filter((p) => p.id !== productSelectedId);
      } else {
        console.error('Failed to delete store');
      }
    }

</script>
  
<section class="p-8 bg-white w-full min-h-screen" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
    
    <InventoryHeader title="Products" subtitle="{totalProducts} Products">
      <SearchBar bind:search placeholder="Search by name or code..." />
      <Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
				{@html '<span class="hidden md:inline">Add Product</span>'}
			</Button>   
    </InventoryHeader>

    <Table
        columns={['code', 'name', 'price', 'unit', 'active']}
        items={filteredProducts()}
        onRowClick={(id) => goToProductDetails(id)}
        onEdit={(id) => handleDelete(id)}
    />

    {#if showDrawer}
      <Drawer title="➕ Create New Product" onClose={closeDrawer} >
        <form 
          method="POST"
          action="?/create"
          class="fixed top-0 right-0 z-50 h-full w-full max-w-3xl space-y-4 overflow-y-auto rounded-l-3xl border-l border-blue-100 bg-white p-10 shadow-2xl"
        >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextInput label="Product Name" name="name" placeholder="Enter product name" required />
          <TextInput label="Product Code" name="code" placeholder="Enter product code" required />
          <TextInput label="Description" name="description" placeholder="Enter product description" />
          <TextInput label="Price" name="price" type="number" min={0} placeholder="Enter product price" required />
          <TextInput label="Unit" name="unit" placeholder="e.g. piece, kg, box" />
          <TextInput label="Dimensions" name="dimensions" placeholder="e.g. 10x20x5 cm" />
          <TextInput label="Material" name="material" placeholder="e.g. plastic, metal" />
          <TextInput label="Specifications" name="specifications" placeholder="Enter technical specs" />
          <TextInput label="Supplier ID" name="supplierId" placeholder="Select supplier or enter ID" />
          <TextInput label="Manufacturer ID" name="manufacturerId" placeholder="Select manufacturer or enter ID" />
          <TextInput label="Category ID" name="categoryId" placeholder="Select category or enter ID" />
        </div>
 
        <div class="mt-6 flex justify-end gap-4">
          <Button onclick={closeDrawer} variant="secondary" size="md" extraStyles="w-full md:w-auto">
            {@html '<span class="hidden md:inline">Cancel</span>'}
          </Button> 
          <Button type="submit" variant="primary" size="md" extraStyles="w-full md:w-auto">
            {@html '<span class="hidden md:inline">+ Add Product</span>'}
          </Button> 
        </div>

        </form>
      </Drawer>
    {/if}

  </section>
  