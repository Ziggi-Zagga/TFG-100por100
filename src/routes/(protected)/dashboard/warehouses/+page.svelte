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
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import TextArea from '$lib/components/utilities/Form/TextArea.svelte';
	import { fade } from 'svelte/transition';

	let showDrawer = $state(false);
	let showEditDrawer = $state(false);
	let showDeleteDialog = $state(false);
	let warehouseToDelete: { id: string; name: string } | null = $state(null);
	let editingwarehouse = $state<{
		id: string;
		name: string;
		location: string | null;
		description: string | null;
	} | null>(null);
	let search = $state('');

	let warehouses = $state(page.data.warehouse || []);

	$effect(() => {
		warehouses = page.data.warehouse || [];
	});

	let toastList: {
		addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
	} | null = null;

	function showSuccess(message: string) {
		toastList?.addToast(message, 'success');
	}

	function showError(message: string) {
		toastList?.addToast(message, 'error');
	}

	const filteredWarehouse = $derived(() =>
		warehouses.filter(
			(warehouse: any) =>
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

	async function promptDelete(warehouse: { id: string; name: string }, event: Event) {
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
			if (result.type === 'failure') {
				let errorMessage = 'Could not delete warehouse';
				try {
					const errorData = JSON.parse(result.data);
					errorMessage = Array.isArray(errorData)
						? errorData[errorData.length - 1]
						: errorData.message || errorMessage;
				} catch {}
				throw new Error(errorMessage);
			}

			warehouses = warehouses.filter((w: any) => w.id !== warehouseToDelete!.id);

			page.data.warehouse = warehouses;

			showSuccess(`Warehouse "${warehouseToDelete.name}" deleted successfully`);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Error deleting warehouse';
			showError(errorMessage);
		} finally {
			showDeleteDialog = false;
			warehouseToDelete = null;
		}
	}

	function handleEdit(warehouseId: string, event: Event) {
		event.stopPropagation();
		const foundWarehouse = warehouses.find((w: any) => w.id === warehouseId);
		if (foundWarehouse) {
			editingwarehouse = foundWarehouse;
			showEditDrawer = true;
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

<section
	class="min-h-screen w-full"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<PageHeader
		title="Warehouse Management"
		subtitle="{warehouses.length} warehouse{warehouses.length !== 1 ? 's' : ''}"
	>
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

	<div class="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each filteredWarehouse() as warehouseItem}
			{@const warehouse = warehouseItem}
			<div class="group relative">
				<button
					onclick={() => handleCardClick(warehouse.id)}
					class="w-full overflow-hidden rounded-2xl border-2 border-transparent bg-white p-6 text-left shadow-md transition-all hover:border-2 hover:border-blue-200 hover:bg-gray-50 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none active:scale-[0.99]"
					aria-label={`Warehouse ${warehouse.name}`}
				>
					<div class="flex flex-col items-center text-center">
						<div
							class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
						>
							<img src="/icons/svg/warehouse.svg" class="h-12 w-12" alt="warehouse" />
						</div>
						<h3 class="mb-1 text-lg font-semibold text-gray-900">{warehouse.name}</h3>
						<div class="flex items-center text-sm text-gray-500">
							<Icon icon="location" size={18} />
							<div class="text-sm text-gray-600">{warehouse.location || 'No location'}</div>
						</div>
					</div>
				</button>

				<div class="absolute top-4 right-4 flex gap-2">
					<button
						onclick={(e) => handleEdit(warehouse.id, e)}
						class="z-10 rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
						title="Edit"
						aria-label={`Editar ${warehouse.name}`}
					>
						<Icon icon="edit" size={16} />
					</button>
					<button
						onclick={(e) => promptDelete(warehouse, e)}
						class="z-10 rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
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

<Drawer title="Create New warehouse" onClose={closeDrawer} show={showDrawer}>
	<form
		method="POST"
		action="?/create"
		use:enhance={({ formData }) => {
			return async ({ result, update }) => {
				console.log('Enhanced result:', result);

				if (result.type === 'success' && result.data?.success) {
					const newWarehouse = result.data.warehouse;
					if (newWarehouse) {
						warehouses = [...warehouses, newWarehouse];
						page.data.warehouse = warehouses;
					}

					showSuccess('Warehouse created successfully');
					closeDrawer();
					await update();
				} else if (result.type === 'failure') {
					const errorMessage = result.data?.message || 'Could not create warehouse';
					showError(String(errorMessage));
				} else {
					console.error('Unexpected result:', result);
					showError('Unexpected response from server');
				}
			};
		}}
		class="space-y-4"
	>
		<TextInput name="name" label="Warehouse Name" required placeholder="warehouse Name" />
		<TextInput name="location" label="Location" required placeholder="Location" />
		<TextArea name="description" label="Description" placeholder="Description" />

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

<Drawer title="Edit warehouse" onClose={closeEditDrawer} show={showEditDrawer}>
	<form
		method="POST"
		action="?/update"
		use:enhance={({ formData }) => {
			if (!editingwarehouse) return;

			// Agregar el ID al formData
			formData.append('id', editingwarehouse.id);

			return async ({ result, update }) => {
				console.log('Update result:', result);

				if (result.type === 'success' && result.data?.success) {
					const name = formData.get('name')?.toString() || editingwarehouse!.name;
					const location = formData.get('location')?.toString() || editingwarehouse!.location;
					const description =
						formData.get('description')?.toString() || editingwarehouse!.description;

					warehouses = warehouses.map((w: any) =>
						w.id === editingwarehouse!.id
							? { ...w, name, location, description, updatedAt: new Date().toISOString() }
							: w
					);

					page.data.warehouse = warehouses;
					showSuccess(`Warehouse "${name}" updated successfully`);
					closeEditDrawer();
					await update();
				} else if (result.type === 'failure') {
					const errorMessage =
						result.data?.message || 'An error occurred while updating the warehouse';
					showError(String(errorMessage));
				} else {
					console.error('Unexpected update result:', result);
					showError('Unexpected response from server');
				}
			};
		}}
		class="space-y-4"
	>
		<input type="hidden" name="id" value={editingwarehouse?.id || ''} />
		<TextInput
			name="name"
			label="Warehouse Name"
			required
			placeholder="warehouse Name"
			value={editingwarehouse?.name || ''}
		/>
		<TextInput
			name="location"
			label="Location"
			required
			placeholder="Location"
			value={editingwarehouse?.location || ''}
		/>
		<TextArea
			name="description"
			label="Description"
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

<ConfirmDialog
	show={showDeleteDialog}
	message={`Are you sure you want to delete warehouse "${warehouseToDelete?.name || ''}"? This action cannot be undone.`}
	onConfirm={handleDelete}
	onCancel={() => {
		showDeleteDialog = false;
		warehouseToDelete = null;
	}}
/>

<ToastList bind:this={toastList} />
