<script lang="ts">
        import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
        import Table from '$lib/components/utilities/table/Table.svelte';
        import Button from '$lib/components/utilities/Button/Button.svelte';
        import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
        import TextArea from '$lib/components/utilities/Form/TextArea.svelte';
        import ComboBox from '$lib/components/utilities/Form/ComboBox.svelte';
        import Modal from '$lib/components/utilities/Modal/Modal.svelte';
        import OrderDetails from '$lib/components/dashboard/Orders/OrderDetails.svelte';
        import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
        import type { Supplier } from '$lib/types/products.types';
     
        const { data } = $props();
        let orders = $state([...data.orders]);
        let suppliers = $state<any[]>([]); // Añadido para resolver el error de 'suppliers' no encontrado
        let closeDrawer = () => {}; // Añadido para resolver el error de 'closeDrawer' no encontrado
     
        let showOrderDetails = $state(false);
        let search = $state('');
        let selectedProducts = $state<any[]>([]);
        let selectedOrder = $state<any>(null);
        let currentSupplier = $state<Supplier | null>(null);
        let showDeleteDialog = $state(false);
        let orderToDelete: { id: string, orderNumber: string } | null = $state(null);
     
        let formData = $state({
           orderNumber: '',
           supplierId: '',
           orderDate: '',
           expectedArrival: '',
           notes: ''
        });
     
        let supplierDisplayValue = $state('');
        const productColumns = ['code', 'name', 'price', 'quantity', 'discount', 'total'];
     
        const productColumnTypes: Record<string, any> = {
           code: { type: 'text', editable: false },
           name: { type: 'text', editable: false },
           price: { type: 'number', editable: false },
           quantity: { type: 'number', editable: true },
           discount: { type: 'number', editable: true },
           total: { type: 'number', editable: false }
        };
     
        function onCloseDrawerDetails() {
           showOrderDetails = false;
        }
     
        function handleViewOrder(order: any) {
           try {
              if (!selectedOrder || order.id !== selectedOrder.id) {
                 const orderWithProducts = {
                    ...order,
                    products: Array.isArray(order.products) ? order.products : [order.products].filter(Boolean)       
                 };
     
                 selectedOrder = orderWithProducts;
                 currentSupplier = null;
     
                 const supplierId = orderWithProducts.supplierId || orderWithProducts.supplierid;
     
                 if (supplierId) {
                    const foundSupplier = suppliers.find((s: any) => 
                       s.id === supplierId || 
                       s.id.toString() === supplierId.toString()
                    );
     
                    if (foundSupplier) {
                       currentSupplier = foundSupplier;
                    } else {
                       console.warn('Supplier not found for ID:', supplierId);
                    }
                 }
     
                 showOrderDetails = true;
              } else {
                 showOrderDetails = !showOrderDetails;
              }
           } catch (error) {
              console.error('Error in handleViewOrder:', error);
              showOrderDetails = false;
           }
        }
     
     
        const filteredOrders = $derived(
           orders.filter(
              (order: any) =>
                 order.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
                 order.status?.toLowerCase().includes(search.toLowerCase())
           )
        );
     
        async function handleStatusChange(order: any, column: string, newStatus: string) {
           const oldStatus = order[column];
     
           try {
              order[column] = newStatus;
     
              const formData = new FormData();
              formData.append('id', order.id);
              formData.append('status', newStatus);
     
              const response = await fetch('?/update', {
                 method: 'POST',
                 body: formData
              });
     
              if (!response.ok) {
                 throw new Error('Error al actualizar el estado del pedido');
              }
     
              const result = await response.json();
              if (result.error) {
                 throw new Error(result.message || 'Error al actualizar el pedido');
              }
     
              return true;
           } catch (error) {
              console.error('Error al actualizar el estado:', error);
              order[column] = oldStatus;
              return false;
           }
        }
     
        function handleSupplierSelect(supplierName: string) {
           const supplier = suppliers.find((s: any) => s.name === supplierName);
           if (supplier) {
              currentSupplier = supplier;
              formData.supplierId = supplier.id;
           } else {
              currentSupplier = null;
              formData.supplierId = '';
           }
        }
     
        function confirmDelete(order: { id: string, orderNumber: string }) {
           orderToDelete = order;
           showDeleteDialog = true;
        }
     
        async function handleDelete() {
           if (!orderToDelete) return;
     
           try {
              const formData = new FormData();
              formData.append('id', orderToDelete.id);
     
              const response = await fetch('?/delete', {
                 method: 'POST',
                 body: formData
              });
     
              if (response.ok) {
                 orders = orders.filter(order => order.id !== orderToDelete?.id);
                 alert('Order deleted successfully');
              } else {
                 const result = await response.json();
                 console.error('Error deleting order:', result.message);
                 alert('Error deleting order: ' + (result.message || 'Unknown error'));
              }
           } catch (error) {
              console.error('Error deleting order:', error);
              alert('Error deleting order. Please try again.');
           } finally {
              showDeleteDialog = false;
              orderToDelete = null;
           }
        }
     
        function handleProductChange(item: any, column: string, value: number) {
           const newValue = Number(value);
           if (item[column] === newValue) return;
     
           selectedProducts = selectedProducts.map(p =>
              p.id === item.id ? { ...p, [column]: newValue } : p
           );
        }
     
        async function handleSubmit(event: Event) {
           event.preventDefault();
           const form = event.target as HTMLFormElement;
           const formData = new FormData(form);
     
           formData.set('items', JSON.stringify(selectedProducts.map(p => ({
              productId: p.id,
              quantity: p.quantity,
              price: p.price,
              discount: p.discount || 0
           }))));
     
           try {
              const response = await fetch(form.action, {
                 method: 'POST',
                 body: formData
              });
     
              if (response.ok) {
                 closeDrawer();
                 window.location.reload();
              } else {
                 console.error('Error al crear la orden');
              }
           } catch (error) {
              console.error('Error al enviar el formulario:', error);
           }
        }
     </script>
     
     <div class="order-modal">
        <SearchBar bind:search={search} placeholder="Search orders..." />
        
        <Table
           columns={['orderNumber', 'status', 'orderDate', 'expectedArrival', 'actions']}
           items={filteredOrders}
           onRowClick={handleViewOrder}
           onDelete={confirmDelete}
           onCellChange={handleStatusChange}
        />
     
        {#if showOrderDetails && selectedOrder}
           <OrderDetails
              bind:isOpen={showOrderDetails}
              order={selectedOrder}
              supplier={currentSupplier || undefined}
              onClose={onCloseDrawerDetails}
           />
        {/if}
     
        {#if showDeleteDialog}
           <ConfirmDialog
              show={showDeleteDialog}
              message={`Are you sure you want to delete order #${orderToDelete?.orderNumber || ''}?`}
              onConfirm={handleDelete}
              onCancel={() => showDeleteDialog = false}
           />
        {/if}
     </div>
     