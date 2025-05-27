<script lang="ts">
import Button from '$lib/components/utilities/Button/Button.svelte';
import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
import TextArea from '$lib/components/utilities/Form/TextArea.svelte';
import ComboBox from '$lib/components/utilities/Form/ComboBox.svelte';
import Table from '$lib/components/utilities/table/Table.svelte';
import type { Product, Supplier } from '$lib/types/products.types';

let { 
  isOpen = false, 
  onClose = () => {}, 
  onSubmit = () => {}, 
  suppliers = [], 
  products = [] 
} = $props<{isOpen?: boolean, onClose?: () => void, onSubmit?: (data: any) => Promise<void>, suppliers?: Supplier[], products?: Product[]}>();

let formData = $state({
  supplierId: '',
  orderDate: '',
  expectedArrival: '',
  notes: ''
});

let selectedProducts = $state<any[]>([]);
let supplierSearch = $state('');
let productSearch = $state('');

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

  const updatedProducts = [...selectedProducts];
  const existingIndex = updatedProducts.findIndex(p => p.id === productId);
  
  if (existingIndex !== -1) {
    const existingProduct = updatedProducts[existingIndex];
    const newQuantity = existingProduct.quantity + 1;
    const price = existingProduct.price || 0;
    const discount = existingProduct.discount || 0;
    
    updatedProducts[existingIndex] = {
      ...existingProduct,
      quantity: newQuantity,
      total: (price * newQuantity) * (1 - (discount / 100))
    };
  } else {
    const newProduct = {
      ...product,
      quantity: 1,
      price: product.price || 0,
      discount: 0, // Inicializar descuento en 0
      total: product.price || 0
    };
    updatedProducts.push(newProduct);
  }

  selectedProducts = updatedProducts;
  productSearch = ''; // Limpiar la búsqueda de productos después de agregar uno
 

}

function handleProductChange(item: any, field: string, value: any) {
  const itemIndex = selectedProducts.findIndex(p => p.id === item.id);
  if (itemIndex === -1) return;

 
  const numValue = parseFloat(value);
  if (isNaN(numValue) && field !== 'discount') return; 

 
  const updatedProducts = [...selectedProducts];
  const updatedItem = { ...updatedProducts[itemIndex] };

 
  const oldValue = updatedItem[field];
  

  // Actualizar el valor del campo
  updatedItem[field] = value;

  // Si es un campo numérico, asegurarse de que sea un número
  if (field === 'quantity' || field === 'price' || field === 'discount') {
    const numValue = parseFloat(value);
    updatedItem[field] = isNaN(numValue) ? 0 : numValue;
  }

  // Calcular el total basado en cantidad, precio y descuento
  const quantity = field === 'quantity' ? updatedItem[field] : updatedItem.quantity;
  const price = field === 'price' ? updatedItem[field] : updatedItem.price;
  const discount = field === 'discount' ? updatedItem[field] : (updatedItem.discount || 0);
  
  updatedItem.total = (quantity * price) * (1 - (discount / 100));
  updatedItem.total = parseFloat(updatedItem.total.toFixed(2)); // Redondear a 2 decimales

  if (oldValue === updatedItem[field] && 
      (!updatedProducts[itemIndex].total || 
       Math.abs(updatedProducts[itemIndex].total - (updatedItem.total || 0)) < 0.01)) {
    return; 
  }

  updatedProducts[itemIndex] = updatedItem;
  selectedProducts = [...updatedProducts]; // Forzar la reactividad
}

function handleDeleteProduct(productId: string) {
  selectedProducts = selectedProducts.filter((p) => p.id !== productId);
}

async function handleSubmit(e: SubmitEvent) {
  e.preventDefault();
  
  // Validate required fields
  if (!formData.supplierId) {
    alert('Please select a supplier');
    return;
  }
  
  if (selectedProducts.length === 0) {
    alert('Please add at least one product');
    return;
  }
  
  try {
    // Prepare the order data
    const orderData = {
      ...formData,
      items: selectedProducts.map(p => ({
        productId: p.id,
        quantity: p.quantity,
        price: p.price,
        discount: p.discount || 0
      }))
    };
    
    // Call the parent's onSubmit with the order data
    await onSubmit(orderData);
    
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Error submitting form. Please try again.');
  }
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
        </div>

        <form onsubmit={handleSubmit} class="space-y-6" method="POST">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-4">
              <div class="relative">
                <ComboBox
                  name="supplierSearch"
                  label="Supplier"
                  items={suppliers}
                  bind:value={supplierSearch}
                  searchQuery={supplierSearch}
                  onSelect={(supplier) => {
                    formData.supplierId = supplier.id;
                    supplierSearch = supplier.name; 
                  }}
                  displayField="name"
                  placeholder="Search suppliers..."
                />
                <input 
                  type="hidden" 
                  name="supplierId" 
                  value={formData.supplierId} 
                  required
                  aria-label="Supplier ID"
                />
               
              </div>
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
            searchQuery={productSearch}
            value={productSearch}
            onSelect={(item: any) => {
              handleProductSelect(item.id);
            }}
            displayField="name"
            placeholder="Search products..."
            filterInternally={true}
            quickSearch={true}
          />

          <Table
            columns={productColumns}
            items={selectedProducts}
            columnTypes={productColumnTypes}
            onCellChange={handleProductChange}
            onDelete={(item) => handleDeleteProduct(item.id)}
            ifEdit={(item) => false}
          />

          <div class="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              onclick={closeModal}
              variant="secondary"
              size="md"
              extraStyles="w-full md:w-auto"
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