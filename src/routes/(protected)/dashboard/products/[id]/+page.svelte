<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import ShowText from '$lib/components/utilities/ShowText/ShowText.svelte';
  import TextInput from '$lib/components/utilities/TextInput/TextInput.svelte';
  import NumberInput from '$lib/components/utilities/NumberInput/NumberInput.svelte';
  import Table from '$lib/components/utilities/table/Table.svelte';
  import Button from '$lib/components/utilities/Button/Button.svelte';
  import Header from '$lib/components/utilities/Header/Header.svelte';
  import InputSelect from '$lib/components/utilities/InputSelect/InputSelect.svelte';

  const { data } = $props();
  let id: string;
  let product = data.product;
  let isEditing = $state(false);
  let activeText: string;

  onMount(() => {
    id = get(page).params.id;
    activeText = product.active ? 'Yes' : 'No';
  });

  function toggleEdit() {
    isEditing = !isEditing;
  }

  function deleteProduct() {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      alert(`Product with ID: ${id} deleted (fake action for now).`);
    }
  }

  function goBack() {
    history.back();
  }

  function closeDrawer() {
    isEditing = false;
  }

  //SELECT HISTORY ORDERS / INVENTORY MOVES
  let selectedOption = $state<'orders' | 'inventory'>('orders');

  const historyOptions = [
    { id: 'orders', name: 'Order History' },
    { id: 'inventory', name: 'Inventory History' }
  ];

  function handleSelectChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    selectedOption = target.value as 'orders' | 'inventory';
  }
</script>

{#if product}
<section class="pt-0 pb-4 md:pb-8 px-4 md:px-8 min-h-screen flex justify-center" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
  <div class="bg-white rounded-2xl shadow-xl px-6 md:px-10 py-6 md:py-8 w-full max-w-7xl space-y-12">
    
    <!-- Header -->
    <div class="flex justify-between items-center">
      <button onclick={goBack} class="text-indigo-600 hover:text-indigo-800 text-2xl">
        ←
      </button>
      <div class="flex gap-4">
        <button onclick={toggleEdit} class="hover:scale-110 transition text-yellow-500 hover:text-yellow-600 text-2xl">
          {isEditing ? '💾' : '✏️'}
        </button>
        <button onclick={deleteProduct} class="hover:scale-110 transition text-red-500 hover:text-red-600 text-2xl">
          🔚️
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col md:flex-row gap-12">
      <!-- Image -->
      <div class="w-full md:w-1/3 flex justify-center">
        <div class="rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-indigo-100 to-indigo-200 p-2">
          <img 
            src="https://via.placeholder.com/300x300.png?text=Product+Image" 
            alt="Product Image" 
            class="rounded-lg w-full object-cover"
          />
        </div>
      </div>

      <!-- Details -->
      <div class="w-full md:w-2/3 flex flex-col gap-6">
        {#if isEditing}
          <form method="POST" action="?/create" class="space-y-6">
            <TextInput label="Product Name" name="name" placeholder="Enter product name" value={product.name} required />
            <TextInput label="Product Code" name="code" placeholder="Enter product code" value={product.code} required />
            <TextInput label="Description" name="description" placeholder="Enter product description" value={product.description ?? undefined} />
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <NumberInput label="Price" name="price" min={0} placeholder="Enter product price" value={product.price ?? undefined} required />
              <TextInput label="Unit" name="unit" placeholder="e.g. piece, kg, box" value={product.unit ?? undefined} />
              <TextInput label="Dimensions" name="dimensions" placeholder="e.g. 10x20x5 cm" value={product.dimensions ?? undefined} />
              <TextInput label="Material" name="material" placeholder="e.g. plastic, metal" value={product.material ?? undefined} />
              <TextInput label="Specifications" name="specifications" placeholder="Enter technical specs" value={product.specifications ?? undefined} />
              <TextInput label="Supplier ID" name="supplier_id" placeholder="Select supplier or enter ID" value={product.supplierId ?? undefined} />
              <TextInput label="Manufacturer ID" name="manufacturer_id" placeholder="Select manufacturer or enter ID" value={product.manufacturerId ?? undefined} />
              <TextInput label="Category ID" name="category_id" placeholder="Select category or enter ID" value={product.categoryId ?? undefined} />
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <Button onclick={closeDrawer} variant="secondary" size="md" extraStyles="w-full md:w-auto">
                {@html '<span class="hidden md:inline">Cancel</span>'}
              </Button> 
              <Button type="submit" variant="primary" size="md" extraStyles="w-full md:w-auto">
                {@html '<span class="hidden md:inline">Save</span>'}
              </Button> 
            </div>
          </form>
        {:else}
          <h2 class="text-4xl font-bold text-gray-800">{product.name}</h2>
          <p class="text-indigo-600 text-2xl mt-1">${product.price?.toFixed(2) ?? 'N/A'}</p>
          <ShowText label="Description" value={product.description} />
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ShowText label="Unit" value={product.unit} />
            <ShowText label="Dimensions" value={product.dimensions} />
            <ShowText label="Material" value={product.material} />
            <ShowText label="Specifications" value={product.specifications} />
            <ShowText label="Active" value={product.active ? 'Yes' : 'No'} />
            <ShowText label="SKU (Code)" value={product.code} uppercase={true} />
            <ShowText label="Manufacturer" value={product.manufacturerId} />
            <ShowText label="Supplier" value={product.supplierId} />
            <ShowText label="Category" value={product.categoryId} />
          </div>
        {/if}
      </div>
    </div>

    <!-- Dynamic Header with select -->
    <Header title={selectedOption === 'orders' ? 'Order History' : 'Inventory History'} subtitle={product.name}>
      <div class="w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
        <InputSelect label="Select History Type" name="historyType" options={historyOptions} bind:selected={selectedOption} onChange={handleSelectChange} />
      </div>
    </Header>

    <!-- Dynamic Table -->
    {#if selectedOption === 'orders'}
      <Table columns={["order_id", "date", "quantity", "customer"]} items={[]} />
    {:else if selectedOption === 'inventory'}
      <Table columns={["movement_id", "date", "stock_change", "location"]} items={[]} />
    {/if}
  </div>
</section>
{:else}
<p class="text-center text-red-500 mt-8">Error: Product not found.</p>
{/if}
