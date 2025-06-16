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
	import type { warehouse as warehouseType, Section } from '$lib/types/warehouse.types';
	import TextArea from '$lib/components/utilities/Form/TextArea.svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();
	let sections = $state(data.sections || []);
	let warehouse = $state(data.warehouse as warehouseType);
	let search = $state('');
	let showDrawer = $state(false);
	let showEditDrawer = $state(false);
	let showDeleteDialog = $state(false);
	let sectionToDelete: Section | null = $state(null);
	let editingSection: Section | null = $state(null);
	let toastList: {
		addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
	} | null = null;

	$effect(() => {
		sections = data.sections || [];
		warehouse = data.warehouse as warehouseType;
	});

	let filteredSections = $derived(
		sections.filter(
			(section) =>
				section.name.toLowerCase().includes(search.toLowerCase()) ||
				(section.description && section.description.toLowerCase().includes(search.toLowerCase()))
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

	function goToSection(sectionId: string) {
		goto(`/dashboard/warehouses/${warehouse?.id}/${sectionId}`);
	}

	function promptDelete(section: Section) {
		sectionToDelete = section;
		showDeleteDialog = true;
	}

	async function handleDelete() {
		if (!sectionToDelete) return;

		try {
			const formData = new FormData();
			formData.append('id', sectionToDelete.id);

			const res = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			const result = await res.json();
			if (result.type === 'failure') {
				throw new Error('Could not delete section');
			}

			sections = sections.filter((s) => s.id !== sectionToDelete!.id);
			page.data.sections = sections;

			showSuccess(`Section "${sectionToDelete.name}" deleted successfully`);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Error deleting section';
			showError(errorMessage);
		} finally {
			showDeleteDialog = false;
			sectionToDelete = null;
		}
	}

	function handleEdit(section: Section) {
		editingSection = section;
		showEditDrawer = true;
	}

	function closeEditDrawer() {
		showEditDrawer = false;
		editingSection = null;
	}
</script>

<section
	class="min-h-screen w-full"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<CircleNavigation
		currentView="sections"
		onNavigate={(view) => {
			if (view === 'warehouses') {
				goto('/dashboard/warehouses');
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
					<span class="hidden md:inline">Add Section</span>
				</Button>
			</div>
		</div>
	</CircleNavigation>

	<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
		<div class="p-6">
			<div class="mb-4">
				<h2 class="text-lg font-semibold text-gray-900">
					{sections.length} sections in {warehouse?.name || 'Loading...'}
				</h2>
				{#if warehouse?.description}
					<p class="text-sm text-gray-600">{warehouse.description}</p>
				{/if}
			</div>

			{#if filteredSections.length > 0}
			<div class="p-4">
				<Table
					columns={['name', 'location', 'description']}
					items={filteredSections}
					onRowClick={(item) => goToSection(item.id)}
					onEdit={(item) => handleEdit(item)}
					onDelete={(item) => promptDelete(item)}
				/>
				</div>
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
					<h3 class="mt-2 text-sm font-medium text-gray-900">No sections</h3>
					<p class="mt-1 text-sm text-gray-500">Get started by creating a new section.</p>
					<div class="mt-6">
						<Button onclick={openDrawer} variant="primary" size="sm">Create Section</Button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<Drawer title="Create New Section" onClose={closeDrawer} show={showDrawer}>
	<form
		method="POST"
		action="?/create"
		use:enhance={({ formData }) => {
			return async ({ result, update }) => {
				if (result.type === 'success' && result.data?.success) {
					showSuccess('Section created successfully');
					closeDrawer();
					await update();
				} else if (result.type === 'failure') {
					const errorMessage = result.data?.message || 'Could not create section';
					showError(String(errorMessage));
				}
			};
		}}
		class="space-y-4"
	>
		<TextInput name="name" label="Section Name" required placeholder="Section Name" />
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

<Drawer title="Edit Section" onClose={closeEditDrawer} show={showEditDrawer}>
	<form
		method="POST"
		action="?/update"
		use:enhance={({ formData }) => {
			console.log('Iniciando envío del formulario');
			if (!editingSection) {
				console.error('No hay sección para editar');
				return;
			}

			console.log('Editando sección:', editingSection);
			formData.append('id', editingSection.id);

			return async ({ result, update }) => {
				console.log('Respuesta del servidor:', result);
				if (result.type === 'success' && result.data?.success) {
					const name = formData.get('name')?.toString() || '';
					const location = formData.get('location')?.toString() || '';
					const description = formData.get('description')?.toString() || '';

					sections = sections.map((section) =>
						section.id === editingSection?.id
							? { ...section, name, location, description }
							: section
					);

					page.data.sections = sections;
					showSuccess('Section updated successfully');
					closeEditDrawer();
					await update();
				} else if (result.type === 'failure') {
					const errorMessage = result.data?.message || 'Failed to update section';
					showError(String(errorMessage));
				}
			};
		}}
		class="space-y-4"
	>
		<input type="hidden" name="id" value={editingSection?.id || ''} />
		<TextInput
			name="name"
			label="Section Name"
			required
			placeholder="Section Name"
			value={editingSection?.name || ''}
		/>
		<TextInput
			name="location"
			label="Location"
			required
			placeholder="Location"
			value={editingSection?.location || ''}
		/>
		<TextArea
			name="description"
			label="Description"
			placeholder="Description"
			value={editingSection?.description || ''}
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
	message={`Are you sure you want to delete section "${sectionToDelete?.name || ''}"? This action cannot be undone.`}
	onConfirm={handleDelete}
	onCancel={() => {
		showDeleteDialog = false;
		sectionToDelete = null;
	}}
/>

<ToastList bind:this={toastList} />
