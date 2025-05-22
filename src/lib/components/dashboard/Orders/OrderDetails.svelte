<script lang="ts">
  import Button from '$lib/components/utilities/Button/Button.svelte';
  import Modal from '$lib/components/utilities/Modal/Modal.svelte';

  let { isOpen = $bindable<boolean>(), order, onClose } = $props<{
    isOpen?: boolean;
    order?: any;
    onClose?: () => void;
  }>();

  $effect (() => {
    if (order) {
      // Asegurarse de que los productos sean un array
      if (order.products && !Array.isArray(order.products)) {
        order.products = [order.products];
      }
    }
  });

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
</script>

<Modal title="Detalles del Pedido" size="md" onClose={onClose}>
  {#if order}
    <div class="space-y-6">
      <!-- Información general del pedido -->
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
            <p>{order.supplier?.name || 'N/A'}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Contacto</h4>
            <p>{order.supplier?.contactPerson || 'N/A'}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Teléfono</h4>
            <p>{order.supplier?.phone || 'N/A'}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Correo Electrónico</h4>
            <p>{order.supplier?.email || 'N/A'}</p>
          </div>
        </div>
      </div>

      <!-- Productos del pedido -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Productos</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#if order.products && order.products.length > 0}
                {#each order.products as product}
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.code || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{parseFloat(product.price || 0).toFixed(2)} €</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.quantity || 0}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{parseFloat(product.discount || 0).toFixed(0)}%</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {((parseFloat(product.price || 0) * parseFloat(product.quantity || 0)) * (1 - (parseFloat(product.discount || 0) / 100))).toFixed(2)} €
                    </td>
                  </tr>
                {/each}
              {:else}
                <tr>
                  <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">No hay productos en este pedido</td>
                </tr>
              {/if}
            </tbody>
            <tfoot class="bg-gray-50">
              <tr>
                <td colspan="5" class="px-6 py-3 text-right text-sm font-medium text-gray-500">Total:</td>
                <td class="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  {calculateTotal(order.products)} €
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Notas -->
      {#if order.notes}
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Notas</h3>
          <p class="text-gray-600 whitespace-pre-line">{order.notes}</p>
        </div>
      {/if}
    </div>
  {/if}

  <div class="mt-6 flex justify-end space-x-3">
    <Button variant="secondary" onclick={onClose} size="md">
      Cerrar
    </Button>
  </div>
</Modal>