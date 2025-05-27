<script lang="ts">
  import Button from '$lib/components/utilities/Button/Button.svelte';
  import Modal from '$lib/components/utilities/Modal/Modal.svelte';
  import Table from '$lib/components/utilities/table/Table.svelte';
  import type { Supplier } from '$lib/types/products.types';

  let { isOpen = $bindable<boolean>(), order, onClose, supplier } = $props<{
    isOpen?: boolean;
    order?: any;
    onClose?: () => void;
    supplier?: Supplier;
  }>();

  function formatDate(dateString: string) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function hasDiscounts(products: any[]) {
    if (!products || !products.length) return false;
    return products.some(item => parseFloat(item.discount || 0) > 0);
  }

  function calculateSubtotal(products: any[]) {
    if (!products || !products.length) return 0;
    return products.reduce((total: number, item: any) => {
      const price = parseFloat(item.price || 0);
      const quantity = parseFloat(item.quantity || 0);
      return total + (price * quantity);
    }, 0).toFixed(2);
  }

  function calculateDiscounts(products: any[]) {
    if (!products || !products.length) return 0;
    return products.reduce((total: number, item: any) => {
      const price = parseFloat(item.price || 0);
      const quantity = parseFloat(item.quantity || 0);
      const discount = parseFloat(item.discount || 0);
      const subtotal = price * quantity;
      const discountAmount = subtotal * (discount / 100);
      return total + discountAmount;
    }, 0).toFixed(2);
  }

  function calculateTotal(products: any[]) {
    if (!products || !products.length) return 0;
    return products.reduce((total: number, item: any) => {
      const price = parseFloat(item.price || 0);
      const quantity = parseFloat(item.quantity || 0);
      const discount = parseFloat(item.discount || 0);
      const subtotal = price * quantity;
      const discountAmount = subtotal * (discount / 100);
      return total + (subtotal - discountAmount);
    }, 0).toFixed(2);
  }

  const productColumns = ['code', 'name', 'quantity', 'price', 'discount', 'total'];

  const productColumnTypes = {
    price: { type: 'text' as const, extraStyles: 'text-right' },
    discount: { type: 'text' as const, extraStyles: 'text-center' },
    total: { type: 'text' as const, extraStyles: 'text-right font-medium' },
    quantity: { type: 'text' as const, extraStyles: 'text-center' }
  };

  let productItems = $state<any[]>([]);
  
  $effect(() => {
    const items = order?.items || order?.products || [];
    
    if (!items.length) {
      productItems = [];
      return;
    }
    
    productItems = items.map((item: any) => {
      const price = parseFloat(item.price || 0);
      const quantity = parseFloat(item.quantity || 0);
      const discount = parseFloat(item.discount || 0);
      const subtotal = price * quantity;
      const discountAmount = subtotal * (discount / 100);
      const total = (subtotal - discountAmount).toFixed(2);
      
      return {
        ...item,
        code: item.code || 'N/A',
        name: item.name || 'Producto sin nombre',
        price: price.toFixed(2) + ' €',
        quantity: quantity.toString(),
        discount: discount > 0 ? `${discount}%` : '0%',
        total: total + ' €',
        _rowClass: 'hover:bg-gray-50',
        _cellClass: {
          price: 'font-mono',
          discount: 'font-mono',
          total: 'font-mono font-semibold',
          quantity: 'font-mono'
        }
      };
    });
  });
  
</script>

<Modal title="Detalles del Pedido" size="lg" onClose={onClose}>
  {#if order}
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500">Número de Pedido</h3>
          <p class="mt-1 text-lg font-semibold">{order.orderNumber || 'N/A'}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500">Estado</h3>
          <div class="mt-1">
            <span class="px-3 py-1 text-sm rounded-full" 
                  class:bg-green-100={order.status === 'completed'}
                  class:text-green-800={order.status === 'completed'}
                  class:bg-yellow-100={order.status === 'pending'}
                  class:text-yellow-800={order.status === 'pending'}
                  class:bg-red-100={order.status === 'cancelled'}
                  class:text-red-800={order.status === 'cancelled'}
                  class:bg-gray-100={!['completed', 'pending', 'cancelled'].includes(order.status)}
                  class:text-gray-800={!['completed', 'pending', 'cancelled'].includes(order.status)}>
              {order.status || 'N/A'}
            </span>
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500">Fecha de Pedido</h3>
          <p class="mt-1">{formatDate(order.orderDate)}</p>
        </div>
      </div>

      <!-- Información del proveedor -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Información del Proveedor</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm font-medium text-gray-500">Nombre</h4>
            <p>{supplier?.name || 'N/A'}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Contacto</h4>
            <p>{supplier?.contactPerson || 'N/A'}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Teléfono</h4>
            <p>{supplier?.phone || 'N/A'}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Correo Electrónico</h4>
            <p>{supplier?.email || 'N/A'}</p>
          </div>
        </div>
      </div>
       <!-- Notas -->
       {#if order.notes}
       <div class="bg-white shadow rounded-lg p-6">
         <h3 class="text-lg font-medium text-gray-900 mb-2">Notas</h3>
         <p class="text-gray-600 whitespace-pre-line">{order.notes}</p>
       </div>
     {/if}

      <!-- Productos del pedido -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Productos</h3>
        </div>
        <div class="p-4">
          {#if order.products && order.products.length > 0}
            <Table
              columns={productColumns}
               items={productItems}
              onRowClick={() => {}}
              ifEdit={() => false}
              ifDelete={() => false}
            />
            
            <!-- Totales -->
            <div class="mt-4 border-t border-gray-200 pt-4">
              <div class="flex justify-end">
                <div class="w-full max-w-md">
                  <div class="flex justify-between py-1">
                    <span class="text-sm font-medium text-gray-700">Subtotal:</span>
                    <span class="text-sm text-gray-900">{calculateSubtotal(order.products)} €</span>
                  </div>
                  {#if hasDiscounts(order.products)}
                    <div class="flex justify-between py-1">
                      <span class="text-sm font-medium text-gray-700">Descuentos:</span>
                      <span class="text-sm text-red-600">-{calculateDiscounts(order.products)} €</span>
                    </div>
                  {/if}
                  <div class="flex justify-between pt-2 mt-2 border-t border-gray-200">
                    <span class="text-base font-semibold text-gray-900">Total:</span>
                    <span class="text-base font-semibold text-gray-900">{calculateTotal(order.products)} €</span>
                  </div>
                </div>
              </div>
            </div>
          {:else}
            <div class="text-center py-4 text-sm text-gray-500">
              No hay productos en este pedido
            </div>
          {/if}
        </div>
      </div>

     
    </div>
  {/if}

  <div class="mt-6 flex justify-end space-x-3">
    <Button variant="secondary" onclick={onClose} size="md">
      Cerrar
    </Button>
  </div>
</Modal>