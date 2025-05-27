<script lang="ts">
import Button from '$lib/components/utilities/Button/Button.svelte';
import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
import TextArea from '$lib/components/utilities/Form/TextArea.svelte';
import ComboBox from '$lib/components/utilities/Form/ComboBox.svelte';
import Table from '$lib/components/utilities/table/Table.svelte';

const { 
  isOpen = $bindable(false), 
  onClose = () => {}, 
  onSubmit = () => {}, 
  suppliers = [], 
  products = [] 
} = $props();

let formData = $state({
  supplierId: '',
  orderDate: new Date().toISOString().slice(0, 16),
  expectedArrival: '',
  notes: ''
});

let selectedProducts = $state<any[]>([]);
let search = $state('');

const productColumns = ['code', 'name', 'price', 'quantity', 'discount', 'total'];

const productColumnTypes: Record<string, any> = {
  quantity: { type: 'input', inputType: 'number', min: 1, step: 1 },
  discount: { type: 'input', inputType: 'number', min: 0, max: 100, step: 1 },
  actions: {
    type: 'actions',
    actions: [
      {
        label: 'Delete',
        onClick: (item: any) => handleDeleteProduct(item.id)
      }
    ]
  }
};

function handleProductSelect(productId: string) {
  const product = products.find((p: any) => p.id === productId);
  if (!product) return;

  // Check if product is already in the list
  const existingProduct = selectedProducts.find(p => p.id === productId);
  if (existingProduct) {
    // Update quantity if product already exists
    handleProductChange(existingProduct, 'quantity', existingProduct.quantity + 1);
    return;
  }


  selectedProducts = [
    ...selectedProducts,
    {
      ...product,
      quantity: 1,
      discount: 0,
      total: product.price
    }
  ];

  search = '';
}

function handleProductChange(item: any, field: string, value: any) {
  selectedProducts = selectedProducts.map((p) => {
    if (p.id === item.id) {
      const updated = { ...p, [field]: parseFloat(value) };
      updated.total = updated.quantity * updated.price * (1 - (updated.discount || 0) / 100);
      return updated;
    }
    return p;
  });
}

function handleDeleteProduct(productId: string) {
  selectedProducts = selectedProducts.filter((p) => p.id !== productId);
}

function handleSubmit(e: Event) {
  e.preventDefault();
  const orderData = {
    ...formData,
    items: selectedProducts.map((p) => ({
      productId: p.id,
      quantity: p.quantity,
      discount: p.discount,
      price: p.price
    }))
  };
  onSubmit(orderData);
}

function closeModal() {
  onClose();
}
</script>
{#if isOpen}
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <button 
        type="button" 
        class="fixed inset-0 w-full h-full bg-black/30 cursor-default focus:outline-none" 
        onclick={closeModal}
        aria-label="Close modal"
      ></button>
      <div class="relative w-full max-w-4xl rounded-xl bg-white p-6 shadow-2xl">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold">➕ Create New Order</h2>
          <button
            onclick={closeModal}            class="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onsubmit={(e) => { e.preventDefault(); handleSubmit(e); }} class="space-y-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-4">
              <ComboBox
                name="supplierName"
                label="Supplier"
                items={suppliers}
                bind:value={formData.supplierId}
                onSelect={(supplier) => {
                  formData.supplierId = supplier.id;
                }}
                displayField="name"
                required
                searchQuery={formData.supplierId}
                placeholder="Search suppliers..."
              />
              <input type="hidden" name="supplierId" value={formData.supplierId} />
              {#if suppliers && suppliers.length === 0}
                <p class="text-sm text-red-500">
                  No suppliers available. Please add suppliers first.
                </p>
              {/if}
            </div>

            <TextInput
              name="orderDate"
              bind:value={formData.orderDate}
              label="Order Date"
              type="datetime-local"
              required
            />


            <TextInput
              name="expectedArrival"
              bind:value={formData.expectedArrival}
              label="Expected Arrival"
              type="datetime-local"
              required
            />
          </div>

          <TextArea
            name="notes"
            bind:value={formData.notes}
            label="Notes"
            rows={3}
            placeholder="Enter any additional notes..."
          />


          <ComboBox
            name="productSearch"
            label="Add Products"
            items={products}
            bind:value={search}
            onSelect={(item) => {
              handleProductSelect(item.id);
              search = ''; // Clear search after selection
            }}
            displayField="name"
            placeholder="Search products..."
            filterInternally={true}
            searchQuery={search}
          />

          <Table
            columns={productColumns}
            items={selectedProducts}
            columnTypes={productColumnTypes}
            onCellChange={handleProductChange}
            onDelete={(item) => handleDeleteProduct(item.id)}
          />

          <div class="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              onclick={closeModal}
              variant="secondary"
              size="md"
              class="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              extraStyles="w-full md:w-auto"
              disabled={!formData.supplierId || selectedProducts.length === 0}
            >
              Create Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}