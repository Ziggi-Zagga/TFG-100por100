<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Icon from '$lib/components/utilities/Icons/Icon.svelte';
	import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
	import ToastList from '$lib/components/utilities/Toast/ToastList.svelte';

	const { data } = $props();

	let warehouse = $state([...data.warehouse]);
	let showDrawer = $state(false);
	let showEditDrawer = $state(false);
	let showDeleteDialog = $state(false);
	let warehouseToDelete: { id: string, name: string } | null = $state(null);
	let editingwarehouse = $state<{id: string, name: string, location: string | null, description: string | null} | null>(null);
	let search = $state('');

	// Referencia al componente ToastList
	let toastList: { addToast: (message: string, type?: 'success' | 'error' | 'info') => void } | null = null;

	// Helper functions for showing toasts
	function showSuccess(message: string) {
		toastList?.addToast(message, 'success');
	}

	function showError(message: string) {
		toastList?.addToast(message, 'error');
	}

	const filteredWarehouse = $derived(() =>
		warehouse.filter((warehouse) =>
			warehouse.name.toLowerCase().includes(search.toLowerCase()) ||
			(warehouse.location ?? '').toLowerCase().includes(search.toLowerCase())
		)
	);

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	function goTowarehouseDetails(id: string) {
		goto(`/dashboard/warehouses/${id}`);
	}

	async function promptDelete(warehouse: { id: string, name: string }, event: Event) {
		event.stopPropagation();
		warehouseToDelete = warehouse;
		showDeleteDialog = true;
	}

	async function handleDelete() {
		if (!warehouseToDelete) return;

		try {
			const formData = new FormData();
			formData.append('id', warehouseToDelete.id);

			const res = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			const result = await res.json();

			if (res.ok && result.success) {
				warehouse = warehouse.filter((s) => s.id !== warehouseToDelete?.id);
				showSuccess(`Warehouse "${warehouseToDelete.name}" deleted successfully`);
			} else {
				console.log(result);
				console.log(res);
				const error = result.message || 'Failed to delete warehouse';
				console.error('Failed to delete warehouse:', error);
				showError(error);
			}
		} catch (error) {
			console.error('Error deleting warehouse:', error);
			showError('An error occurred while deleting the warehouse');
		} finally {
			showDeleteDialog = false;
			warehouseToDelete = null;
		}
	}

	function handleEdit(warehouseId: string, event: Event) {
		event.stopPropagation();
		const foundWarehouse = warehouse.find(w => w.id === warehouseId);
		if (foundWarehouse) {
			editingwarehouse = foundWarehouse;
			showEditDrawer = true;
		}
	}

	async function handleUpdatewarehouse(formData: FormData) {
		if (!editingwarehouse) return;
		try {
			formData.append('id', editingwarehouse.id);
			
			const res = await fetch('?/update', {
				method: 'POST',
				body: formData
			});

			const result = await res.json();
			
			if (res.ok && result.success) {
				// Update the warehouse in the local state with the updated data
				warehouse = warehouse.map((w) => 
					w.id === editingwarehouse?.id ? { ...w, ...result.warehouse } : w
				);
				showSuccess(`Warehouse "${result.warehouse.name}" updated successfully`);
			} else {
				const error = result.message || 'Failed to update warehouse';
				showError(`Failed to update warehouse: ${error}`);
			}
		} catch (error) {
			console.error('Update error:', error);
			showError('An error occurred while updating the warehouse');
		} finally {
			closeEditDrawer();
		}
	}

	function closeEditDrawer() {
		showEditDrawer = false;
		editingwarehouse = null;
	}

	function handleCardClick(warehouseId: string) {
		goTowarehouseDetails(warehouseId);
	}
</script>

<!-- Main Content Section -->
<section class="min-h-screen w-full" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
	<PageHeader title="Warehouse Management" subtitle="{warehouse.length} warehouse{warehouse.length !== 1 ? 's' : ''}">
		<div class="flex w-full flex-col items-center gap-4 md:flex-row">
			<div class="w-60 md:flex-[3] lg:flex-[4]">
				<SearchBar bind:search placeholder="Search by name or location..." extraClasses="w-full" />
			</div>
			<div class="flex w-full justify-end md:w-auto">
				<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
					
					<span class="hidden md:inline">Add warehouse</span>
				</Button>
			</div>
		</div>
	</PageHeader>

	<div class="grid grid-cols-1 ml-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each filteredWarehouse() as warehouseItem}
			{@const warehouse = warehouseItem}
			<div class="group relative">
				<button 
					onclick={() => handleCardClick(warehouse.id)}
					class="w-full text-left overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-lg hover:bg-gray-50 active:scale-[0.99] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
					aria-label={`Ver detalles de ${warehouse.name}. Presione Enter para más información.`}
				>
					<!-- Contenido de la tarjeta -->
					<div class="flex flex-col items-center text-center">
						<!-- Ícono de la tienda -->
						<div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
							<img src="/icons/svg/warehouse.svg" class="w-12 h-12" alt="warehouse" />
						</div>

						<!-- Nombre de la tienda -->
						<h3 class="mb-1 text-lg font-semibold text-gray-900">{warehouse.name}</h3>

						<!-- Ubicación -->
						<div class="flex items-center text-sm text-gray-500">
							<Icon icon="location" size={18} />
							<div class="text-sm text-gray-600">{warehouse.location || 'No location'}</div>
						</div>
					</div>
				</button>

				<!-- Botones de acción -->
				<div class="absolute right-4 top-4 flex gap-2">
					<button
						onclick={(e) => handleEdit(warehouse.id, e)}
						class="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 z-10"
						title="Edit"
						aria-label={`Editar ${warehouse.name}`}
					>
						<Icon icon="edit" size={16} />
					</button>
					<button
						onclick={(e) => promptDelete(warehouse, e)}
						class="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 z-10"
						title="Delete"
						aria-label={`Delete ${warehouse.name}`}
					>
						<Icon icon="delete" size={16} />
					</button>
				</div>

			</div>
		{/each}
	</div>
</section>

<!-- Drawer Component (Moved outside the main section) -->
<Drawer 
	title="Create New warehouse" 
	onClose={closeDrawer}
	show={showDrawer}
>
	<form method="POST" action="?/create" class="space-y-4">
		<TextInput name="name" required placeholder="warehouse Name" />
		<TextInput name="location" required placeholder="Location" />
		<TextInput name="description" placeholder="Description" />

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
			Create
			</button>
		</div>
	</form>
</Drawer>

<!-- Drawer de edición -->
<Drawer 
	title="Edit warehouse" 
	onClose={closeEditDrawer}
	show={showEditDrawer}
>
	<form 
		onsubmit={async (e) => {
			e.preventDefault();
			if (!editingwarehouse) return;
			
			const form = e.target as HTMLFormElement;
			const formData = new FormData(form);
			
			editingwarehouse = {
				...editingwarehouse,
				name: formData.get('name')?.toString().trim() || '',
				location: formData.get('location')?.toString().trim() || '',
				description: formData.get('description')?.toString().trim() || ''
			};
			
			await handleUpdatewarehouse(formData);
			closeEditDrawer();
		}}
		class="space-y-4">
		<TextInput 
			name="name"
			required 
			placeholder="warehouse Name" 
			value={editingwarehouse?.name || ''}
		/>
		<TextInput 
			name="location" 
			required 
			placeholder="Location" 
			value={editingwarehouse?.location || ''}
		/>
		<TextInput 
			name="description" 
			placeholder="Description" 
			value={editingwarehouse?.description || ''}
		/>

		<div class="mt-6 flex justify-end gap-4">
			<button 
				type="button" 
				onclick={closeEditDrawer} 
				class="rounded-xl bg-gray-200 px-6 py-2 font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
			>
				Cancel
			</button>
			<button 
				type="submit"
				class="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 font-semibold text-white shadow-md hover:from-blue-600 hover:to-indigo-600"
			>
				Save Changes
			</button>
		</div>
	</form>
</Drawer>

<!-- Diálogo de confirmación de eliminación -->
<ConfirmDialog
	show={showDeleteDialog}
	message={`Are you sure you want to delete warehouse "${warehouseToDelete?.name || ''}"? This action cannot be undone.`}
	onConfirm={handleDelete}
	onCancel={() => {
		showDeleteDialog = false;
		warehouseToDelete = null;
	}}
/>

<!-- Notificaciones Toast -->
<ToastList bind:this={toastList} />
