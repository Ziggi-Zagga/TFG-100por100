<script lang="ts">
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import CircleNavigation from '$lib/components/dashboard/Warehouses/CircleNavigation.svelte';
	import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
	import ToastList from '$lib/components/utilities/Toast/ToastList.svelte';
	import { page } from '$app/state';
	import type { warehouse as warehouseType, Section, Row } from '$lib/types/warehouse.types';
	import TextArea from '$lib/components/utilities/Form/TextArea.svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();
	let sections = $state(data.sections || []);
	let warehouse = $state(data.warehouse as warehouseType);
	let rows = $state(data.currentSection?.rows || []);
	let search = $state('');
	let showDrawer = $state(false);
	let showEditDrawer = $state(false);
	let showDeleteDialog = $state(false);
	let rowToDelete: Row | null = $state(null);
	let editingRow: Row | null = $state(null);
	let toastList: {
		addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
	} | null = null;

	// Update sections when data changes
	$effect(() => {
		sections = data.sections || [];
		warehouse = data.warehouse as warehouseType;
		rows = data.currentSection?.rows || [];
	});

	let filteredRows = $derived(
		rows.filter(
			(row) =>
				row.name.toLowerCase().includes(search.toLowerCase()) ||
				(row.description && row.description.toLowerCase().includes(search.toLowerCase()))
		)
	);

	function showSuccess(message: string) {
		toastList?.addToast(message, 'success');
	}

	function showError(message: string) {
		toastList?.addToast(message, 'error');
	}

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	function goToRow(rowId: string) {
		goto(`/dashboard/warehouses/${warehouse?.id}/${data.currentSection?.id}/${rowId}`);
	}

	function promptDelete(row: Row) {
		rowToDelete = row;
		showDeleteDialog = true;
	}

	async function handleDelete() {
		if (!rowToDelete) return;

		try {
			const formData = new FormData();
			formData.append('id', rowToDelete.id);

			const res = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			const result = await res.json();
			if (result.type === 'failure') {
				throw new Error('Could not delete section');
			}

			// Update local state
			rows = rows.filter((r) => r.id !== rowToDelete!.id);
			page.data.currentSection!.rows = rows;

			showSuccess(`Row "${rowToDelete.name}" deleted successfully`);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Error deleting row';
			showError(errorMessage);
		} finally {
			showDeleteDialog = false;
			rowToDelete = null;
		}
	}

	function handleEdit(row: Row) {
		editingRow = row;
		showEditDrawer = true;
	}

	function closeEditDrawer() {
		showEditDrawer = false;
		editingRow = null;
	}
</script>

<section
	class="min-h-screen w-full"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<CircleNavigation
		currentView="rows"
		onNavigate={(view) => {
			if (view === 'warehouses') {
				goto('/dashboard/warehouses');
			}
			if (view === 'sections') {
				goto(`/dashboard/warehouses/${warehouse?.id}`);
			}
		}}
	>
		<div class="flex w-full flex-col items-center gap-4 md:flex-row">
			<div class="w-60 md:flex-[3] lg:flex-[4]">
				<SearchBar
					bind:search
					placeholder="Search by name or description..."
					extraClasses="w-full"
				/>
			</div>
			<div class="flex w-full justify-end md:w-auto">
				<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
					<span class="hidden md:inline">Add Row</span>
				</Button>
			</div>
		</div>
	</CircleNavigation>

	<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
		<div class="p-6">
			<div class="mb-4">
				<h2 class="text-lg font-semibold text-gray-900">
					{rows.length} rows in {data.currentSection?.name || 'Loading...'}
				</h2>
				{#if data.currentSection?.description}
					<p class="text-sm text-gray-600">{data.currentSection.description}</p>
				{/if}
			</div>

			{#if filteredRows.length > 0}
				<Table
					columns={['name', 'location', 'description']}
					items={filteredRows}
					onRowClick={(item) => goToRow(item.id)}
					onEdit={(item) => handleEdit(item)}
					onDelete={(item) => promptDelete(item)}
				/>
			{:else}
				<div class="py-12 text-center">
					<div class="mx-auto h-12 w-12 text-gray-400">
						<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
							/>
						</svg>
					</div>
					<h3 class="mt-2 text-sm font-medium text-gray-900">No rows</h3>
					<p class="mt-1 text-sm text-gray-500">Get started by creating a new row.</p>
					<div class="mt-6">
						<Button onclick={openDrawer} variant="primary" size="sm">Create Row</Button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- Create Row Drawer -->
<Drawer title="Create New Row" onClose={closeDrawer} show={showDrawer}>
	<form
		method="POST"
		action="?/create"
		use:enhance={({ formData }) => {
			return async ({ result, update }) => {
				if (result.type === 'success' && result.data?.success) {
					showSuccess('Row created successfully');
					closeDrawer();
					await update();
				} else if (result.type === 'failure') {
					const errorMessage = result.data?.message || 'Could not create row';
					showError(String(errorMessage));
				}
			};
		}}
		class="space-y-4"
	>
		<TextInput name="name" label="Row Name" required placeholder="Row Name" />
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

<!-- Edit Row Drawer -->
<Drawer title="Edit Row" onClose={closeEditDrawer} show={showEditDrawer}>
	<form
		method="POST"
		action="?/update"
		use:enhance={({ formData }) => {
			console.log('Iniciando envío del formulario');
			if (!editingRow) {
				console.error('No hay sección para editar');
				return;
			}

			console.log('Editando sección:', editingRow);
			formData.append('id', editingRow.id);

			return async ({ result, update }) => {
				console.log('Respuesta del servidor:', result);
				if (result.type === 'success' && result.data?.success) {
					const name = formData.get('name')?.toString() || '';
					const location = formData.get('location')?.toString() || '';
					const description = formData.get('description')?.toString() || '';

					rows = rows.map((row) =>
						row.id === editingRow?.id ? { ...row, name, location, description } : row
					);

					page.data.currentSection!.rows = rows;
					showSuccess('Row updated successfully');
					closeEditDrawer();
					await update();
				} else if (result.type === 'failure') {
					const errorMessage = result.data?.message || 'Failed to update row';
					showError(String(errorMessage));
				}
			};
		}}
		class="space-y-4"
	>
		<input type="hidden" name="id" value={editingRow?.id || ''} />
		<TextInput
			name="name"
			label="Row Name"
			required
			placeholder="Row Name"
			value={editingRow?.name || ''}
		/>
		<TextInput
			name="location"
			label="Location"
			required
			placeholder="Location"
			value={editingRow?.location || ''}
		/>
		<TextArea
			name="description"
			label="Description"
			placeholder="Description"
			value={editingRow?.description || ''}
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
	message={`Are you sure you want to delete row "${rowToDelete?.name || ''}"? This action cannot be undone.`}
	onConfirm={handleDelete}
	onCancel={() => {
		showDeleteDialog = false;
		rowToDelete = null;
	}}
/>

<ToastList bind:this={toastList} />
