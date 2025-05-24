<script lang="ts">
  import { goto } from '$app/navigation';
  import InventoryHeader from '$lib/components/utilities/Header/Header.svelte';
  import Table from '$lib/components/utilities/table/Table.svelte';
  import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
  import Button from '$lib/components/utilities/Button/Button.svelte';
  import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
  import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
  import Select from '$lib/components/utilities/Form/Select.svelte';
  import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
  import type { Supplier, Manufacturer, Category, Product } from '$lib/types/products.types';

  const { data } = $props();
  let productsCopy = $state<Product[]>([...data.products]);
  let suppliers = $state<Supplier[]>([...data.suppliers]);
  let manufacturers = $state<Manufacturer[]>([...data.manufacturers]);
  let categories = $state<Category[]>([...data.categories]);
  let showDrawer = $state(false);
  let search = $state('');
  let totalProducts = $state(data.products.length);
  let selectedSupplier = $state<Supplier | null>(null);
  let selectedManufacturer = $state<Manufacturer | null>(null);
  let selectedCategory = $state<Category | null>(null);

  // Confirm dialog
  let showConfirm = $state(false);
  let productToDelete = $state<string | null>(null);
  let productIdToDelete = $state<string | null>(null);

  function goToProductDetails(id: string, queryParams: string) {
    goto(`./products/${id}${queryParams}`);
  }

  function openDrawer() {
    showDrawer = true;
  }

  function closeDrawer() {
    showDrawer = false;
  }

  const filteredProducts = $derived(() =>
    productsCopy.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.code ?? '').toLowerCase().includes(search.toLowerCase())
    )
  );

  function askDelete(productId: string, productName: string) {
    productToDelete = productName;
    productIdToDelete = productId;
    showConfirm = true;
  }

  async function confirmDeletion() {
    if (!productIdToDelete) return;
    const formData = new FormData();
    formData.append('id', productIdToDelete);

    const res = await fetch('/dashboard/products?/delete', {
      method: 'POST',
      body: formData
    });

    showConfirm = false;

    if (res.ok) {
      productsCopy = productsCopy.filter((p) => p.id !== productIdToDelete);
      productIdToDelete = null;
    } else {
      console.error('Failed to delete store');
    }
  }

  function cancelDeletion() {
    showConfirm = false;
    productIdToDelete = null;
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
    columns={['code', 'name', 'price', 'unit', 'material']}
    items={filteredProducts()}
    onRowClick={(item) => goToProductDetails(item.id, '')}
    onEdit={(item) => goToProductDetails(item.id, '?edit=true')}
    onDelete={(item) => askDelete(item.id, item.name)}
  />

  {#if showDrawer}
    <Drawer title="➕ Create New Product" onClose={closeDrawer}>
      <form 
        method="POST"
        action="?/create"
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
          <Select label="Supplier" name="supplierId" options={suppliers} placeholder={selectedSupplier?.name ?? undefined} required/>
          <Select label="Manufacturer" name="manufacturerId" options={manufacturers} placeholder={selectedManufacturer?.name ?? undefined} required/>
          <Select label="Category" name="categoryId" options={categories} placeholder={selectedCategory?.name ?? undefined} required/>
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

  <ConfirmDialog
    show={showConfirm}
    message={`Are you sure you want to delete product: ${productToDelete}?`}
    onConfirm={confirmDeletion}
    onCancel={cancelDeletion}
  />
</section>
